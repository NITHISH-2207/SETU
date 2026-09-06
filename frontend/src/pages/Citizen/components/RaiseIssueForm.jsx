import { useState, useRef, useEffect } from 'react'
import { CITIZEN_USER_PROFILE } from '../citizenMockData.js'
import { saveDraftToStorage, removeDraftFromStorage } from '../citizenDraftsService.js'
import { useAppTranslation } from '../../../hooks/useAppTranslation.js'

const getTodayStr = () => new Date().toISOString().split('T')[0]
const getYesterdayStr = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

const CATEGORIES = [
  'Water Supply',
  'Roads',
  'Electricity',
  'Waste Management',
  'Sanitation',
  'Public Infrastructure',
  'Environment',
  'Other',
]

const DEPARTMENTS = [
  'Municipal Authority',
  'Public Works Department',
  'Water Supply Department',
  'Electricity Department',
  'Sanitation Department',
  'Other',
]

function RaiseIssueForm({ onCancel, onSubmitSuccess, onTrackIssue, initialDraft = null }) {
  const { currentLanguage } = useAppTranslation()

  // Unique Draft ID tracking
  const [draftId, setDraftId] = useState(initialDraft?.id || null)

  // 1. Form state
  const [isAnonymous, setIsAnonymous] = useState(initialDraft?.isAnonymous || false)
  const [title, setTitle] = useState(initialDraft?.title || '')
  const [description, setDescription] = useState(initialDraft?.description || '')
  const [immediateDanger, setImmediateDanger] = useState(initialDraft?.immediateDanger || false)
  const [category, setCategory] = useState(initialDraft?.category || '')
  const [targetDepartment, setTargetDepartment] = useState(initialDraft?.targetDepartment || '')

  // Date selection (defaults to today)
  const [dateOption, setDateOption] = useState(initialDraft?.dateOption || 'today')
  const [observedDate, setObservedDate] = useState(initialDraft?.observedDate || getTodayStr())

  // Evidence upload & Camera capture
  const [evidenceFiles, setEvidenceFiles] = useState([])
  const [restoredEvidenceMeta, setRestoredEvidenceMeta] = useState(initialDraft?.evidenceMeta || [])
  const [isDragging, setIsDragging] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Voice to text
  const [isListening, setIsListening] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState(null)
  const recognitionRef = useRef(null)
  const baseDescriptionRef = useRef('')
  const isStartingVoiceRef = useRef(false)

  // Location
  const [locationState, setLocationState] = useState(initialDraft?.locationState || 'initial')
  const [detectedAddress, setDetectedAddress] = useState(initialDraft?.detectedAddress || '')
  const [locationConfirmed, setLocationConfirmed] = useState(initialDraft?.locationConfirmed || false)
  const [coords, setCoords] = useState(initialDraft?.coords || { lat: null, lon: null, accuracy: null })
  const [showManualLocation, setShowManualLocation] = useState(initialDraft?.showManualLocation || false)
  const [manualAddress, setManualAddress] = useState(
    initialDraft?.manualAddress || {
      street: '',
      city: '',
      state: 'Tamil Nadu',
      pincode: '',
    }
  )
  const [locationUnavailable, setLocationUnavailable] = useState(initialDraft?.locationUnavailable || false)

  // Notification channels
  const [notificationChannels, setNotificationChannels] = useState(
    initialDraft?.notificationChannels || {
      whatsapp: true,
      sms: false,
    }
  )

  // Draft save status & Unsaved changes modal
  const [draftSavedToast, setDraftSavedToast] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [showDiscardModal, setShowDiscardModal] = useState(false)

  // Validation & Submission
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedIssue, setSubmittedIssue] = useState(null)
  const [copiedRef, setCopiedRef] = useState(false)

  // Track user edits to mark form as dirty
  const markDirty = () => {
    if (!isDirty) setIsDirty(true)
  }

  // Clean up speech recognition and camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Sync stream to video element when camera becomes active
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch((err) => console.warn('Camera video play warning:', err))
    }
  }, [isCameraActive])

  // Live Camera API Handlers
  const handleOpenCamera = async () => {
    markDirty()
    setCameraError(null)

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError(
        'Live camera access is not supported on this browser or requires a secure context (HTTPS / localhost). Please use the file upload option.'
      )
      return
    }

    try {
      let stream = null
      try {
        // Try environment/back facing camera first
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })
      } catch {
        // Fallback to generic video
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
      }

      streamRef.current = stream
      setIsCameraActive(true)
    } catch (err) {
      console.warn('Camera getUserMedia error:', err)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser settings to capture photos.')
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device was detected on this system.')
      } else {
        setCameraError('Unable to open live camera preview. Please attach photos using the file upload option.')
      }
    }
  }

  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const handleCapturePhoto = () => {
    if (!videoRef.current || !streamRef.current) return

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const timestamp = Date.now()
            const dateStr = new Date().toISOString().slice(0, 10)
            const filename = `Photo_${dateStr}_${timestamp.toString().slice(-4)}.jpg`
            const capturedFile = new File([blob], filename, { type: 'image/jpeg' })

            const newEntry = {
              id: Math.random().toString(36).substring(2, 9),
              name: filename,
              size: blob.size,
              type: 'image/jpeg',
              file: capturedFile,
              previewUrl: URL.createObjectURL(blob),
            }

            setEvidenceFiles((prev) => [...prev, newEntry])
            markDirty()
          }
          handleCloseCamera()
        },
        'image/jpeg',
        0.92
      )
    } else {
      handleCloseCamera()
    }
  }

  // Evidence file handlers
  const handleFiles = (incomingFiles) => {
    markDirty()
    const validFiles = Array.from(incomingFiles).filter((file) => file.size <= 10 * 1024 * 1024)

    const newEntries = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }))

    setEvidenceFiles((prev) => [...prev, ...newEntries])
  }

  const handleRemoveFile = (id) => {
    markDirty()
    setEvidenceFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const handleDismissRestoredMeta = (index) => {
    setRestoredEvidenceMeta((prev) => prev.filter((_, i) => i !== index))
  }

  // Voice recognition locale mapping
  const getSpeechLocale = (lang) => {
    switch (lang) {
      case 'ta':
        return 'ta-IN'
      case 'hi':
        return 'hi-IN'
      default:
        return 'en-IN'
    }
  }

  // Secure context detection (HTTPS, localhost, 127.0.0.1)
  const isContextSecure = () => {
    if (typeof window === 'undefined') return true
    if (window.isSecureContext) return true
    const hostname = window.location.hostname
    return hostname === 'localhost' || hostname === '127.0.0.1' || window.location.protocol === 'https:'
  }

  const handleStopVoice = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.warn('Speech recognition stop warning:', err)
      }
    }
    setIsListening(false)
    isStartingVoiceRef.current = false
  }

  // Voice recognition toggle (Tap-to-start / Tap-again-to-stop)
  const handleToggleVoice = async () => {
    if (isListening) {
      handleStopVoice()
      return
    }

    if (isStartingVoiceRef.current) return
    isStartingVoiceRef.current = true

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      isStartingVoiceRef.current = false
      setVoiceNotice('Voice input is not supported in this browser. You can continue typing directly.')
      return
    }

    if (!isContextSecure()) {
      isStartingVoiceRef.current = false
      setVoiceNotice('Voice input requires a secure connection (HTTPS or localhost). You can continue typing directly.')
      return
    }

    setVoiceNotice(null)
    baseDescriptionRef.current = description ? description.trim() : ''

    // Step 1: Ensure microphone permission is requested and verified first
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Immediately release tracks so microphone is free for SpeechRecognition
        stream.getTracks().forEach((track) => track.stop())
      } catch (permErr) {
        isStartingVoiceRef.current = false
        setIsListening(false)
        if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
          setVoiceNotice('Microphone access was denied. Please allow microphone permissions in your browser to use voice input.')
          return
        }
        if (permErr.name === 'NotFoundError' || permErr.name === 'DevicesNotFoundError') {
          setVoiceNotice('No microphone was detected. Please ensure your microphone is connected and enabled.')
          return
        }
        // If other non-critical error occurs, continue to SpeechRecognition
      }
    }

    // Step 2: Initialize and start Web Speech API instance
    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // ignore
        }
        recognitionRef.current = null
      }

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = getSpeechLocale(currentLanguage)

      recognition.onstart = () => {
        setIsListening(true)
        isStartingVoiceRef.current = false
        setVoiceNotice(null)
      }

      recognition.onresult = (event) => {
        markDirty()
        let sessionFinal = ''
        let sessionInterim = ''

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i]
          if (res.isFinal) {
            sessionFinal += res[0].transcript + ' '
          } else {
            sessionInterim += res[0].transcript
          }
        }

        const voiceText = (sessionFinal + sessionInterim).trim()
        const base = baseDescriptionRef.current
        const updated = base
          ? voiceText
            ? `${base} ${voiceText}`
            : base
          : voiceText

        setDescription(updated)
        if (errors.description) {
          setErrors((prev) => ({ ...prev, description: null }))
        }
      }

      recognition.onerror = (e) => {
        console.warn('SpeechRecognition error event:', e.error)
        isStartingVoiceRef.current = false
        setIsListening(false)

        switch (e.error) {
          case 'not-allowed':
          case 'permission-denied':
            setVoiceNotice('Microphone access was denied. Please allow microphone permissions in your browser to use voice input.')
            break
          case 'service-not-allowed':
            setVoiceNotice('The speech recognition service is currently unavailable. Please try again or continue typing.')
            break
          case 'no-speech':
            setVoiceNotice('No speech detected. Please try again.')
            break
          case 'audio-capture':
            setVoiceNotice('No microphone was detected. Please ensure your microphone is connected and enabled.')
            break
          case 'network':
            setVoiceNotice('Speech recognition network error. Please check your internet connection or continue typing.')
            break
          case 'language-not-supported':
            setVoiceNotice('The selected language is not supported for voice recognition on this device.')
            break
          case 'aborted':
            // User manually stopped or switched away, do not show error
            break
          default:
            setVoiceNotice('Voice recognition was interrupted. You can try again or continue typing directly.')
            break
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        isStartingVoiceRef.current = false
      }

      recognition.start()
    } catch (err) {
      console.warn('SpeechRecognition start exception:', err)
      isStartingVoiceRef.current = false
      setIsListening(false)
      setVoiceNotice('Unable to start voice input. Please type your description directly.')
    }
  }

  // Location detection
  const handleFetchLocation = () => {
    markDirty()
    if (!navigator.geolocation) {
      setLocationState('error')
      return
    }

    setLocationState('loading')
    setLocationUnavailable(false)
    setLocationConfirmed(false)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setCoords({
          lat: latitude,
          lon: longitude,
          accuracy: Math.round(accuracy),
        })

        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 4000)

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { signal: controller.signal, headers: { 'Accept-Language': 'en' } }
          )
          clearTimeout(timeoutId)

          if (res.ok) {
            const data = await res.json()
            if (data?.address) {
              const a = data.address
              const road = a.road || a.pedestrian || a.suburb || a.neighbourhood || ''
              const city = a.city || a.town || a.village || a.county || ''
              const state = a.state || ''
              const postcode = a.postcode || ''
              const parts = [road, city, state, postcode].filter(Boolean)
              const formatted = parts.length > 0 ? parts.join(', ') : data.display_name

              setDetectedAddress(formatted)
              setLocationState('success')
              return
            }
          }
        } catch (err) {
          console.warn('Reverse geocode fallback to coords:', err)
        }

        setDetectedAddress(`Coordinates: ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E (±${Math.round(accuracy)}m)`)
        setLocationState('success')
      },
      (error) => {
        console.warn('Geolocation error:', error)
        setLocationState('error')
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    )
  }

  // Save as Draft action
  const handleSaveDraft = () => {
    const draftPayload = {
      id: draftId || `DRAFT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      description: description.trim(),
      isAnonymous,
      immediateDanger,
      category,
      targetDepartment,
      dateOption,
      observedDate,
      locationState,
      detectedAddress,
      locationConfirmed,
      coords,
      showManualLocation,
      manualAddress,
      locationUnavailable,
      notificationChannels,
      evidenceMeta: [
        ...restoredEvidenceMeta,
        ...evidenceFiles.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      ],
    }

    const saved = saveDraftToStorage(draftPayload)
    setDraftId(saved.id)
    setIsDirty(false)

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setDraftSavedToast(`Draft saved successfully at ${now}`)
    setTimeout(() => setDraftSavedToast(null), 3500)
  }

  // Attempt Cancel / Return to dashboard
  const handleCancelClick = () => {
    if (isDirty && (title.trim() || description.trim() || category || evidenceFiles.length > 0)) {
      setShowDiscardModal(true)
    } else {
      onCancel()
    }
  }

  // Validation
  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Please enter an issue title'
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title should be at least 3 characters'
    }

    if (!description.trim()) {
      newErrors.description = 'Please explain what needs to be fixed'
    } else if (description.trim().length < 6) {
      newErrors.description = 'Description should provide sufficient detail'
    }

    if (!category) {
      newErrors.category = 'Please select an issue category'
    }

    if (!targetDepartment) {
      newErrors.targetDepartment = 'Please select a target department'
    }

    const hasDetectedLoc = locationState === 'success' && detectedAddress
    const hasManualLoc = manualAddress.street.trim() && manualAddress.city.trim()
    const isSkipped = locationUnavailable

    if (!hasDetectedLoc && !hasManualLoc && !isSkipped) {
      newErrors.location = 'Please share location, enter manually, or select skip location'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({
      title: true,
      description: true,
      category: true,
      targetDepartment: true,
      location: true,
    })

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Construct final location text
    let finalLocation = 'Location unavailable / Not provided'
    if (locationState === 'success' && detectedAddress) {
      finalLocation = detectedAddress
    } else if (manualAddress.street.trim() || manualAddress.city.trim()) {
      const parts = [
        manualAddress.street.trim(),
        manualAddress.city.trim(),
        manualAddress.state.trim(),
        manualAddress.pincode.trim(),
      ].filter(Boolean)
      finalLocation = parts.join(', ')
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const refId = `SETU-CIT-2026-${randomNum}`

    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    const formattedTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const newIssue = {
      id: refId,
      title: title.trim(),
      category,
      targetDepartment,
      status: 'submitted',
      date: formattedDate,
      location: finalLocation,
      ward: manualAddress.street.trim() || CITIZEN_USER_PROFILE.ward,
      description: description.trim(),
      upvotes: 1,
      isUpvoted: true,
      isAnonymous,
      immediateDanger,
      observedDate,
      notificationChannels,
      latitude: coords.lat,
      longitude: coords.lon,
      evidence: evidenceFiles.map((f) => ({
        type: f.type.startsWith('video') ? 'video' : f.type.startsWith('image') ? 'photo' : 'document',
        title: f.name,
        caption: `${(f.size / 1024).toFixed(1)} KB`,
        color: '#176B5B',
        previewUrl: f.previewUrl,
      })),
      timeline: [
        {
          step: 'submitted',
          labelKey: 'status.submitted',
          title: 'Issue Submitted',
          date: `Today • ${formattedTime}`,
          actor: isAnonymous ? 'Anonymous Citizen' : CITIZEN_USER_PROFILE.name,
          note: 'Issue successfully registered with SETU portal.',
          completed: true,
        },
        {
          step: 'under_review',
          labelKey: 'status.underReview',
          title: 'Ward Officer Review',
          date: 'Pending Review',
          actor: 'Ward 12 Administration',
          note: 'Awaiting preliminary field verification.',
          completed: false,
        },
        {
          step: 'assigned',
          labelKey: 'status.assigned',
          title: `Assigned to ${targetDepartment}`,
          date: 'Upcoming',
          actor: targetDepartment,
          note: 'Dispatching engineering / service crew.',
          completed: false,
        },
        {
          step: 'action_taken',
          labelKey: 'status.actionTaken',
          title: 'Remediation Action',
          date: 'Upcoming',
          actor: 'Service Crew',
          note: 'Ground resolution work.',
          completed: false,
        },
        {
          step: 'resolved',
          labelKey: 'status.resolved',
          title: 'Quality & Community Sign-off',
          date: 'Upcoming',
          actor: 'Citizen & Quality Audit',
          note: 'Final resolution clearance.',
          completed: false,
        },
      ],
    }

    setTimeout(() => {
      // If submitted from a draft, clean up that draft from storage
      if (draftId) {
        removeDraftFromStorage(draftId)
      }

      setIsSubmitting(false)
      setIsDirty(false)
      setSubmittedIssue(newIssue)
      if (onSubmitSuccess) {
        onSubmitSuccess(newIssue)
      }
    }, 600)
  }

  const handleCopyRef = () => {
    if (submittedIssue) {
      navigator.clipboard.writeText(submittedIssue.id)
      setCopiedRef(true)
      setTimeout(() => setCopiedRef(false), 2000)
    }
  }

  // ==========================================
  // SUCCESS STATE VIEW
  // ==========================================
  if (submittedIssue) {
    return (
      <div className="space-y-6 animate-fade-in font-outfit">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B5B] hover:text-[#125649] transition-colors cursor-pointer group"
          >
            <span className="p-1.5 rounded-lg bg-[#DCEFEA]/60 group-hover:bg-[#DCEFEA] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </span>
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-white border border-[#BFD9D2] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xs">
          {/* Success Header */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#DCEFEA] text-[#176B5B] flex items-center justify-center mx-auto shadow-xs">
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <h2 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28]">
              Issue Submitted Successfully
            </h2>
            <p className="text-sm sm:text-base text-[#5C726E] leading-relaxed">
              Your community issue has been registered on SETU and queued for municipal review.
            </p>
          </div>

          {/* Reference ID Banner */}
          <div className="mt-8 max-w-xl mx-auto bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-5 sm:p-6 text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C726E]">
              Your Reference ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-syne text-2xl sm:text-3xl font-bold text-[#176B5B] tracking-tight">
                {submittedIssue.id}
              </span>
              <button
                onClick={handleCopyRef}
                className="p-2 rounded-lg bg-white border border-[#BFD9D2] text-[#5C726E] hover:text-[#176B5B] hover:border-[#176B5B] transition-colors cursor-pointer text-xs font-medium inline-flex items-center gap-1.5"
                title="Copy Reference ID"
              >
                {copiedRef ? (
                  <>
                    <svg className="w-4 h-4 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[#176B5B]">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-[#5C726E] pt-1">
              Save this ID to track live updates anytime from the Check Status hub.
            </p>
          </div>

          {/* Status Progression Preview */}
          <div className="mt-8 max-w-3xl mx-auto bg-white border border-[#BFD9D2]/70 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-syne text-sm sm:text-base font-bold text-[#1F2A28]">
                Initial Status Progression
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B]">
                <span className="w-2 h-2 rounded-full bg-[#176B5B] animate-pulse" />
                Submitted
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-2">
              {[
                { label: 'Submitted', active: true, completed: true },
                { label: 'Under Review', active: false, completed: false },
                { label: 'Assigned', active: false, completed: false },
                { label: 'Action Taken', active: false, completed: false },
                { label: 'Resolved', active: false, completed: false },
              ].map((stage, i) => (
                <div key={i} className="text-center space-y-1.5">
                  <div
                    className={`h-2 rounded-full ${
                      stage.active
                        ? 'bg-[#176B5B]'
                        : stage.completed
                        ? 'bg-[#176B5B]/60'
                        : 'bg-[#BFD9D2]/40'
                    }`}
                  />
                  <span className={`text-[10px] sm:text-xs block font-medium truncate ${
                    stage.active ? 'text-[#176B5B] font-bold' : 'text-[#5C726E]'
                  }`}>
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Summary Details */}
          <div className="mt-6 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 space-y-1">
              <span className="text-[#5C726E] font-medium block">Issue Title</span>
              <span className="font-semibold text-[#1F2A28] line-clamp-2">{submittedIssue.title}</span>
            </div>
            <div className="p-4 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 space-y-1">
              <span className="text-[#5C726E] font-medium block">Category &amp; Department</span>
              <span className="font-semibold text-[#1F2A28]">
                {submittedIssue.category} • {submittedIssue.targetDepartment}
              </span>
            </div>
            <div className="p-4 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 space-y-1">
              <span className="text-[#5C726E] font-medium block">Location</span>
              <span className="font-semibold text-[#1F2A28] line-clamp-2">{submittedIssue.location}</span>
            </div>
            <div className="p-4 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 space-y-1">
              <span className="text-[#5C726E] font-medium block">Privacy &amp; Danger Level</span>
              <span className="font-semibold text-[#1F2A28]">
                {submittedIssue.isAnonymous ? 'Reported Anonymously' : `Reported by ${CITIZEN_USER_PROFILE.name}`}
                {submittedIssue.immediateDanger ? ' • Urgent Danger' : ' • Standard'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onTrackIssue(submittedIssue.id)}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] text-white text-sm font-semibold shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Track Issue</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#BFD9D2] hover:bg-[#F7FAF9] text-[#1F2A28] text-sm font-semibold transition-colors cursor-pointer text-center"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // MAIN DEDICATED PAGE VIEW
  // ==========================================
  return (
    <div className="space-y-5 animate-fade-in font-outfit">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleCancelClick}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B5B] hover:text-[#125649] transition-colors cursor-pointer group"
        >
          <span className="p-1.5 rounded-lg bg-[#DCEFEA]/60 group-hover:bg-[#DCEFEA] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </span>
          <span>Back to Dashboard</span>
        </button>

        {draftId && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E07A4E]/15 text-[#E07A4E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E07A4E]" />
            Editing Saved Draft
          </span>
        )}
      </div>

      {/* In-page Toast Notification for Draft Save */}
      {draftSavedToast && (
        <div className="p-3.5 bg-[#DCEFEA] border border-[#BFD9D2] rounded-xl text-xs font-semibold text-[#176B5B] flex items-center justify-between gap-3 animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{draftSavedToast}</span>
          </div>
          <span className="text-[11px] text-[#5C726E] font-normal">Stored in local drafts</span>
        </div>
      )}

      {/* Unified Wide Form Container */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Top Header */}
        <div className="pb-6 border-b border-[#BFD9D2]/50">
          <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
            Raise an Issue
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#5C726E] leading-relaxed">
            Tell us what happened and we'll help route it to the right people.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-7">
          {/* Privacy Row */}
          <div className="bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#DCEFEA] text-[#176B5B] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-syne text-sm sm:text-base font-bold text-[#1F2A28]">
                    Report Anonymously
                  </span>
                  {isAnonymous && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCEFEA] text-[#176B5B]">
                      Anonymous Mode
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#5C726E] mt-0.5">
                  Hides your profile details from field officers and public views.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isAnonymous}
              onClick={() => {
                markDirty()
                setIsAnonymous(!isAnonymous)
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] ${
                isAnonymous ? 'bg-[#176B5B]' : 'bg-[#BFD9D2]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAnonymous ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 1. Issue Title */}
          <div className="space-y-2">
            <label htmlFor="issue-title" className="block text-sm font-semibold text-[#1F2A28]">
              Issue Title <span className="text-[#E07A4E]">*</span>
            </label>
            <input
              id="issue-title"
              type="text"
              value={title}
              onChange={(e) => {
                markDirty()
                setTitle(e.target.value)
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }))
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
              placeholder="Briefly describe the issue (e.g. Water leakage near Gandhi Nagar)"
              className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1F2A28] placeholder-[#5C726E]/60 text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-[#176B5B]/20 ${
                touched.title && errors.title
                  ? 'border-[#E07A4E] focus:border-[#E07A4E]'
                  : 'border-[#BFD9D2] hover:border-[#176B5B]/60 focus:border-[#176B5B]'
              }`}
            />
            {touched.title && errors.title && (
              <p className="text-xs text-[#E07A4E] font-medium flex items-center gap-1 mt-1">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* 2. Evidence Upload & Camera Capture (Optional) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#1F2A28]">
                Attach Evidence <span className="text-xs font-normal text-[#5C726E]">(Optional)</span>
              </label>
              <span className="text-xs text-[#5C726E]">PNG, JPEG, MP4, PDF and supported files</span>
            </div>

            {/* Restored Draft Evidence Metadata Notice */}
            {restoredEvidenceMeta.length > 0 && (
              <div className="p-3 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#5C726E]">
                  <span className="font-semibold text-[#1F2A28]">
                    Previously attached in saved draft ({restoredEvidenceMeta.length} files):
                  </span>
                  <span className="text-[11px] text-[#E07A4E] font-medium">Please re-attach before submitting</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {restoredEvidenceMeta.map((meta, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#BFD9D2] text-[#1F2A28] text-[11px]"
                    >
                      <svg className="w-3 h-3 text-[#5C726E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      </svg>
                      <span className="truncate max-w-[140px]">{meta.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDismissRestoredMeta(idx)}
                        className="text-[#5C726E] hover:text-[#E07A4E] cursor-pointer"
                        title="Dismiss"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Zone + Open Camera Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dropzone Container (2 cols on sm) */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`sm:col-span-2 border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-[#176B5B] bg-[#DCEFEA]/30 scale-[1.01]'
                    : 'border-[#BFD9D2] hover:border-[#176B5B] bg-[#F7FAF9]/60 hover:bg-[#F7FAF9]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files) handleFiles(e.target.files)
                  }}
                  className="hidden"
                />
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#BFD9D2] text-[#176B5B] flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#1F2A28]">
                  Add photos, videos or supporting files
                </p>
                <p className="text-xs text-[#5C726E] mt-0.5">
                  Browse files or drag &amp; drop (Max 10MB each)
                </p>
              </div>

              {/* Open Camera Card (Live getUserMedia Capture) */}
              <div
                onClick={handleOpenCamera}
                className="border-2 border-dashed border-[#BFD9D2] hover:border-[#176B5B] rounded-2xl p-5 sm:p-6 text-center cursor-pointer bg-[#F7FAF9]/60 hover:bg-[#F7FAF9] transition-all flex flex-col items-center justify-center group"
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#BFD9D2] text-[#176B5B] group-hover:border-[#176B5B] flex items-center justify-center mx-auto mb-2.5 shadow-2xs transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#1F2A28]">
                  Open Camera
                </p>
                <p className="text-xs text-[#5C726E] mt-0.5">
                  Capture photo directly
                </p>
              </div>
            </div>

            {/* Camera Fallback / Error Message */}
            {cameraError && (
              <div className="p-3 bg-[#E07A4E]/10 border border-[#E07A4E]/30 rounded-xl text-xs text-[#E07A4E] font-medium flex items-center justify-between gap-2 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{cameraError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCameraError(null)}
                  className="text-[#E07A4E] hover:text-[#1F2A28] font-bold text-sm px-1.5 py-0.5"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            {/* In-Page Live Camera Preview Overlay Modal */}
            {isCameraActive && (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="camera-modal-title"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/60 backdrop-blur-xs animate-fadeIn"
                onClick={handleCloseCamera}
              >
                <div
                  className="relative w-full max-w-lg bg-white rounded-2xl border border-[#BFD9D2] shadow-2xl p-5 sm:p-6 space-y-4 animate-scaleUp"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#E07A4E] animate-pulse" />
                      <h3 id="camera-modal-title" className="font-syne text-base font-bold text-[#1F2A28]">
                        Live Camera Preview
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseCamera}
                      aria-label="Close camera"
                      className="p-1.5 rounded-lg text-[#5C726E] hover:text-[#176B5B] hover:bg-[#F7FAF9] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Live Video Feed */}
                  <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-4/3 flex items-center justify-center shadow-inner">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1F2A28]/70 text-white text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-xs">
                      <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                      <span>LIVE FEED</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseCamera}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-[#BFD9D2] bg-[#F7FAF9] text-[#1F2A28] font-outfit font-semibold text-sm hover:bg-[#DCEFEA]/50 transition-colors cursor-pointer"
                    >
                      Cancel / Close
                    </button>
                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#176B5B] text-white font-outfit font-semibold text-sm hover:bg-[#125548] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="3" strokeWidth="2.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>Capture Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Attached Files List */}
            {evidenceFiles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {evidenceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-2 p-2.5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {file.previewUrl ? (
                        <img
                          src={file.previewUrl}
                          alt="Preview"
                          className="w-9 h-9 rounded-lg object-cover border border-[#BFD9D2]/60 shrink-0"
                        />
                      ) : (
                        <span className="w-9 h-9 rounded-lg bg-[#DCEFEA] text-[#176B5B] flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-[#1F2A28] truncate">{file.name}</p>
                        <p className="text-[11px] text-[#5C726E]">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile(file.id)
                      }}
                      className="p-1 rounded-lg text-[#5C726E] hover:text-[#E07A4E] hover:bg-white transition-colors cursor-pointer shrink-0"
                      title="Remove file"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Description + Voice Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="issue-description" className="block text-sm font-semibold text-[#1F2A28]">
                Description <span className="text-[#E07A4E]">*</span>
              </label>
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isListening
                    ? 'bg-[#176B5B] text-white border-[#176B5B] animate-pulse'
                    : 'bg-[#F7FAF9] text-[#176B5B] border-[#BFD9D2] hover:bg-[#DCEFEA]'
                }`}
                title="Speak to dictate description"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                <span>{isListening ? 'Listening... (Tap to stop)' : 'Voice Input'}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                id="issue-description"
                rows={4}
                value={description}
                onChange={(e) => {
                  markDirty()
                  setDescription(e.target.value)
                  if (errors.description) setErrors((prev) => ({ ...prev, description: null }))
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
                placeholder="Explain what needs to be fixed here in detail..."
                className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1F2A28] placeholder-[#5C726E]/60 text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-[#176B5B]/20 ${
                  touched.description && errors.description
                    ? 'border-[#E07A4E] focus:border-[#E07A4E]'
                    : 'border-[#BFD9D2] hover:border-[#176B5B]/60 focus:border-[#176B5B]'
                }`}
              />
            </div>

            {voiceNotice && (
              <div className="p-3 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-xs text-[#5C726E] flex items-center justify-between gap-2 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#176B5B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{voiceNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceNotice(null)}
                  className="text-[#176B5B] font-semibold hover:underline cursor-pointer shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {touched.description && errors.description && (
              <p className="text-xs text-[#E07A4E] font-medium flex items-center gap-1 mt-1">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* 4. Immediate Danger */}
          <div className="bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-syne text-sm sm:text-base font-bold text-[#1F2A28] block">
                Is this issue causing immediate danger?
              </span>
              <span className="text-xs text-[#5C726E] mt-0.5 block">
                SETU may also use AI analysis in the future to help assess urgency.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  markDirty()
                  setImmediateDanger(false)
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  !immediateDanger
                    ? 'bg-white text-[#176B5B] border-[#176B5B] shadow-2xs font-bold'
                    : 'bg-transparent text-[#5C726E] border-[#BFD9D2] hover:bg-white'
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  markDirty()
                  setImmediateDanger(true)
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  immediateDanger
                    ? 'bg-[#E07A4E] text-white border-[#E07A4E] shadow-2xs'
                    : 'bg-transparent text-[#5C726E] border-[#BFD9D2] hover:bg-white hover:text-[#E07A4E]'
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Yes — Urgent Danger</span>
              </button>
            </div>
          </div>

          {/* 5. Classification (Category & Department) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="issue-category" className="block text-sm font-semibold text-[#1F2A28]">
                Category <span className="text-[#E07A4E]">*</span>
              </label>
              <div className="relative">
                <select
                  id="issue-category"
                  value={category}
                  onChange={(e) => {
                    markDirty()
                    setCategory(e.target.value)
                    if (errors.category) setErrors((prev) => ({ ...prev, category: null }))
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, category: true }))}
                  className={`w-full appearance-none px-4 py-3 rounded-xl border bg-white text-[#1F2A28] text-sm pr-10 transition-all focus:outline-hidden focus:ring-2 focus:ring-[#176B5B]/20 cursor-pointer ${
                    touched.category && errors.category
                      ? 'border-[#E07A4E] focus:border-[#E07A4E]'
                      : 'border-[#BFD9D2] hover:border-[#176B5B]/60 focus:border-[#176B5B]'
                  }`}
                >
                  <option value="">Select Category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#5C726E]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              {touched.category && errors.category && (
                <p className="text-xs text-[#E07A4E] font-medium flex items-center gap-1 mt-1">
                  <span>{errors.category}</span>
                </p>
              )}
            </div>

            {/* Target Department */}
            <div className="space-y-2">
              <label htmlFor="issue-department" className="block text-sm font-semibold text-[#1F2A28]">
                Target Department <span className="text-[#E07A4E]">*</span>
              </label>
              <div className="relative">
                <select
                  id="issue-department"
                  value={targetDepartment}
                  onChange={(e) => {
                    markDirty()
                    setTargetDepartment(e.target.value)
                    if (errors.targetDepartment) setErrors((prev) => ({ ...prev, targetDepartment: null }))
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, targetDepartment: true }))}
                  className={`w-full appearance-none px-4 py-3 rounded-xl border bg-white text-[#1F2A28] text-sm pr-10 transition-all focus:outline-hidden focus:ring-2 focus:ring-[#176B5B]/20 cursor-pointer ${
                    touched.targetDepartment && errors.targetDepartment
                      ? 'border-[#E07A4E] focus:border-[#E07A4E]'
                      : 'border-[#BFD9D2] hover:border-[#176B5B]/60 focus:border-[#176B5B]'
                  }`}
                >
                  <option value="">Select Department...</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#5C726E]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              {touched.targetDepartment && errors.targetDepartment && (
                <p className="text-xs text-[#E07A4E] font-medium flex items-center gap-1 mt-1">
                  <span>{errors.targetDepartment}</span>
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-[#5C726E]">
                Suggestions may be assisted by SETU AI in the future.
              </p>
            </div>
          </div>

          {/* 6. Issue Observed Date (Defaults to Today) */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#1F2A28]">
              When did you observe this issue? <span className="text-xs font-normal text-[#5C726E]">(Defaults to Today)</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  markDirty()
                  setDateOption('today')
                  setObservedDate(getTodayStr())
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  dateOption === 'today'
                    ? 'bg-[#176B5B] text-white border-[#176B5B]'
                    : 'bg-white text-[#5C726E] border-[#BFD9D2] hover:bg-[#F7FAF9]'
                }`}
              >
                Today ({getTodayStr()})
              </button>
              <button
                type="button"
                onClick={() => {
                  markDirty()
                  setDateOption('yesterday')
                  setObservedDate(getYesterdayStr())
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  dateOption === 'yesterday'
                    ? 'bg-[#176B5B] text-white border-[#176B5B]'
                    : 'bg-white text-[#5C726E] border-[#BFD9D2] hover:bg-[#F7FAF9]'
                }`}
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => {
                  markDirty()
                  setDateOption('custom')
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  dateOption === 'custom'
                    ? 'bg-[#176B5B] text-white border-[#176B5B]'
                    : 'bg-white text-[#5C726E] border-[#BFD9D2] hover:bg-[#F7FAF9]'
                }`}
              >
                Choose Date
              </button>

              {dateOption === 'custom' && (
                <input
                  type="date"
                  value={observedDate}
                  onChange={(e) => {
                    markDirty()
                    setObservedDate(e.target.value)
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#BFD9D2] text-xs text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              )}
            </div>
          </div>

          {/* 7. Current Location */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#1F2A28]">
                Issue Location <span className="text-[#E07A4E]">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  markDirty()
                  setShowManualLocation(!showManualLocation)
                }}
                className="text-xs text-[#176B5B] hover:underline font-semibold cursor-pointer"
              >
                {showManualLocation ? 'Hide manual fields' : 'Correct location manually'}
              </button>
            </div>

            <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#BFD9D2] text-[#176B5B] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    {locationState === 'initial' && (
                      <p className="text-xs sm:text-sm text-[#5C726E]">
                        Share your location to help identify the issue accurately.
                      </p>
                    )}
                    {locationState === 'loading' && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#176B5B] font-medium">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        <span>Fetching your location...</span>
                      </div>
                    )}
                    {locationState === 'success' && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#176B5B]">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Location Detected</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#1F2A28] font-medium">
                          {detectedAddress}
                        </p>
                      </div>
                    )}
                    {locationState === 'error' && (
                      <p className="text-xs sm:text-sm text-[#E07A4E] font-medium">
                        We couldn't detect your location. Please try again or enter it manually below.
                      </p>
                    )}
                    {locationUnavailable && (
                      <p className="text-xs sm:text-sm text-[#5C726E] font-medium">
                        Location marked as unavailable for this submission.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={locationState === 'loading'}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#176B5B] text-[#176B5B] hover:bg-[#DCEFEA]/40 text-xs font-semibold transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span>{locationState === 'success' ? 'Re-detect Location' : 'Use My Current Location'}</span>
                </button>
              </div>

              {/* Binary Choice after Successful Detection: Use This Location / Correct Manually */}
              {locationState === 'success' && detectedAddress && (
                <div className="pt-2.5 border-t border-[#BFD9D2]/40 flex flex-wrap items-center gap-2.5 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      markDirty()
                      setLocationConfirmed(true)
                      setShowManualLocation(false)
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border inline-flex items-center gap-1.5 ${
                      locationConfirmed
                        ? 'bg-[#176B5B] text-white border-[#176B5B] shadow-2xs'
                        : 'bg-white text-[#176B5B] border-[#BFD9D2] hover:bg-[#DCEFEA]/30'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{locationConfirmed ? 'Location Confirmed' : 'Use This Location'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      markDirty()
                      setLocationConfirmed(false)
                      setShowManualLocation(true)
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-[#5C726E] hover:text-[#1F2A28] border border-[#BFD9D2] hover:bg-[#F7FAF9] transition-colors cursor-pointer"
                  >
                    Correct Manually
                  </button>
                </div>
              )}

              {/* Validation Escape Hatch */}
              <div className="pt-2 border-t border-[#BFD9D2]/40 flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-[#5C726E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={locationUnavailable}
                    onChange={(e) => {
                      markDirty()
                      setLocationUnavailable(e.target.checked)
                      if (e.target.checked) {
                        setLocationState('unavailable')
                        if (errors.location) setErrors((prev) => ({ ...prev, location: null }))
                      }
                    }}
                    className="rounded border-[#BFD9D2] text-[#176B5B] focus:ring-[#176B5B]"
                  />
                  <span>Location unavailable (skip location verification)</span>
                </label>
              </div>
            </div>

            {/* Manual Location Fields (Revealed on click) */}
            {showManualLocation && (
              <div className="p-4 sm:p-5 bg-white border border-[#BFD9D2] rounded-2xl space-y-4 animate-fade-in">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">
                  Manual Address Entry
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <label className="text-xs text-[#5C726E] font-medium">Street / Ward / Area</label>
                    <input
                      type="text"
                      value={manualAddress.street}
                      onChange={(e) => {
                        markDirty()
                        setManualAddress((prev) => ({ ...prev, street: e.target.value }))
                        if (errors.location) setErrors((prev) => ({ ...prev, location: null }))
                      }}
                      placeholder="e.g. 11th Street, Gandhi Nagar"
                      className="w-full px-3 py-2 rounded-lg border border-[#BFD9D2] text-xs focus:outline-hidden focus:border-[#176B5B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#5C726E] font-medium">City / Town</label>
                    <input
                      type="text"
                      value={manualAddress.city}
                      onChange={(e) => {
                        markDirty()
                        setManualAddress((prev) => ({ ...prev, city: e.target.value }))
                        if (errors.location) setErrors((prev) => ({ ...prev, location: null }))
                      }}
                      placeholder="e.g. Tiruppur"
                      className="w-full px-3 py-2 rounded-lg border border-[#BFD9D2] text-xs focus:outline-hidden focus:border-[#176B5B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#5C726E] font-medium">State</label>
                    <input
                      type="text"
                      value={manualAddress.state}
                      onChange={(e) => {
                        markDirty()
                        setManualAddress((prev) => ({ ...prev, state: e.target.value }))
                      }}
                      placeholder="State"
                      className="w-full px-3 py-2 rounded-lg border border-[#BFD9D2] text-xs focus:outline-hidden focus:border-[#176B5B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#5C726E] font-medium">Pincode</label>
                    <input
                      type="text"
                      value={manualAddress.pincode}
                      onChange={(e) => {
                        markDirty()
                        setManualAddress((prev) => ({ ...prev, pincode: e.target.value }))
                      }}
                      placeholder="e.g. 641603"
                      className="w-full px-3 py-2 rounded-lg border border-[#BFD9D2] text-xs focus:outline-hidden focus:border-[#176B5B]"
                    />
                  </div>
                </div>
              </div>
            )}

            {touched.location && errors.location && (
              <p className="text-xs text-[#E07A4E] font-medium flex items-center gap-1 mt-1">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errors.location}</span>
              </p>
            )}
          </div>

          {/* 8. Live Progress Notifications */}
          <div className="bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-2xl p-4 sm:p-5 space-y-3">
            <div>
              <h4 className="font-syne text-sm sm:text-base font-bold text-[#1F2A28]">
                Receive updates
              </h4>
              <p className="text-xs text-[#5C726E] mt-0.5">
                Choose how you'd like to receive important updates about this issue.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              {/* WhatsApp */}
              <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1F2A28] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationChannels.whatsapp}
                  onChange={(e) => {
                    markDirty()
                    setNotificationChannels((prev) => ({ ...prev, whatsapp: e.target.checked }))
                  }}
                  className="w-4 h-4 rounded border-[#BFD9D2] text-[#176B5B] focus:ring-[#176B5B] cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  WhatsApp Updates
                </span>
              </label>

              {/* SMS */}
              <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1F2A28] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationChannels.sms}
                  onChange={(e) => {
                    markDirty()
                    setNotificationChannels((prev) => ({ ...prev, sms: e.target.checked }))
                  }}
                  className="w-4 h-4 rounded border-[#BFD9D2] text-[#176B5B] focus:ring-[#176B5B] cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  SMS Notifications
                </span>
              </label>
            </div>
          </div>

          {/* Bottom Action Area: LEFT Cancel - CENTER Save as Draft - RIGHT Submit Issue */}
          <div className="pt-6 border-t border-[#BFD9D2]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#BFD9D2] hover:bg-[#F7FAF9] text-[#1F2A28] text-sm font-semibold transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#176B5B] text-[#176B5B] hover:bg-[#DCEFEA]/40 text-sm font-semibold transition-colors cursor-pointer text-center inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Save as Draft</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] text-white text-sm font-semibold shadow-xs transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span>Submitting your issue...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Issue</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Discard Unsaved Changes Confirmation Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/40 backdrop-blur-xs animate-fade-in font-outfit">
          <div className="bg-white rounded-2xl border border-[#BFD9D2] max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#E07A4E]/15 text-[#E07A4E] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </span>
              <div>
                <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28]">
                  Discard unsaved changes?
                </h3>
                <p className="text-xs text-[#5C726E]">
                  You have unsaved changes in this complaint form.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#5C726E] leading-relaxed">
              If you leave now without saving, any newly entered details or attachments will be lost. You can save your draft to finish later.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#BFD9D2] hover:bg-[#F7FAF9] text-[#1F2A28] text-xs font-semibold transition-colors cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveDraft()
                  setShowDiscardModal(false)
                  onCancel()
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#176B5B] text-white text-xs font-semibold hover:bg-[#125649] transition-colors cursor-pointer"
              >
                Save &amp; Exit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardModal(false)
                  onCancel()
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#E07A4E]/10 text-[#E07A4E] hover:bg-[#E07A4E]/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RaiseIssueForm
