import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const preferenceKey = 'haehae.auth.persistence'

export const passwordRecoveryPath = '/?reset-password=1'
// Supabase allows this exact public URL, including the trailing slash.
export const passwordRecoveryRedirectUrl = 'https://haehae.vercel.app/'

export function isPasswordRecoveryRedirect() {
  return new URLSearchParams(window.location.search).get('reset-password') === '1'
}

const hasRecoveryCallback = typeof window !== 'undefined' && (isPasswordRecoveryRedirect() ||
  new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery')

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
      skipAutoInitialize: hasRecoveryCallback,
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
    case 'same_password':
      return '기존 비밀번호와 다른 비밀번호를 입력해 주세요.'
    case 'user_already_exists':
      return '이미 등록된 이메일입니다.'
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'
    default:
      return fallback
  }
}
