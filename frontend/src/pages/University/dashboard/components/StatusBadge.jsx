// Unified SETU Status & Priority Badge Component

export function PriorityBadge({ priority, size = 'sm', className = '' }) {
  const norm = (priority || '').toUpperCase()

  const getDotColor = () => {
    switch (norm) {
      case 'CRITICAL':
        return 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]'
      case 'HIGH':
        return 'bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.8)]'
      case 'MEDIUM':
        return 'bg-yellow-300 shadow-[0_0_6px_rgba(253,224,71,0.8)]'
      case 'LOW':
      default:
        return 'bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.8)]'
    }
  }

  const getLabel = () => {
    switch (norm) {
      case 'CRITICAL':
        return 'Critical'
      case 'HIGH':
        return 'High'
      case 'MEDIUM':
        return 'Medium'
      case 'LOW':
        return 'Low'
      default:
        return priority || 'Normal'
    }
  }

  const sizeClasses =
    size === 'xs'
      ? 'px-2.5 py-0.5 text-[11px]'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-xs font-semibold'
      : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md bg-[#176B5B] text-white border border-[#125649] ${sizeClasses} ${className} select-none transition-colors tracking-wide font-outfit`}
    >
      <span className={`w-2 h-2 rounded-full ${getDotColor()} animate-pulse shrink-0`} />
      <span className="whitespace-nowrap">{getLabel()}</span>
    </span>
  )
}

function StatusBadge({ status, size = 'sm', className = '' }) {
  const normalized = (status || '').toUpperCase().replace(/\s+/g, '_')

  // Check if it's a priority level
  if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(normalized)) {
    return <PriorityBadge priority={status} size={size} className={className} />
  }

  const getLabel = () => {
    switch (normalized) {
      case 'APPROVED':
        return 'Approved'
      case 'ACTIVE':
        return 'Active'
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'PENDING':
      case 'PENDING_APPROVAL':
        return 'Pending Review'
      case 'REJECTED':
        return 'Rejected'
      case 'OPEN':
        return 'Open for Team'
      case 'SLOTS_FULL':
      case 'TEAM_FULL':
        return 'Team Slots Full'
      case 'UNDER_ADMIN_REVIEW':
        return 'Under Review'
      case 'COMPLETED':
        return 'Completed'
      default:
        return status || 'Active'
    }
  }

  const getStyle = () => {
    if (normalized === 'REJECTED' || normalized === 'DECLINED') {
      return 'bg-red-50 text-red-700 border-red-200'
    }
    return 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]'
  }

  const sizeClasses =
    size === 'xs'
      ? 'px-2.5 py-0.5 text-[10px]'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-xs font-semibold'
      : 'px-2.5 py-1 text-xs font-semibold'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${getStyle()} ${sizeClasses} ${className} select-none transition-colors font-outfit`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />
      <span className="whitespace-nowrap">{getLabel()}</span>
    </span>
  )
}

export default StatusBadge
