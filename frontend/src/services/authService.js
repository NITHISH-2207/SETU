import {
  apiClient,
  setAuthToken,
  getAuthToken,
  setStoredCitizenUser,
  getStoredCitizenUser,
  clearCitizenSession,
} from './api.js'

/**
 * Register a new citizen account and issue a verification OTP.
 * @param {Object} data { full_name: string, mobile_number: string, email?: string | null }
 * @returns {Promise<Object>} { message: string, development_otp?: string }
 */
export async function signupCitizen(data) {
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
