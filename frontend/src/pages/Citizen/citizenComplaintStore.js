import { INITIAL_CITIZEN_ISSUES } from './citizenMockData.js'

const COMPLAINTS_STORAGE_KEY = 'setu_citizen_complaints_v1'

function getStorageKey(userId) {
  return userId ? `setu_citizen_complaints_v1_${userId}` : COMPLAINTS_STORAGE_KEY
}

export function getStoredComplaints(userId = null) {
  try {
    const key = getStorageKey(userId)
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
  // Initialize with initial citizen issues or empty for specific user
  const initial = userId ? [] : INITIAL_CITIZEN_ISSUES
  saveStoredComplaints(initial, userId)
  return initial
}

export function saveStoredComplaints(complaints, userId = null) {
  try {
    const key = getStorageKey(userId)
    localStorage.setItem(key, JSON.stringify(complaints))
  } catch (err) {
    console.warn('Failed to persist complaints to localStorage:', err)
  }
}

export function addStoredComplaint(newComplaint, userId = null) {
  const current = getStoredComplaints(userId)
  const updated = [newComplaint, ...current]
  saveStoredComplaints(updated, userId)
  return updated
}

export function deleteStoredComplaint(id, userId = null) {
  const current = getStoredComplaints(userId)
  const updated = current.filter((c) => c.id !== id)
  saveStoredComplaints(updated, userId)
  return updated
}

export function toggleStoredComplaintUpvote(id, userId = null) {
  const current = getStoredComplaints(userId)
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
  saveStoredComplaints(updated, userId)
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
