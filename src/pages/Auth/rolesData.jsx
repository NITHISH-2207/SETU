export const STAKEHOLDER_ROLES = [
  {
    id: 'citizen',
    title: 'Citizen',
    subtitle: 'Individuals & Local Communities',
    shortName: 'Citizen',
    tagline: 'Grassroots Engagement',
    headline: 'Your voice can start meaningful change.',
    storyText: 'Share what matters in your community and connect with institutions, researchers, and leaders who can act.',
    description: 'Submit societal issues with local context, provide community evidence, and track grassroots progress toward real-world solutions.',
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    badge: 'Open to All',
    whatYouCanDo: [
      'Share a societal issue',
      'Track progress and updates',
      'Connect with institutions and partners',
    ],
  },
  {
    id: 'university',
    title: 'University / Institution',
    subtitle: 'Researchers, Faculty & Academia',
    shortName: 'University / Institution',
    tagline: 'Research & Innovation',
    headline: 'Turn real-world needs into meaningful solutions.',
    storyText: 'Transform community issues into academic research, student innovations, faculty studies, and verified pilot projects.',
    description: 'Connect student initiatives and academic research directly to verified societal issues for pilot projects, technical studies, and innovation.',
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    badge: 'Academic & R&D',
    whatYouCanDo: [
      'Receive relevant problem opportunities',
      'Collaborate on solutions',
      'Track project progress',
    ],
  },
  {
    id: 'industry',
    title: 'Industry / CSR',
    subtitle: 'Corporate Partners & CSR Funds',
    shortName: 'Industry / CSR',
    tagline: 'Resources & Scale',
    headline: 'Support innovation. Create measurable impact.',
    storyText: 'Channel Corporate Social Responsibility (CSR) funds, technical infrastructure, and industrial capacity toward vetted societal solutions.',
    description: 'Direct Corporate Social Responsibility (CSR) resources, technology capabilities, and industrial expertise toward high-impact societal needs.',
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    badge: 'CSR & Enterprise',
    whatYouCanDo: [
      'Support impactful initiatives',
      'Contribute expertise and resources',
      'Collaborate with institutions',
    ],
  },
  {
    id: 'government',
    title: 'Government / Authority',
    subtitle: 'Policymakers & Public Bodies',
    shortName: 'Government / Authority',
    tagline: 'Policy & Execution',
    headline: 'Connecting public needs with coordinated action.',
    storyText: 'Access verified, community-vetted public issues to coordinate administrative welfare, municipal execution, and policy follow-through.',
    description: 'Access verified, categorized public issues to guide municipal action, welfare allocations, policy interventions, and administrative follow-through.',
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V10" />
        <path d="M19 21V10" />
        <path d="M9 21V10" />
        <path d="M15 21V10" />
        <path d="m2 10 10-6 10 6" />
      </svg>
    ),
    badge: 'Public Administration',
    whatYouCanDo: [
      'Coordinate societal challenges',
      'Connect stakeholders',
      'Track implementation and outcomes',
    ],
  },
]
