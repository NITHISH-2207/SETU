import { INITIAL_CITIZEN_ISSUES } from './citizenMockData.js'

const COMPLAINTS_STORAGE_KEY = 'setu_citizen_complaints_v1'

export function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Failed to read stored complaints:', err)
  }
  // Initialize with initial citizen issues
  saveStoredComplaints(INITIAL_CITIZEN_ISSUES)
  return INITIAL_CITIZEN_ISSUES
}

export function saveStoredComplaints(complaints) {
  try {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints))
  } catch (err) {
    console.warn('Failed to persist complaints to localStorage:', err)
  }
}

export function addStoredComplaint(newComplaint) {
  const current = getStoredComplaints()
  const updated = [newComplaint, ...current]
  saveStoredComplaints(updated)
  return updated
}

export function deleteStoredComplaint(id) {
  const current = getStoredComplaints()
  const updated = current.filter((c) => c.id !== id)
  saveStoredComplaints(updated)
  return updated
}

export function toggleStoredComplaintUpvote(id) {
  const current = getStoredComplaints()
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
  saveStoredComplaints(updated)
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
