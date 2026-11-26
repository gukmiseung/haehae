import { useEffect, useRef, useState } from 'react'
import { conversationRiskLabels } from '../lib/conversationAnalysis'
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

const exampleRecords = [
  { id: 1, type: 'conversation', title: '금융기관 사칭 의심 대화', date: '2026-11-20T14:32', risk: 'high' },
  { id: 2, type: 'url', title: '택배 배송 안내 링크', date: '2026-11-18T09:17', risk: 'caution' },
  { id: 3, type: 'phone', title: '010-****-4832', date: '2026-11-15T19:04', risk: 'unreported' },
  { id: 4, type: 'account', title: '***-****-**123', date: '2026-11-13T12:11', risk: 'unreported' },
  { id: 5, type: 'conversation', title: '가족 사칭 송금 요청', date: '2026-11-11T16:05', risk: 'high' },
  { id: 6, type: 'url', title: '공공기관 안내 문자 링크', date: '2026-11-09T10:42', risk: 'caution' },
  { id: 7, type: 'account', title: '***-****-**271', date: '2026-11-07T13:10', risk: 'unreported' },
  { id: 8, type: 'phone', title: '010-****-6981', date: '2026-11-05T11:20', risk: 'unreported' },
  { id: 9, type: 'url', title: '이벤트 당첨 안내 링크', date: '2026-11-03T15:35', risk: 'caution' },
  { id: 10, type: 'conversation', title: '저금리 대출 상담 메시지', date: '2026-11-02T09:30', risk: 'high' },
  { id: 11, type: 'phone', title: '010-****-0217', date: '2026-11-01T17:15', risk: 'unreported' },
  { id: 12, type: 'account', title: '***-****-**890', date: '2026-11-01T08:45', risk: 'unreported' },
].map((record) => ({ ...record, isExample: true }))

const pageSize = 4
const storageKey = 'safeguard-dismissed-example-records'

function readDismissedIds() {
  try {
    const ids = JSON.parse(window.localStorage.getItem(storageKey))
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

function RecordDate({ date }) {
  const [day, time] = date.split('T')
  return <time dateTime={date}>{day.replaceAll('-', '.')} &nbsp;{time}</time>
}

function MyPage({ records, onOpenRecord, onDeleteRecord, preview = false }) {
  const [dismissedIds, setDismissedIds] = useState(readDismissedIds)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [recordToDelete, setRecordToDelete] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const dialogRef = useRef(null)
  const headingRef = useRef(null)

  const allRecords = preview ? [] : records
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
    const element = dialogRef.current
    if (recordToDelete && !element.open) element.showModal()
  }, [recordToDelete])

  function deleteRecord(record) {
    if (record.isExample) {
      const nextIds = [...dismissedIds, record.id]
      setDismissedIds(nextIds)
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextIds))
      } catch {
        // Keep the deletion in the current view when browser storage is unavailable.
      }
    } else {
      onDeleteRecord(record.id)
    }

    setPage(Math.min(visiblePage, Math.max(1, Math.ceil((filteredRecords.length - 1) / pageSize))))
    setAnnouncement(`${record.title} 기록을 삭제했습니다.`)
    dialogRef.current.close()
    headingRef.current.focus()
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
            {preview ? '저장된 검사 결과를 다시 확인할 수 있습니다.' : '내가 진행한 검사 기록을 다시 확인할 수 있습니다.'}
          </p>

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

          <div className="sg-my-table-frame">
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
                        onClick={() => setRecordToDelete(record)}
                      >
                        기록 삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleRecords.length === 0 && (
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
        onClose={() => setRecordToDelete(null)}
      >
        {recordToDelete && (
          <>
            <h2 id="record-dialog-heading">검사 기록을 삭제할까요?</h2>
            <p>‘{recordToDelete.title}’ 기록이 목록에서 삭제됩니다.</p>
            <form method="dialog" className="sg-my-dialog-actions">
              <button type="submit" className="sg-my-close-button">취소</button>
              <button type="button" className="sg-my-delete-button" onClick={() => deleteRecord(recordToDelete)}>
                삭제
              </button>
            </form>
          </>
        )}
      </dialog>
    </main>
  )
}

export default MyPage
