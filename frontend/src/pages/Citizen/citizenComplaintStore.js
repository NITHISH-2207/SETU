import { INITIAL_CITIZEN_ISSUES, COMMUNITY_CITIZEN_ISSUES } from './citizenMockData.js'

const COMPLAINTS_STORAGE_KEY = 'setu_citizen_complaints_v1'
const COMMUNITY_STORAGE_KEY = 'setu_community_complaints_v1'
export const DEMO_CITIZEN_MOBILE = '7894561230'

/**
 * Checks if a given user object, mobile number string, or identifier matches the confirmed demo user account.
 * @param {Object|string|number|null} userOrId
 * @returns {boolean}
 */
export function isDemoUser(userOrId) {
  if (!userOrId) return true
  if (typeof userOrId === 'string') {
    const clean = userOrId.replace(/\D/g, '')
    return clean === DEMO_CITIZEN_MOBILE || clean.endsWith(DEMO_CITIZEN_MOBILE) || userOrId === '1' || userOrId === 'demo'
  }
  if (typeof userOrId === 'number') {
    return userOrId === 1
  }
  if (typeof userOrId === 'object') {
    const clean = (userOrId.mobile_number || userOrId.phone || userOrId.identifier || '').replace(/\D/g, '')
    return clean === DEMO_CITIZEN_MOBILE || clean.endsWith(DEMO_CITIZEN_MOBILE) || userOrId.id === 1 || userOrId.full_name === 'NITHISH'
  }
  return false
}

function getStorageKey(userOrId) {
  if (isDemoUser(userOrId)) {
    return `setu_citizen_complaints_demo_${DEMO_CITIZEN_MOBILE}`
  }
  const id = typeof userOrId === 'object' ? (userOrId.mobile_number || userOrId.id || userOrId.user_id) : userOrId
  return id ? `setu_citizen_complaints_v1_${id}` : COMPLAINTS_STORAGE_KEY
}

export function getStoredComplaints(userOrId = null) {
  const isDemo = isDemoUser(userOrId)
  if (isDemo) {
    const key = `setu_citizen_complaints_demo_${DEMO_CITIZEN_MOBILE}`
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (err) {
      console.warn('Failed to read demo complaints:', err)
    }
    saveStoredComplaints(INITIAL_CITIZEN_ISSUES, userOrId)
    return INITIAL_CITIZEN_ISSUES
  }

  // Non-demo / new user: load scoped complaints (empty for newly created accounts)
  try {
    const key = getStorageKey(userOrId)
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Failed to read stored complaints:', err)
  }

  const initial = []
  saveStoredComplaints(initial, userOrId)
  return initial
}

export function saveStoredComplaints(complaints, userOrId = null) {
  try {
    const key = getStorageKey(userOrId)
    localStorage.setItem(key, JSON.stringify(complaints))
  } catch (err) {
    console.warn('Failed to persist complaints to localStorage:', err)
  }
}

export function addStoredComplaint(newComplaint, userOrId = null) {
  const current = getStoredComplaints(userOrId)
  const updated = [newComplaint, ...current]
  saveStoredComplaints(updated, userOrId)
  return updated
}

export function deleteStoredComplaint(id, userOrId = null) {
  const current = getStoredComplaints(userOrId)
  const updated = current.filter((c) => c.id !== id)
  saveStoredComplaints(updated, userOrId)
  return updated
}

export function toggleStoredComplaintUpvote(id, userOrId = null) {
  const current = getStoredComplaints(userOrId)
  const updated = current.map((issue) => {
    if (issue.id === id) {
      const newUpvoted = !issue.isUpvoted
      return {
        ...issue,
        isUpvoted: newUpvoted,
        upvotes: newUpvoted ? (issue.upvotes || 0) + 1 : Math.max(0, (issue.upvotes || 1) - 1),
      }
    }
    return issue
  })
  saveStoredComplaints(updated, userOrId)
  return updated
}

export function computeComplaintStats(complaints = []) {
  const total = complaints.length
  const underReview = complaints.filter(
    (i) => i.status === 'under_review' || i.status === 'submitted'
  ).length
  const inProgress = complaints.filter(
    (i) => i.status === 'assigned' || i.status === 'in_progress' || i.status === 'action_taken'
  ).length
  const resolved = complaints.filter((i) => i.status === 'resolved').length
  const totalUpvotes = complaints.reduce((acc, curr) => acc + (curr.upvotes || 0), 0)

  return {
    total,
    underReview,
    inProgress,
    resolved,
    totalUpvotes,
  }
}

export function isComplaintDeletable(status) {
  return status === 'submitted' || status === 'under_review'
}

export function getCommunityStoredComplaints() {
  try {
    const raw = localStorage.getItem(COMMUNITY_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Failed to read stored community complaints:', err)
  }
  saveCommunityStoredComplaints(COMMUNITY_CITIZEN_ISSUES)
  return COMMUNITY_CITIZEN_ISSUES
}

export function saveCommunityStoredComplaints(complaints) {
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(complaints))
  } catch (err) {
    console.warn('Failed to persist community complaints:', err)
  }
}

export function toggleCommunityComplaintUpvote(id) {
  const current = getCommunityStoredComplaints()
  const updated = current.map((issue) => {
    if (issue.id === id) {
      const newUpvoted = !issue.isUpvoted
      return {
        ...issue,
        isUpvoted: newUpvoted,
        upvotes: newUpvoted ? (issue.upvotes || 0) + 1 : Math.max(0, (issue.upvotes || 1) - 1),
      }
    }
    return issue
  })
  saveCommunityStoredComplaints(updated)
  return updated
}

