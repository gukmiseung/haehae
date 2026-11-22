import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const preferenceKey = 'haehae.auth.persistence'

function authStorage() {
  return sessionStorage.getItem(preferenceKey) === 'tab'
    ? sessionStorage
    : localStorage
}

export function setSessionPersistence(remember) {
  if (remember) {
    sessionStorage.removeItem(preferenceKey)
  } else {
    sessionStorage.setItem(preferenceKey, 'tab')
  }
}

export const supabase = url && key
  ? createClient(url, key, {
    auth: {
      storage: {
        getItem: (key) => authStorage().getItem(key),
        setItem: (key, value) => authStorage().setItem(key, value),
        removeItem: (key) => authStorage().removeItem(key),
      },
    },
  })
  : null

export const authUnavailable = '인증 서비스가 아직 설정되지 않았습니다.'

export function authErrorMessage(error, fallback) {
  switch (error.code) {
    case 'invalid_credentials':
      return '이메일 또는 비밀번호를 확인해 주세요.'
    case 'email_not_confirmed':
      return '가입 확인 이메일의 링크를 먼저 열어 주세요.'
    case 'weak_password':
      return '비밀번호가 보안 요구사항을 충족하지 않습니다.'
    case 'user_already_exists':
      return '이미 등록된 이메일입니다.'
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'
    default:
      return fallback
  }
}
