const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export const TOKEN_KEY = 'setu_auth_token'
export const CITIZEN_USER_KEY = 'setu_citizen_user'

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (err) {
    console.warn('Failed to store auth token:', err)
  }
}

export function getStoredCitizenUser() {
  try {
    const raw = localStorage.getItem(CITIZEN_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredCitizenUser(user) {
  try {
    if (user) {
      localStorage.setItem(CITIZEN_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CITIZEN_USER_KEY)
    }
  } catch (err) {
    console.warn('Failed to store citizen user:', err)
  }
}

export function clearCitizenSession() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(CITIZEN_USER_KEY)
    localStorage.removeItem('setu_is_logged_in')
    localStorage.removeItem('setu_active_screen')
    localStorage.removeItem('setu_citizen_active_tab')
    localStorage.removeItem('setu_selected_issue_id')
  } catch (err) {
    console.warn('Failed to clear session:', err)
  }
}

export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getAuthToken()
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    let responseData = null
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }

    if (!response.ok) {
      let errorMessage = 'An error occurred during the request.'
      if (responseData && typeof responseData === 'object') {
        if (typeof responseData.detail === 'string') {
          errorMessage = responseData.detail
        } else if (Array.isArray(responseData.detail)) {
          // FastAPI validation error list
          errorMessage = responseData.detail
            .map((err) => err.msg || `${err.loc?.join('.')} is invalid`)
            .join(', ')
        } else if (responseData.message) {
          errorMessage = responseData.message
        }
      }

      const error = new Error(errorMessage)
      error.status = response.status
      error.data = responseData
      throw error
    }

    return responseData
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error(
        'Unable to connect to SETU backend server. Please verify the backend is running.'
      )
      networkError.status = 0
      networkError.isNetworkError = true
      throw networkError
    }
    throw err
  }
}
