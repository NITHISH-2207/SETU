import { useState, useEffect, useMemo } from 'react'
import GovernmentNavbar from './components/GovernmentNavbar.jsx'
import GovernmentDashboardTab from './components/GovernmentDashboardTab.jsx'
import GovernmentComplaintsTab from './components/GovernmentComplaintsTab.jsx'
import GovernmentComplaintDetail from './components/GovernmentComplaintDetail.jsx'
import GovernmentInsightsTab from './components/GovernmentInsightsTab.jsx'
import GovernmentProfileTab from './components/GovernmentProfileTab.jsx'
import {
  filterComplaintsByDepartment,
  getNeedsAttentionComplaints,
  GOVERNMENT_DEPARTMENTS,
} from './governmentConfig.js'
import {
  getCommunityStoredComplaints,
  saveCommunityStoredComplaints,
} from '../Citizen/citizenComplaintStore.js'

function GovernmentPortal({
  initialDepartment = null,
  userProfile = null,
  onLogout,
  onNavigate,
}) {
  // Read persistent department session
  const [departmentName, setDepartmentName] = useState(() => {
    if (initialDepartment) return initialDepartment
    if (userProfile?.departmentName) return userProfile.departmentName
    try {
      const saved = localStorage.getItem('setu_government_department')
      if (saved) return saved
    } catch (err) {
      console.warn('Failed to read saved government department:', err)
    }
    return 'Department of Water'
  })

  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'complaints' | 'insights' | 'profile'
  const [selectedComplaintId, setSelectedComplaintId] = useState(null)
  const [allCommunityComplaints, setAllCommunityComplaints] = useState(() =>
    getCommunityStoredComplaints()
  )

  // Load latest community stored complaints
  useEffect(() => {
    const loaded = getCommunityStoredComplaints()
    setAllCommunityComplaints(loaded)
  }, [])

  // Strictly filter complaints for the logged-in department
  const departmentComplaints = useMemo(() => {
    return filterComplaintsByDepartment(allCommunityComplaints, departmentName)
  }, [allCommunityComplaints, departmentName])

  // Get currently selected complaint object
  const selectedComplaint = useMemo(() => {
    if (!selectedComplaintId) return null
    return (
      departmentComplaints.find((c) => c.id === selectedComplaintId) ||
      allCommunityComplaints.find((c) => c.id === selectedComplaintId) ||
      null
    )
  }, [selectedComplaintId, departmentComplaints, allCommunityComplaints])

  const needsAttentionList = useMemo(() => {
    return getNeedsAttentionComplaints(departmentComplaints)
  }, [departmentComplaints])

  // Update complaint (priority, urgency, severity, status, notes)
  const handleUpdateComplaint = (complaintId, updatedFields) => {
    const updatedAll = allCommunityComplaints.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          ...updatedFields,
        }
      }
      return c
    })

    setAllCommunityComplaints(updatedAll)
    saveCommunityStoredComplaints(updatedAll)
  }

  const handleSelectComplaint = (complaint) => {
    setSelectedComplaintId(complaint.id)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleBackToList = () => {
    setSelectedComplaintId(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleTabChange = (tab) => {
    setSelectedComplaintId(null)
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2A28] flex flex-col justify-between selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Sticky Navbar */}
      <GovernmentNavbar
        activeTab={selectedComplaint ? 'complaints' : activeTab}
        onTabChange={handleTabChange}
        departmentName={departmentName}
        onLogout={onLogout}
        needsAttentionCount={needsAttentionList.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {selectedComplaint ? (
          <GovernmentComplaintDetail
            complaint={selectedComplaint}
            departmentName={departmentName}
            onBack={handleBackToList}
            onUpdateComplaint={handleUpdateComplaint}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <GovernmentDashboardTab
                departmentName={departmentName}
                complaints={departmentComplaints}
                onSelectComplaint={handleSelectComplaint}
                onViewAllComplaints={() => handleTabChange('complaints')}
              />
            )}

            {activeTab === 'complaints' && (
              <GovernmentComplaintsTab
                departmentName={departmentName}
                complaints={departmentComplaints}
                onSelectComplaint={handleSelectComplaint}
              />
            )}

            {activeTab === 'insights' && (
              <GovernmentInsightsTab
                departmentName={departmentName}
                complaints={departmentComplaints}
              />
            )}

            {activeTab === 'profile' && (
              <GovernmentProfileTab
                departmentName={departmentName}
                userProfile={userProfile}
                onLogout={onLogout}
              />
            )}
          </>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#BFD9D2]/60 bg-[#F7FAF9] py-6 px-4 text-center mt-12 font-outfit">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5C726E]">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold text-[#176B5B]">SETU</span>
            <span>• Civic Grievance Management System</span>
          </div>
          <div>
            <span>Department: </span>
            <strong className="text-[#1F2A28] font-semibold">{departmentName}</strong>
          </div>
          <div>
            <span>Tiruppur Municipal Corporation</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GovernmentPortal
