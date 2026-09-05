function StatusBadge({ status, size = 'sm', className = '' }) {
  const normalized = (status || '').toUpperCase().replace(/\s+/g, '_')

  const getStyle = () => {
    switch (normalized) {
      case 'APPROVED':
      case 'ACTIVE':
      case 'COMPLETED':
      case 'APPROVED_BY_MENTOR':
      case 'SANCTIONED_PILOT':
      case 'A+_VERIFIED':
        return 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]'

      case 'IN_PROGRESS':
      case 'UNDER_ADMIN_REVIEW':
      case 'FACULTY_ASSIGNED':
        return 'bg-blue-50 text-blue-700 border-blue-200'

      case 'PENDING':
      case 'PENDING_APPROVAL':
      case 'PENDING_REVIEW':
      case 'OPEN':
        return 'bg-amber-50 text-amber-700 border-amber-200'

      case 'REJECTED':
      case 'DECLINED':
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200'

      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200'

      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200'

      case 'SLOTS_FULL':
      case 'TEAM_FULL':
        return 'bg-purple-50 text-purple-700 border-purple-200'

      default:
        return 'bg-[#F7FAF9] text-[#5C726E] border-[#BFD9D2]'
    }
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
        return 'Under Admin Review'
      case 'COMPLETED':
        return 'Completed'
      default:
        return status || 'Unknown'
    }
  }

  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3.5 py-1.5 text-xs font-bold' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${getStyle()} ${sizeClasses} ${className} select-none transition-colors font-outfit`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{getLabel()}</span>
    </span>
  )
}

export default StatusBadge
