export const MAX_CONVERSATION_LENGTH = 12_000

export const conversationRiskLabels = {
  high: '높음',
  caution: '주의',
  low: '낮음',
  insufficient: '판단 어려움',
}

const errorMessages = {
  INVALID_INPUT: '대화 내용과 첨부 파일 형식을 확인해 주세요.',
  NOT_CONFIGURED: 'AI 분석 서비스 설정이 필요합니다.',
  RATE_LIMITED: '현재 분석 요청 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.',
  ANALYSIS_INCOMPLETE: '대화 분석을 완료하지 못했습니다. 입력을 확인한 뒤 다시 시도해 주세요.',
}

export async function analyzeConversation({ message, imagePreview, signal }) {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '')
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error(errorMessages.NOT_CONFIGURED)

  const [, mimeType, data] = /^data:(image\/(?:png|jpeg));base64,([\s\S]+)$/.exec(imagePreview) || []
  if (imagePreview && !data) throw new Error(errorMessages.INVALID_INPUT)

  let response
  try {
    response = await fetch(`${url}/functions/v1/analyze-conversation`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, image: data ? { mimeType, data } : null }),
      signal: AbortSignal.any([signal, AbortSignal.timeout(50_000)]),
    })
  } catch {
    throw new Error('AI 분석 서비스에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.')
  }

  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(errorMessages[result?.code] ||
      'AI 분석을 요청하지 못했습니다. 잠시 후 다시 시도해 주세요.')
  }
  if (!Object.hasOwn(conversationRiskLabels, result?.riskLevel) || !Array.isArray(result.signals)) {
    throw new Error(errorMessages.ANALYSIS_INCOMPLETE)
  }

  return result
}
