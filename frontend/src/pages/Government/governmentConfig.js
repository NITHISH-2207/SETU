/**
 * SETU Government Portal Configuration & Utilities
 * Deterministic department mapping, demo credentials, and helper functions.
 */

export const GOVERNMENT_DEPARTMENTS = [
  {
    id: 'dept-water',
    name: 'Department of Water',
    password: 'water',
    categories: ['Water Supply'],
    description: 'Municipal Water Resources, Distribution Networks & Quality Assurance',
    jurisdiction: 'Tiruppur Municipal Corporation — Water Works Wing',
  },
  {
    id: 'dept-roads',
    name: 'Department of Roads & Public Works',
    password: 'roads',
    categories: ['Roads'],
    description: 'Highways, Urban Road Infrastructure, Pavements & Drainage Networks',
    jurisdiction: 'Highways & Public Works Department — Tiruppur Division',
  },
  {
    id: 'dept-electricity',
    name: 'Department of Electricity',
    password: 'electricity',
    categories: ['Electricity'],
    description: 'Power Distribution, Street Lighting, Transformers & Electrical Safety',
    jurisdiction: 'TANGEDCO — Tiruppur Electricity Distribution Circle',
  },
  {
    id: 'dept-sanitation',
    name: 'Department of Sanitation & Waste Management',
    password: 'sanitation',
    categories: ['Waste Management', 'Sanitation'],
    description: 'Solid Waste Management, Door-to-Door Collection, Sanitization & Public Hygiene',
    jurisdiction: 'City Health & Sanitation Directorate — Tiruppur',
  },
  {
    id: 'dept-infrastructure',
    name: 'Department of Public Infrastructure',
    password: 'infrastructure',
    categories: ['Public Infrastructure'],
    description: 'Civic Buildings, Public Amenities, Community Centres & Bus Terminals',
    jurisdiction: 'Municipal Town Planning & Infrastructure Division',
  },
  {
    id: 'dept-environment',
    name: 'Department of Environment',
    password: 'environment',
    categories: ['Environment'],
    description: 'Pollution Control, River Basin Protection, Green Cover & Industrial Vigilance',
    jurisdiction: 'Tamil Nadu Pollution Control Board & Environmental Cell',
  },
]

export const DEMO_PASSWORDS = {
  'Department of Water': 'water',
  'Department of Roads & Public Works': 'roads',
  'Department of Electricity': 'electricity',
  'Department of Sanitation & Waste Management': 'sanitation',
  'Department of Public Infrastructure': 'infrastructure',
  'Department of Environment': 'environment',
}

export const CATEGORY_TO_DEPARTMENT_MAP = {
  'Water Supply': 'Department of Water',
  'Roads': 'Department of Roads & Public Works',
  'Road Infrastructure': 'Department of Roads & Public Works',
  'Electricity': 'Department of Electricity',
  'Public Lighting': 'Department of Electricity',
  'Waste Management': 'Department of Sanitation & Waste Management',
  'Sanitation': 'Department of Sanitation & Waste Management',
  'Public Infrastructure': 'Department of Public Infrastructure',
  'Environment': 'Department of Environment',
}

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical']
export const URGENCY_OPTIONS = ['Normal', 'Urgent', 'Immediate']
export const SEVERITY_OPTIONS = ['Minor', 'Moderate', 'Major', 'Critical']
export const STATUS_OPTIONS = ['Received', 'Under Review', 'In Progress', 'Resolved']

/**
 * Filter complaints by logged-in department
 */
export function filterComplaintsByDepartment(complaints = [], departmentName) {
  const dept = GOVERNMENT_DEPARTMENTS.find((d) => d.name === departmentName)
  if (!dept) return []

  const targetCategories = dept.categories

  return complaints.filter((item) => {
    if (!item.category || item.category === 'Other') return false
    return targetCategories.includes(item.category)
  })
}

/**
 * Compute derived Time Status: 'On Track' | 'Due Soon' | 'Overdue' | 'Resolved'
 */
export function calculateTimeStatus(complaint) {
  if (complaint.status === 'resolved') {
    return 'Resolved'
  }

  // Parse submission date (e.g. 'Sep 03, 2026', 'Aug 26, 2026')
  const dateStr = complaint.date
  if (!dateStr) return 'On Track'

  try {
    const parsed = new Date(dateStr)
    if (isNaN(parsed.getTime())) return 'On Track'

    const now = new Date('2026-09-06T12:00:00') // Local app context time
    const diffDays = Math.floor((now - parsed) / (1000 * 60 * 60 * 24))

    if (diffDays >= 6) return 'Overdue'
    if (diffDays >= 3) return 'Due Soon'
    return 'On Track'
  } catch {
    return 'On Track'
  }
}

/**
 * Compute default priority for a complaint based on available signals
 */
export function deriveComplaintPriority(complaint) {
  if (complaint.priority) return complaint.priority
  const upvotes = complaint.upvotes || 0
  if (upvotes >= 80) return 'Critical'
  if (upvotes >= 40) return 'High'
  if (upvotes >= 20) return 'Medium'
  return 'Low'
}

/**
 * Compute default urgency for a complaint based on available signals
 */
export function deriveComplaintUrgency(complaint) {
  if (complaint.urgency) return complaint.urgency
  const timeStatus = calculateTimeStatus(complaint)
  if (timeStatus === 'Overdue') return 'Immediate'
  if (timeStatus === 'Due Soon') return 'Urgent'
  return 'Normal'
}

/**
 * Compute default severity for a complaint
 */
export function deriveComplaintSeverity(complaint) {
  if (complaint.severity) return complaint.severity
  const upvotes = complaint.upvotes || 0
  if (upvotes >= 100) return 'Critical'
  if (upvotes >= 50) return 'Major'
  if (upvotes >= 25) return 'Moderate'
  return 'Minor'
}

/**
 * Identify complaints needing immediate attention for the department
 */
export function getNeedsAttentionComplaints(complaints = []) {
  return complaints.filter((c) => {
    if (c.status === 'resolved') return false
    const timeStatus = calculateTimeStatus(c)
    const priority = deriveComplaintPriority(c)
    const upvotes = c.upvotes || 0

    return (
      timeStatus === 'Overdue' ||
      timeStatus === 'Due Soon' ||
      priority === 'Critical' ||
      priority === 'High' ||
      upvotes >= 45
    )
  })
}
