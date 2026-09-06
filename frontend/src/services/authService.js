import {
  apiClient,
  setAuthToken,
  getAuthToken,
  setStoredCitizenUser,
  getStoredCitizenUser,
  clearCitizenSession,
} from './api.js'

/**
 * =========================================================================
 * MOCK MODE SWITCH FOR CITIZEN AUTH
 * Set to true for standalone frontend demo (no backend server required).
 * Set to false when connecting to the real FastAPI backend + database.
 * =========================================================================
 */
export const USE_MOCK_CITIZEN_AUTH = true

export const DEMO_CITIZEN_MOBILE = '7894561230'

/**
 * Register a new citizen account and issue a verification OTP.
 * @param {Object} data { full_name: string, mobile_number: string, email?: string | null, ward?: string }
 * @returns {Promise<Object>} { message: string, development_otp?: string }
 */
export async function signupCitizen(data) {
  if (USE_MOCK_CITIZEN_AUTH) {
    const rawMobile = (data.mobile_number || '').replace(/\D/g, '')
    const isDemo = rawMobile === DEMO_CITIZEN_MOBILE
    const mockUser = {
      id: isDemo ? 1 : Date.now(),
      user_id: isDemo ? 1 : Date.now(),
      full_name: isDemo ? 'NITHISH' : (data.full_name?.trim() || 'Citizen User'),
      mobile_number: rawMobile || DEMO_CITIZEN_MOBILE,
      email: data.email?.trim() || null,
      ward: data.ward || (isDemo ? 'Ward 12, Gandhi Nagar, Tiruppur' : 'Ward 5, Town Hall'),
      mobile_verified: true,
      email_verified: false,
    }
    setStoredCitizenUser(mockUser)
    return {
      message: 'Citizen account registered successfully. OTP sent.',
      development_otp: '123456',
    }
  }

  const payload = {
    full_name: data.full_name?.trim(),
    mobile_number: data.mobile_number?.trim(),
    email: data.email?.trim() || null,
  }

  return apiClient('/api/v1/citizen/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Request login or verification OTP for an existing citizen.
 * @param {Object} data { identifier?: string, mobile_number?: string }
 * @returns {Promise<Object>} { message: string, development_otp?: string }
 */
export async function requestCitizenOtp(data) {
  if (USE_MOCK_CITIZEN_AUTH) {
    const rawMobile = (data.mobile_number || data.identifier || '').replace(/\D/g, '')
    const isDemo = rawMobile === DEMO_CITIZEN_MOBILE || rawMobile.endsWith(DEMO_CITIZEN_MOBILE)
    const stored = getStoredCitizenUser()
    const mockUser = {
      id: isDemo ? 1 : (stored?.id || 99),
      user_id: isDemo ? 1 : (stored?.user_id || 99),
      full_name: isDemo ? 'NITHISH' : (stored?.full_name || 'Citizen User'),
      mobile_number: rawMobile || data.identifier || (isDemo ? DEMO_CITIZEN_MOBILE : '9876543210'),
      email: data.identifier?.includes('@') ? data.identifier : (stored?.email || null),
      ward: isDemo ? 'Ward 12, Gandhi Nagar, Tiruppur' : (stored?.ward || 'Ward 5, Town Hall'),
      mobile_verified: true,
      email_verified: false,
    }
    setStoredCitizenUser(mockUser)
    return {
      message: 'OTP generated successfully',
      development_otp: '123456',
    }
  }

  const payload = {
    identifier: data.identifier?.trim() || data.mobile_number?.trim() || null,
    mobile_number: data.mobile_number?.trim() || null,
  }

  return apiClient('/api/v1/citizen/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Verify OTP and retrieve access token.
 * @param {Object} data { identifier?: string, mobile_number?: string, otp: string }
 * @returns {Promise<Object>} { message: string, user_id: number, citizen_id: number, access_token: string, token_type: string }
 */
export async function verifyCitizenOtp(data) {
  if (USE_MOCK_CITIZEN_AUTH) {
    const rawMobile = (data.mobile_number || data.identifier || '').replace(/\D/g, '')
    const isDemo = rawMobile === DEMO_CITIZEN_MOBILE || rawMobile.endsWith(DEMO_CITIZEN_MOBILE)
    const stored = getStoredCitizenUser()
    const mockUser = {
      id: isDemo ? 1 : (stored?.id || 99),
      user_id: isDemo ? 1 : (stored?.user_id || 99),
      full_name: isDemo ? 'NITHISH' : (stored?.full_name || 'Citizen User'),
      mobile_number: rawMobile || data.identifier || (isDemo ? DEMO_CITIZEN_MOBILE : '9876543210'),
      email: data.identifier?.includes('@') ? data.identifier : (stored?.email || null),
      ward: isDemo ? 'Ward 12, Gandhi Nagar, Tiruppur' : (stored?.ward || 'Ward 5, Town Hall'),
      mobile_verified: true,
      email_verified: false,
    }
    const mockToken = 'mock-citizen-auth-token-demo'
    setAuthToken(mockToken)
    setStoredCitizenUser(mockUser)
    return {
      message: 'OTP verified successfully',
      user_id: mockUser.user_id,
      citizen_id: mockUser.id,
      access_token: mockToken,
      token_type: 'bearer',
    }
  }

  const payload = {
    identifier: data.identifier?.trim() || data.mobile_number?.trim() || null,
    mobile_number: data.mobile_number?.trim() || null,
    otp: data.otp?.trim(),
  }

  const result = await apiClient('/api/v1/citizen/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (result?.access_token) {
    setAuthToken(result.access_token)
  }

  return result
}

/**
 * Fetch profile details of the currently authenticated citizen.
 * @returns {Promise<Object>} Citizen profile object
 */
export async function getCitizenProfile(customToken = null) {
  if (USE_MOCK_CITIZEN_AUTH) {
    const user = getStoredCitizenUser()
    if (user) return user
    return {
      id: 1,
      user_id: 1,
      full_name: 'NITHISH',
      mobile_number: DEMO_CITIZEN_MOBILE,
      email: null,
      ward: 'Ward 12, Gandhi Nagar, Tiruppur',
      mobile_verified: true,
      email_verified: false,
    }
  }

  const headers = {}
  if (customToken) {
    headers['Authorization'] = `Bearer ${customToken}`
  }

  const profile = await apiClient('/api/v1/citizen/profile', {
    method: 'GET',
    headers,
  })

  if (profile) {
    setStoredCitizenUser(profile)
  }

  return profile
}

/**
 * Log out citizen and clear all session tokens and cached user data.
 */
export function logoutCitizen() {
  clearCitizenSession()
}

export {
  getAuthToken,
  setAuthToken,
  getStoredCitizenUser,
  setStoredCitizenUser,
  clearCitizenSession,
}
