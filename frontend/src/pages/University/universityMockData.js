/**
 * SETU University Portal - Mock Data & Constants
 * Designed for easy future REST API replacement.
 */

export const MOCK_UNIVERSITIES = [
  { id: 'u1', name: 'Anna University, Chennai', state: 'Tamil Nadu', code: 'AU-CHE' },
  { id: 'u2', name: 'Indian Institute of Technology Madras (IIT Madras)', state: 'Tamil Nadu', code: 'IIT-M' },
  { id: 'u3', name: 'PSG College of Technology, Coimbatore', state: 'Tamil Nadu', code: 'PSG-CBE' },
  { id: 'u4', name: 'National Institute of Technology, Tiruchirappalli (NITT)', state: 'Tamil Nadu', code: 'NITT' },
  { id: 'u5', name: 'Coimbatore Institute of Technology (CIT)', state: 'Tamil Nadu', code: 'CIT-CBE' },
  { id: 'u6', name: 'Amrita Vishwa Vidyapeetham, Coimbatore', state: 'Tamil Nadu', code: 'AVV' },
  { id: 'u7', name: 'Vellore Institute of Technology (VIT)', state: 'Tamil Nadu', code: 'VIT-VEL' },
  { id: 'u8', name: 'SRM Institute of Science and Technology, Chennai', state: 'Tamil Nadu', code: 'SRM-IST' },
  { id: 'u9', name: 'Indian Institute of Science (IISc), Bengaluru', state: 'Karnataka', code: 'IISC' },
  { id: 'u10', name: 'Thiagarajar College of Engineering, Madurai', state: 'Tamil Nadu', code: 'TCE-MDU' },
  { id: 'u11', name: 'Kongu Engineering College, Perundurai', state: 'Tamil Nadu', code: 'KEC-ERD' },
]

export const SUGGESTED_DOMAINS = [
  'Water Sanitation & Supply',
  'Urban Drainage & Flood Mitigation',
  'Renewable Energy & Solar Grids',
  'Waste Management & Recycling',
  'Rural Healthcare & Telemedicine',
  'Road Safety & Smart Mobility',
  'Air Quality Monitoring',
  'AI for Social Impact',
  'Agricultural Tech & Irrigation',
  'Public Infrastructure & Lighting',
]

export const SUGGESTED_SKILLS = [
  'Embedded Systems / IoT',
  'Data Science & Analytics',
  'GIS & Spatial Mapping',
  'Civil & Structural Engineering',
  'Full Stack Web Development',
  'Machine Learning & Computer Vision',
  'Environmental Testing',
  'Mobile App Development',
  'Public Health Surveying',
  'CAD / 3D Modeling',
  'Project Management',
]

export const DEMO_ADMIN_PROFILE = {
  name: 'Dr. R. Sundaram',
  email: 'admin.setu@annauniv.edu',
  role: 'University Administrator',
  university: 'Anna University, Chennai',
  institutionCode: 'AU-CHE',
  status: 'ACTIVE',
}

export const DEMO_STUDENT_PROFILE = {
  name: 'Kavitha R.',
  email: 'kavitha.student@annauniv.edu',
  phone: '9845123456',
  university: 'Anna University, Chennai',
  department: 'Computer Science & Engineering',
  yearOfStudy: '3rd Year (Junior)',
  skills: ['Data Science & Analytics', 'Full Stack Web Development', 'GIS & Spatial Mapping'],
  domains: ['Water Sanitation & Supply', 'Smart Mobility'],
  status: 'PENDING_APPROVAL', // 'PENDING_APPROVAL' | 'ACTIVE'
}

export const DEMO_MENTOR_PROFILE = {
  name: 'Prof. K. Narayanan',
  email: 'narayanan.mentor@iitm.ac.in',
  phone: '9876543210',
  university: 'Indian Institute of Technology Madras (IIT Madras)',
  designation: 'Associate Professor',
  department: 'Civil & Environmental Engineering',
  experience: '12+ Years',
  domains: ['Water Sanitation & Supply', 'Urban Drainage & Flood Mitigation'],
  skills: ['Environmental Testing', 'Civil & Structural Engineering', 'GIS & Spatial Mapping'],
  status: 'PENDING_APPROVAL', // 'PENDING_APPROVAL' | 'ACTIVE'
}
