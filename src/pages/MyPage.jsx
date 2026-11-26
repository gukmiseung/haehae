import { useEffect, useRef, useState } from 'react'
import { conversationRiskLabels } from '../lib/conversationAnalysis'
import { deleteInspectionRecord, readInspectionHistory } from '../lib/inspectionHistory'
import './MyPage.css'

const typeLabels = {
  conversation: '대화 분석',
  url: 'URL 검사',
  account: '계좌 조회',
  phone: '전화번호 조회',
}

const riskLabels = {
  ...conversationRiskLabels,
  high: '위험 높음',
  caution: '주의 필요',
  unreported: '신고 이력 없음',
}

const pageSize = 4

function RecordDate({ date }) {
  const [day, time] = date.split('T')
  return <time dateTime={date}>{day.replaceAll('-', '.')} &nbsp;{time}</time>
}

function MyPage({ userId, hasSaveError, onOpenRecord }) {
  const [history, setHistory] = useState({ status: 'loading', records: [] })
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [recordToDelete, setRecordToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const dialogRef = useRef(null)
  const headingRef = useRef(null)

  const preview = !userId
  const allRecords = history.records
  const keyword = query.trim().toLowerCase()
  const filteredRecords = allRecords.filter(({ type, title }) =>
    (filter === 'all' || type === filter) &&
    `${typeLabels[type]} ${title}`.toLowerCase().includes(keyword),
  )
  const pageCount = Math.ceil(filteredRecords.length / pageSize)
  const visiblePage = Math.min(page, Math.max(1, pageCount))
  const firstIndex = (visiblePage - 1) * pageSize
  const visibleRecords = filteredRecords.slice(firstIndex, firstIndex + pageSize)

  useEffect(() => {
    if (!userId) return

    let active = true
    readInspectionHistory(userId).then(
      (records) => {
        if (active) setHistory({ status: 'ready', records })
      },
      () => {
        if (active) setHistory({ status: 'error', records: [] })
      },
    )
    return () => { active = false }
  }, [userId, loadAttempt])

  useEffect(() => {
    const element = dialogRef.current
    if (recordToDelete && !element.open) element.showModal()
  }, [recordToDelete])

  async function deleteRecord(record) {
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteInspectionRecord(userId, record.id)
      setHistory((previous) => ({
        ...previous,
        records: previous.records.filter(({ id }) => id !== record.id),
      }))
      setPage(Math.min(visiblePage, Math.max(1, Math.ceil((filteredRecords.length - 1) / pageSize))))
      setAnnouncement(`${record.title} 기록을 삭제했습니다.`)
      dialogRef.current?.close()
      headingRef.current?.focus()
    } catch {
      setDeleteError('검사 기록을 삭제하지 못했습니다. 다시 시도해 주세요.')
    } finally {
      setDeleting(false)
    }
  }

  function reloadHistory() {
    setHistory({ status: 'loading', records: [] })
    setLoadAttempt((attempt) => attempt + 1)
  }

  return (
    <main className="sg-my-page" inert={preview}>
      <div className="sg-my-container">
        <header className="sg-my-heading">
          <h1>마이페이지</h1>
          <p>내가 검사했던 피싱 위험 분석 기록을 한눈에 확인하고 관리하세요.</p>
        </header>

        <section className="sg-my-panel" aria-labelledby="record-heading">
          <h2 id="record-heading" tabIndex={-1} ref={headingRef}>내 검사 기록</h2>
          <p className="sg-my-description">
            {preview ? '저장된 검사 결과를 다시 확인할 수 있습니다.' : '이 브라우저에 저장된 내 검사 기록을 다시 확인할 수 있습니다.'}
          </p>
          {hasSaveError && <p className="sg-my-description" role="alert">일부 검사 기록을 이 브라우저에 저장하지 못했습니다.</p>}

          <div className="sg-my-controls">
            <div className="sg-my-filters" role="group" aria-label="검사 유형 필터">
              {Object.entries({ all: '전체', ...typeLabels }).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-label={value === 'all' ? `${label} ${allRecords.length}건` : undefined}
                  aria-pressed={filter === value}
                  onClick={() => {
                    setFilter(value)
                    setPage(1)
                  }}
                >
                  {label}{value === 'all' && <span>{allRecords.length}</span>}
                </button>
              ))}
            </div>

            <label className="sg-my-search">
              <span className="sg-my-search-icon" aria-hidden="true" />
              <input
                type="search"
                aria-label="검사 유형이나 키워드 검색"
                placeholder="검사 유형이나 키워드 검색"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
              />
            </label>
          </div>

          <div className="sg-my-table-frame" aria-busy={!preview && history.status === 'loading'}>
            <table className="sg-my-table" aria-labelledby="record-heading" role="table">
              <thead>
                <tr>
                  <th scope="col">검사 유형</th>
                  <th scope="col">검사 내용</th>
                  <th scope="col">검사 날짜</th>
                  <th scope="col">위험도</th>
                  <th scope="col">상세 결과</th>
                  <th scope="col">기록 관리</th>
                </tr>
              </thead>
              <tbody>
                {visibleRecords.map((record) => (
                  <tr key={record.id} role="row">
                    <td className="sg-my-type" role="cell">{typeLabels[record.type]}</td>
                    <td className="sg-my-title" role="cell">{record.title}</td>
                    <td className="sg-my-date" role="cell"><RecordDate date={record.date} /></td>
                    <td className={`sg-my-risk sg-my-risk-${record.risk}`} role="cell">
                      {record.risk === 'pending'
                        ? (record.type === 'conversation' ? '분석 대기' : '조회 대기')
                        : riskLabels[record.risk]}
                    </td>
                    <td role="cell">
                      <button
                        className="sg-my-result-button"
                        type="button"
                        aria-label={`${record.title} 결과 보기`}
                        onClick={() => onOpenRecord(record)}
                      >
                        결과 보기 <span aria-hidden="true">→</span>
                      </button>
                    </td>
                    <td role="cell">
                      <button
                        className="sg-my-delete-button"
                        type="button"
                        aria-label={`${record.title} 기록 삭제`}
                        onClick={() => {
                          setDeleteError('')
                          setRecordToDelete(record)
                        }}
                      >
                        기록 삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!preview && history.status === 'loading' && (
              <p className="sg-my-empty" role="status">검사 기록을 불러오는 중입니다.</p>
            )}
            {history.status === 'error' && (
              <div className="sg-my-empty">
                <p role="alert">저장된 검사 기록을 불러오지 못했습니다.</p>
                <button type="button" className="sg-my-close-button" onClick={reloadHistory}>다시 불러오기</button>
              </div>
            )}
            {(preview || history.status === 'ready') && visibleRecords.length === 0 && (
              <p className="sg-my-empty" role="status">
                {allRecords.length === 0 ? '저장된 검사 기록이 없습니다.' : '조건에 맞는 검사 기록이 없습니다.'}
              </p>
            )}
          </div>

          {pageCount > 1 && (
            <nav className="sg-my-pagination" aria-label="검사 기록 페이지">
              <button type="button" disabled={visiblePage === 1} onClick={() => setPage(visiblePage - 1)}>
                <span aria-hidden="true">‹</span> 이전
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <button
                  key={number}
                  type="button"
                  aria-label={`${number} 페이지`}
                  aria-current={visiblePage === number ? 'page' : undefined}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}
              <button type="button" disabled={visiblePage === pageCount} onClick={() => setPage(visiblePage + 1)}>
                다음 <span aria-hidden="true">›</span>
              </button>
            </nav>
          )}
          <p className="sg-my-sr-only" role="status">{announcement}</p>
        </section>
      </div>

      <dialog
        className="sg-my-dialog"
        ref={dialogRef}
        aria-labelledby="record-dialog-heading"
        onCancel={(event) => { if (deleting) event.preventDefault() }}
        onClose={() => setRecordToDelete(null)}
      >
        {recordToDelete && (
          <>
            <h2 id="record-dialog-heading">검사 기록을 삭제할까요?</h2>
            <p>‘{recordToDelete.title}’ 기록이 목록에서 삭제됩니다.</p>
            {deleteError && <p role="alert">{deleteError}</p>}
            <form method="dialog" className="sg-my-dialog-actions">
              <button type="submit" className="sg-my-close-button" disabled={deleting}>취소</button>
              <button type="button" className="sg-my-delete-button" disabled={deleting} onClick={() => deleteRecord(recordToDelete)}>
                {deleting ? '삭제 중…' : '삭제'}
              </button>
            </form>
          </>
        )}
      </dialog>
    </main>
  )
}

export default MyPage
