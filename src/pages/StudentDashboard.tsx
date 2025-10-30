import { useState, useEffect, useRef } from 'react'
import './StudentDashboard.css'
import { getFaculty, getRoom } from '../utils/timetable'

type TimetableSlot = {
  time: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
}

type Props = {
  timetable: TimetableSlot[]
}

export default function StudentDashboard({ timetable }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState<'dashboard' | 'profile' | 'courses' | 'attendance' | 'assignments' | 'resources' | 'feedback' | 'notices' | 'griet-guidelines' | 'griet-news' | 'griet-internships' | 'griet-resume' | 'helpdesk-dayscholar' | 'helpdesk-hostler' | 'settings' | 'exams-schedule' | 'exams-answer-keys' | 'exams-grades-and-marks'>('dashboard')
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false)
  const [isGRIETOpen, setIsGRIETOpen] = useState(false)
  const [isExamsOpen, setIsExamsOpen] = useState(false)
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false)
  const [activeDay, setActiveDay] = useState<keyof Omit<TimetableSlot, 'time'>>('monday')
  const [selectedSemester, setSelectedSemester] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const studentName = 'Yashwanth Devulapally'

  const [feedbackCourseCode, setFeedbackCourseCode] = useState<string>('')
  const [feedbackRatings, setFeedbackRatings] = useState<{ teaching: number; materials: number; assessment: number; overall: number }>({ teaching: 5, materials: 5, assessment: 5, overall: 5 })
  const [feedbackComments, setFeedbackComments] = useState<string>('')
  const [feedbackAnonymous, setFeedbackAnonymous] = useState<boolean>(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false)
  
  // Chatbot states
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [chatInput, setChatInput] = useState<string>('')
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // ATC Checker states
  const [atcHandle, setAtcHandle] = useState<string>('')
  const [atcResult, setAtcResult] = useState<any>(null)
  const [isLoadingAtc, setIsLoadingAtc] = useState<boolean>(false)
  
  // Settings states
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      assignmentReminders: true,
      examAlerts: true,
      announcements: true,
    },
    appearance: {
      darkMode: false,
      compactView: false,
      language: 'en',
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
    },
    account: {
      twoFactorAuth: false,
      autoLogout: true,
      sessionTimeout: '30',
    }
  })
  
  const days: Array<{ key: keyof Omit<TimetableSlot, 'time'>; label: string }> = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
  ]
  const isInAcademics = activePage === 'courses' || activePage === 'attendance' || activePage === 'assignments' || activePage === 'resources' || activePage === 'feedback'
  const isInExams = activePage === 'exams-schedule' || activePage === 'exams-answer-keys' || activePage === 'exams-grades-and-marks'
  const isInGRIET = activePage === 'griet-guidelines' || activePage === 'griet-news' || activePage === 'griet-internships' || activePage === 'griet-resume'
  const isInHelpDesk = activePage === 'helpdesk-dayscholar' || activePage === 'helpdesk-hostler'
  
  // Semester-wise subjects data
  const semesterSubjects: Record<number, Array<{ subject: string; total: number; present: number; absent: number; percentage: number }>> = {
    1: [
      { subject: 'Linear Algebra and Function Approximation', total: 40, present: 34, absent: 6, percentage: 85 },
      { subject: 'Applied Physics', total: 38, present: 36, absent: 2, percentage: 95 },
      { subject: 'English', total: 35, present: 32, absent: 3, percentage: 91 },
      { subject: 'Programming for Problem Solving', total: 42, present: 38, absent: 4, percentage: 90 },
      { subject: 'Graphics for Engineers', total: 36, present: 32, absent: 4, percentage: 89 },
    ],
    2: [
      { subject: 'Differential Equations and Vector Calculus', total: 40, present: 35, absent: 5, percentage: 88 },
      { subject: 'Engineering Chemistry', total: 38, present: 36, absent: 2, percentage: 95 },
      { subject: 'Fundamentals of Electrical Engineering', total: 35, present: 32, absent: 3, percentage: 91 },
      { subject: 'Data Structures', total: 42, present: 38, absent: 4, percentage: 90 },
    ],
    3: [
      { subject: 'Digital Logic Design', total: 40, present: 36, absent: 4, percentage: 90 },
      { subject: 'Java Programming', total: 38, present: 35, absent: 3, percentage: 92 },
      { subject: 'Discrete Mathematics', total: 35, present: 32, absent: 3, percentage: 91 },
      { subject: 'Economics and Accounting for Engineers', total: 36, present: 33, absent: 3, percentage: 92 },
      { subject: 'Database Management Systems', total: 40, present: 37, absent: 3, percentage: 93 },
    ],
    4: [
      { subject: 'Computer Organization', total: 40, present: 36, absent: 4, percentage: 90 },
      { subject: 'Operating Systems', total: 38, present: 35, absent: 3, percentage: 92 },
      { subject: 'Applied Statistics for Engineers', total: 35, present: 32, absent: 3, percentage: 91 },
      { subject: 'Full Stack Web Development', total: 42, present: 38, absent: 4, percentage: 90 },
      { subject: 'Design and Analysis of Algorithms', total: 40, present: 36, absent: 4, percentage: 90 },
    ],
    5: [
      { subject: 'Computer Networks', total: 40, present: 36, absent: 4, percentage: 90 },
      { subject: 'Data Warehousing and Data Mining', total: 38, present: 35, absent: 3, percentage: 92 },
      { subject: 'Artificial Intelligence', total: 42, present: 38, absent: 4, percentage: 90 },
      { subject: 'Professional Elective I', total: 35, present: 33, absent: 2, percentage: 94 },
      { subject: 'Open Elective I', total: 36, present: 34, absent: 2, percentage: 94 },
    ],
  }

  const attendance = semesterSubjects[selectedSemester] || semesterSubjects[1]

  // Semester-wise courses data
  const semesterCourses: Record<number, Array<{ courseName: string; code: string; professor: string; credits: number; googleClassroom: string }>> = {
    1: [
      { courseName: 'Linear Algebra and Function Approximation', code: 'GR22A1001', professor: 'Dr. XYZ', credits: 4, googleClassroom: 'https://classroom.google.com/c/example1' },
      { courseName: 'Applied Physics', code: 'GR22A1003', professor: 'Prof. ABC', credits: 4, googleClassroom: 'https://classroom.google.com/c/example2' },
      { courseName: 'English', code: 'GR22A1006', professor: 'Dr. PQR', credits: 2, googleClassroom: 'https://classroom.google.com/c/example3' },
      { courseName: 'Programming for Problem Solving', code: 'GR22A1007', professor: 'Prof. DEF', credits: 3, googleClassroom: 'https://classroom.google.com/c/example4' },
      { courseName: 'Graphics for Engineers', code: 'GR22A1011', professor: 'Dr. GHI', credits: 3, googleClassroom: 'https://classroom.google.com/c/example5' },
      { courseName: 'Applied Physics Lab', code: 'GR22A1013', professor: 'Prof. ABC', credits: 1.5, googleClassroom: 'https://classroom.google.com/c/example6' },
      { courseName: 'Programming for Problem Solving Lab', code: 'GR22A1017', professor: 'Prof. DEF', credits: 1.5, googleClassroom: 'https://classroom.google.com/c/example7' },
      { courseName: 'English Language and Communication Skills Lab', code: 'GR22A1016', professor: 'Dr. PQR', credits: 1, googleClassroom: 'https://classroom.google.com/c/example8' },
    ],
    2: [
      { courseName: 'Differential Equations and Vector Calculus', code: 'GR22A1002', professor: 'Dr. LMN', credits: 4, googleClassroom: 'https://classroom.google.com/c/example9' },
      { courseName: 'Engineering Chemistry', code: 'GR22A1005', professor: 'Prof. STU', credits: 4, googleClassroom: 'https://classroom.google.com/c/example10' },
      { courseName: 'Fundamentals of Electrical Engineering', code: 'GR22A1008', professor: 'Dr. VWX', credits: 3, googleClassroom: 'https://classroom.google.com/c/example11' },
      { courseName: 'Data Structures', code: 'GR22A1012', professor: 'Dr G Karuna', credits: 3, googleClassroom: 'https://classroom.google.com/c/example12' },
      { courseName: 'Engineering Chemistry Lab', code: 'GR22A1015', professor: 'Prof. STU', credits: 1.5, googleClassroom: 'https://classroom.google.com/c/example13' },
      { courseName: 'Electrical Engineering Lab', code: 'GR22A1019', professor: 'Dr. VWX', credits: 1, googleClassroom: 'https://classroom.google.com/c/example14' },
      { courseName: 'Data Structures Lab', code: 'GR22A1020', professor: 'Dr G Karuna', credits: 1, googleClassroom: 'https://classroom.google.com/c/example15' },
      { courseName: 'Engineering Workshop', code: 'GR22A1021', professor: 'Prof. YZA', credits: 2.5, googleClassroom: 'https://classroom.google.com/c/example16' },
    ],
    3: [
      { courseName: 'Digital Logic Design', code: 'GR22A2067', professor: 'Prof. BCD', credits: 3, googleClassroom: 'https://classroom.google.com/c/example17' },
      { courseName: 'Java Programming', code: 'GR22A2068', professor: 'Prof. EFG', credits: 3, googleClassroom: 'https://classroom.google.com/c/example18' },
      { courseName: 'Discrete Mathematics', code: 'GR22A2075', professor: 'Dr. HIJ', credits: 3, googleClassroom: 'https://classroom.google.com/c/example19' },
      { courseName: 'Economics and Accounting for Engineers', code: 'GR22A2004', professor: 'Prof. KLM', credits: 3, googleClassroom: 'https://classroom.google.com/c/example20' },
      { courseName: 'Database Management Systems', code: 'GR22A2069', professor: 'Kiranmai', credits: 3, googleClassroom: 'https://classroom.google.com/c/example21' },
      { courseName: 'Scripting Languages Lab', code: 'GR22A2085', professor: 'Prof. NOP', credits: 1.5, googleClassroom: 'https://classroom.google.com/c/example22' },
      { courseName: 'Java Programming Lab', code: 'GR22A2071', professor: 'Prof. EFG', credits: 2, googleClassroom: 'https://classroom.google.com/c/example23' },
      { courseName: 'DBMS Lab', code: 'GR22A2072', professor: 'Kiranmai', credits: 1.5, googleClassroom: 'https://classroom.google.com/c/example24' },
    ],
    4: [
      { courseName: 'Computer Organization', code: 'GR22A2073', professor: 'Prof. QRS', credits: 3, googleClassroom: 'https://classroom.google.com/c/example25' },
      { courseName: 'Operating Systems', code: 'GR22A2074', professor: 'Poornima', credits: 3, googleClassroom: 'https://classroom.google.com/c/example26' },
      { courseName: 'Applied Statistics for Engineers', code: 'GR22A2006', professor: 'Dr. TUV', credits: 3, googleClassroom: 'https://classroom.google.com/c/example27' },
      { courseName: 'Full Stack Web Development', code: 'GR22A2076', professor: 'Annapurna', credits: 3, googleClassroom: 'https://classroom.google.com/c/example28' },
      { courseName: 'Design and Analysis of Algorithms', code: 'GR22A2077', professor: 'Prof. WXY', credits: 3, googleClassroom: 'https://classroom.google.com/c/example29' },
      { courseName: 'Full Stack Web Development Lab', code: 'GR22A2078', professor: 'Annapurna', credits: 1.5, googleClassroom: 'https://classroom.google.com/c/example30' },
      { courseName: 'Operating Systems Lab', code: 'GR22A2079', professor: 'Poornima', credits: 1.5, googleClassroom: 'https://classroom.google.com/c/example31' },
      { courseName: 'Visual Programming using C# and .NET Lab', code: 'GR22A2080', professor: 'Prof. ZAB', credits: 2, googleClassroom: 'https://classroom.google.com/c/example32' },
    ],
    5: [
      { courseName: 'Computer Networks', code: 'GR22A3044', professor: 'Shamila', credits: 3, googleClassroom: 'https://classroom.google.com/c/example33' },
      { courseName: 'Data Warehousing and Data Mining', code: 'GR22A3069', professor: 'Prof. CDE', credits: 3, googleClassroom: 'https://classroom.google.com/c/example34' },
      { courseName: 'Artificial Intelligence', code: 'GR22A3070', professor: 'Prof. FGH', credits: 3, googleClassroom: 'https://classroom.google.com/c/example35' },
      { courseName: 'Professional Elective I', code: 'PE-I', professor: 'TBA', credits: 3, googleClassroom: 'https://classroom.google.com/c/example36' },
      { courseName: 'Open Elective I', code: 'OE-I', professor: 'TBA', credits: 3, googleClassroom: 'https://classroom.google.com/c/example37' },
      { courseName: 'Data Warehousing and Data Mining Lab', code: 'GR22A3073', professor: 'Prof. CDE', credits: 2, googleClassroom: 'https://classroom.google.com/c/example38' },
      { courseName: 'AI Lab using Python', code: 'GR22A3074', professor: 'Prof. FGH', credits: 1.5, googleClassroom: 'https://classroom.google.com/c/example39' },
      { courseName: 'R Programming Lab', code: 'GR22A2070', professor: 'Prof. IJK', credits: 1.5, googleClassroom: 'https://classroom.google.com/c/example40' },
    ],
  }

  const courses = semesterCourses[selectedSemester] || semesterCourses[1]

  const notices = [
    { notice: 'Mid-semester examinations will commence from 15th February 2025', date: '2025-01-20' },
    { notice: 'Fee payment deadline extended to 25th January 2025', date: '2025-01-18' },
    { notice: 'Library will remain closed on Republic Day (26th January)', date: '2025-01-17' },
    { notice: 'Project submission deadline for Final Year students: 30th January 2025', date: '2025-01-15' },
    { notice: 'Sports Day event scheduled for 5th February 2025', date: '2025-01-12' },
    { notice: 'Seminar on Career Opportunities in Tech Industry on 22nd January', date: '2025-01-10' },
  ]

  // Chatbot handler using Gemini API
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoadingChat) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoadingChat(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        throw new Error('API key not configured')
      }

      // Using Gemini 1.5 Flash (stable model) - changed from gemini-2.5-flash-latest
      const modelName = 'gemini-2.5-flash'
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{
              text: `You are a helpful student support assistant for GRIET (Gokaraju Rangaraju Institute of Engineering and Technology). Answer the following question concisely and helpfully. Be friendly and professional. Question: ${userMessage}`
            }]
          }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log('API Response:', data) // Debug log

      // Handle response structure
      let assistantMessage = ''
      
      if (data.candidates && data.candidates[0]) {
        const candidate = data.candidates[0]
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          assistantMessage = candidate.content.parts[0].text || ''
        }
      }

      if (!assistantMessage || assistantMessage.trim() === '') {
        assistantMessage = 'I received an empty response. Please try rephrasing your question or check the console for details.'
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }])
    } catch (error: any) {
      console.error('Chatbot error:', error)
      let errorMessage = 'I encountered an error. Please try again later.'
      
      if (error.message === 'API key not configured') {
        errorMessage = '⚠️ API key not configured. Please set VITE_GEMINI_API_KEY in your .env file. Get your API key from https://aistudio.google.com/app/apikey'
      } else if (error.message?.includes('API returned 400')) {
        errorMessage = 'Invalid API request. Please check your API key is valid.'
      } else if (error.message?.includes('API returned 401')) {
        errorMessage = 'API key is invalid or expired. Please check your VITE_GEMINI_API_KEY in the .env file.'
      } else if (error.message?.includes('API returned 403')) {
        errorMessage = 'API access forbidden. Please check your API key permissions.'
      } else if (error.message?.includes('API returned 429')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }])
    } finally {
      setIsLoadingChat(false)
    }
  }

  const handleLogout = () => {
    try {
      const preservedTimetable = localStorage.getItem('timetable')
      localStorage.clear()
      if (preservedTimetable) {
        localStorage.setItem('timetable', preservedTimetable)
      }
      sessionStorage.clear()
    } catch {}
    window.location.href = '/'
  }

  // ATC Checker handler (mock implementation)
  const handleCheckAtc = async () => {
    if (!atcHandle.trim() || isLoadingAtc) return
    setIsLoadingAtc(true)
    
    try {
      // Mock ATC API call - replace with actual AtCoder API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAtcResult({
        handle: atcHandle,
        rating: Math.floor(Math.random() * 3000) + 800,
        rank: Math.floor(Math.random() * 50000) + 1000,
        solved: Math.floor(Math.random() * 500) + 100,
        color: ['Gray', 'Brown', 'Green', 'Cyan', 'Blue', 'Yellow', 'Orange', 'Red'][Math.floor(Math.random() * 8)]
      })
    } catch (error) {
      console.error('ATC Checker error:', error)
    } finally {
      setIsLoadingAtc(false)
    }
  }

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Helper function for rating color
  const getRatingColor = (color: string) => {
    const colors: Record<string, string> = {
      'Gray': '#808080',
      'Brown': '#804000',
      'Green': '#00C000',
      'Cyan': '#00E0E0',
      'Blue': '#0000FF',
      'Yellow': '#C0C000',
      'Orange': '#FF8000',
      'Red': '#FF0000'
    }
    return colors[color] || '#000000'
  }

  // Resources data
  const resources = [
    { category: 'Textbooks', items: [
      { name: 'Introduction to Algorithms (CLRS)', type: 'PDF', size: '12.5 MB', link: '#' },
      { name: 'Database System Concepts', type: 'PDF', size: '8.2 MB', link: '#' },
      { name: 'Computer Networks - Tanenbaum', type: 'PDF', size: '15.3 MB', link: '#' },
    ]},
    { category: 'Lecture Notes', items: [
      { name: 'Operating Systems - Week 1-8', type: 'PDF', size: '5.1 MB', link: '#' },
      { name: 'Full Stack Development Slides', type: 'PPTX', size: '22.4 MB', link: '#' },
      { name: 'AI Fundamentals Notes', type: 'PDF', size: '3.8 MB', link: '#' },
    ]},
    { category: 'Practice Problems', items: [
      { name: 'DSA Problem Set - LeetCode', type: 'PDF', size: '1.2 MB', link: '#' },
      { name: 'System Design Questions', type: 'DOCX', size: '856 KB', link: '#' },
      { name: 'Interview Preparation Guide', type: 'PDF', size: '4.5 MB', link: '#' },
    ]},
    { category: 'Video Lectures', items: [
      { name: 'CN Complete Course - Prof. Shamila', type: 'Video', size: '2.1 GB', link: '#' },
      { name: 'DBMS Tutorial Series', type: 'Video', size: '1.5 GB', link: '#' },
      { name: 'Web Development Workshop', type: 'Video', size: '890 MB', link: '#' },
    ]},
  ]

  // Exam schedule data
  const examSchedule = [
    { course: 'Computer Networks', code: 'GR22A3044', date: '2025-02-15', time: '09:00 AM - 12:00 PM', venue: 'Hall A, Block 3', type: 'Mid-term' },
    { course: 'Data Warehousing and Data Mining', code: 'GR22A3069', date: '2025-02-17', time: '09:00 AM - 12:00 PM', venue: 'Hall B, Block 3', type: 'Mid-term' },
    { course: 'Artificial Intelligence', code: 'GR22A3070', date: '2025-02-19', time: '09:00 AM - 12:00 PM', venue: 'Hall A, Block 3', type: 'Mid-term' },
    { course: 'Professional Elective I', code: 'PE-I', date: '2025-02-21', time: '02:00 PM - 5:00 PM', venue: 'Hall C, Block 3', type: 'Mid-term' },
    { course: 'Open Elective I', code: 'OE-I', date: '2025-02-22', time: '09:00 AM - 12:00 PM', venue: 'Hall A, Block 2', type: 'Mid-term' },
  ]

  const answerKeys = [
    { exam: 'WT Mid-1 Answer Key', subject: 'Full Stack Web Development', date: '2025-02-10', link: '#' },
    { exam: 'CN Quiz Solutions', subject: 'Computer Networks', date: '2025-02-08', link: '#' },
    { exam: 'DBMS Mid-1 Solutions', subject: 'Database Management Systems', date: '2025-01-28', link: '#' },
    { exam: 'OS Assignment Solutions', subject: 'Operating Systems', date: '2025-01-25', link: '#' },
  ]

  const gradesData = [
    { subject: 'Computer Networks', code: 'GR22A3044', internal: 28, external: 45, total: 73, grade: 'A', credits: 3 },
    { subject: 'Data Warehousing and Data Mining', code: 'GR22A3069', internal: 26, external: 48, total: 74, grade: 'A', credits: 3 },
    { subject: 'Artificial Intelligence', code: 'GR22A3070', internal: 30, external: 50, total: 80, grade: 'S', credits: 3 },
    { subject: 'Professional Elective I', code: 'PE-I', internal: 25, external: 44, total: 69, grade: 'B+', credits: 3 },
    { subject: 'Open Elective I', code: 'OE-I', internal: 29, external: 47, total: 76, grade: 'A+', credits: 3 },
  ]

  // GRIET data
  const grietGuidelines = [
    { title: 'Project Submission Guidelines', description: 'All GRIET projects must follow the standard format. Include project proposal, technical documentation, and presentation slides.', date: '2025-01-15' },
    { title: 'IPR Filing Process', description: 'Steps to file for Intellectual Property Rights for your innovations. Contact GRIET office for assistance.', date: '2025-01-10' },
    { title: 'Startup Recognition', description: 'Criteria and process for getting your startup recognized by the institution. Minimum 3 months of operation required.', date: '2025-01-05' },
    { title: 'Innovation Competition Rules', description: 'Guidelines for participating in institutional innovation competitions. Registration deadline: Feb 15, 2025.', date: '2024-12-20' },
  ]

  const grietNews = [
    { title: 'GRIET Ideathon 2025', description: 'Join us for the biggest ideathon event on 3rd February. Cash prizes worth ₹50,000!', date: '2025-02-03', category: 'Event' },
    { title: 'Guest Talk: Startup Funding Basics', description: 'Learn from industry experts about raising funds for your startup. Venue: Auditorium, 12th Feb, 3 PM.', date: '2025-02-12', category: 'Workshop' },
    { title: 'Innovation Grant Recipients', description: 'Congratulations to 5 student teams who received innovation grants this quarter!', date: '2025-01-28', category: 'Achievement' },
    { title: 'Patent Filing Success', description: '3 GRIET student innovations have been filed for patents this semester.', date: '2025-01-22', category: 'Achievement' },
    { title: 'Startup Incubation Program', description: 'Applications open for the startup incubation program. Deadline: Feb 20, 2025.', date: '2025-02-01', category: 'Opportunity' },
  ]

  const internships = [
    { company: 'Google India', role: 'Software Engineering Intern', deadline: '2025-02-15', status: 'Open', type: 'Internship' },
    { company: 'Microsoft', role: 'Cloud Solutions Intern', deadline: '2025-02-20', status: 'Open', type: 'Internship' },
    { company: 'Amazon', role: 'Machine Learning Intern', deadline: '2025-02-25', status: 'Open', type: 'Internship' },
    { company: 'TCS', role: 'Software Developer', deadline: '2025-03-01', status: 'Open', type: 'Placement' },
    { company: 'Infosys', role: 'Full Stack Developer', deadline: '2025-03-05', status: 'Open', type: 'Placement' },
    { company: 'Wipro', role: 'Data Engineer', deadline: '2025-03-10', status: 'Open', type: 'Placement' },
  ]

  // Auto-expand Academics section when on a subtab
  useEffect(() => {
    if (activePage === 'courses' || activePage === 'attendance' || activePage === 'assignments' || activePage === 'resources' || activePage === 'feedback') {
      setIsAcademicsOpen(true)
    }
  }, [activePage])

  // Auto-expand GRIET section when on a subtab
  useEffect(() => {
    if (activePage === 'griet-guidelines' || activePage === 'griet-news' || activePage === 'griet-internships' || activePage === 'griet-resume') {
      setIsGRIETOpen(true)
    }
  }, [activePage])

  // Auto-expand Exams section when on a subtab
  useEffect(() => {
    if (activePage === 'exams-schedule' || activePage === 'exams-answer-keys' || activePage === 'exams-grades-and-marks') {
      setIsExamsOpen(true)
    }
  }, [activePage])

  // Auto-expand Help Desk section when on a subtab
  useEffect(() => {
    if (activePage === 'helpdesk-dayscholar' || activePage === 'helpdesk-hostler') {
      setIsHelpDeskOpen(true)
    }
  }, [activePage])

  // Search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    const query = searchQuery.toLowerCase().trim()
    
    // Search mappings - keywords to page routes
    const searchMappings: Record<string, typeof activePage> = {
      // Dashboard related
      'dashboard': 'dashboard',
      'home': 'dashboard',
      'main': 'dashboard',
      
      // Academics section
      'courses': 'courses',
      'course': 'courses',
      'subject': 'courses',
      'subjects': 'courses',
      'class': 'courses',
      'classes': 'courses',
      
      'attendance': 'attendance',
      'present': 'attendance',
      'absent': 'attendance',
      
      'assignments': 'assignments',
      'assignment': 'assignments',
      'homework': 'assignments',
      'project': 'assignments',
      
      'resources': 'resources',
      'resource': 'resources',
      'material': 'resources',
      'materials': 'resources',
      'textbook': 'resources',
      'notes': 'resources',
      'lecture': 'resources',
      
      'feedback': 'feedback',
      'review': 'feedback',
      'rating': 'feedback',
      
      // Exams section
      'exams': 'exams-schedule',
      'exam': 'exams-schedule',
      'schedule': 'exams-schedule',
      'exam schedule': 'exams-schedule',
      'answer key': 'exams-answer-keys',
      'answer keys': 'exams-answer-keys',
      'answers': 'exams-answer-keys',
      'solutions': 'exams-answer-keys',
      'grades': 'exams-grades-and-marks',
      'grade': 'exams-grades-and-marks',
      'marks': 'exams-grades-and-marks',
      'mark': 'exams-grades-and-marks',
      'cgpa': 'exams-grades-and-marks',
      'sgpa': 'exams-grades-and-marks',
      'results': 'exams-grades-and-marks',
      
      // Notices
      'notices': 'notices',
      'notice': 'notices',
      'announcement': 'notices',
      'announcements': 'notices',
      
      // GRIET section
      'griet': 'griet-guidelines',
      'guidelines': 'griet-guidelines',
      'guideline': 'griet-guidelines',
      'rules': 'griet-guidelines',
      'policy': 'griet-guidelines',
      'news': 'griet-news',
      'events': 'griet-news',
      'event': 'griet-news',
      'internship': 'griet-internships',
      'internships': 'griet-internships',
      'placement': 'griet-internships',
      'placements': 'griet-internships',
      'job': 'griet-internships',
      'jobs': 'griet-internships',
      'resume': 'griet-resume',
      'cv': 'griet-resume',
      'resume upload': 'griet-resume',
      
      // Help Desk
      'help': 'helpdesk-dayscholar',
      'support': 'helpdesk-dayscholar',
      'helpdesk': 'helpdesk-dayscholar',
      'day scholar': 'helpdesk-dayscholar',
      'dayscholar': 'helpdesk-dayscholar',
      'hostel': 'helpdesk-hostler',
      'hostler': 'helpdesk-hostler',
      'hostel help': 'helpdesk-hostler',
      
      // Profile and Settings
      'profile': 'profile',
      'my info': 'profile',
      'info': 'profile',
      'personal': 'profile',
      'settings': 'settings',
      'setting': 'settings',
      'preferences': 'settings',
      'config': 'settings',
      'account': 'settings',
    }

    // Direct match
    if (searchMappings[query]) {
      const targetPage = searchMappings[query]
      setActivePage(targetPage)
      setSearchQuery('')
      return
    }

    // Partial match - find the first keyword that matches
    for (const [keyword, page] of Object.entries(searchMappings)) {
      if (query.includes(keyword) || keyword.includes(query)) {
        setActivePage(page)
        setSearchQuery('')
        return
      }
    }

    // If no match found, show a message or do nothing
    // For better UX, we could show a toast notification
    console.log('No matching page found for:', query)
  }


  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div className="header-inner">
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              type="button"
            >
              <span className="hamburger-icon">☰</span>
            </button>
            <div className="header-logos">
              <img src="/grietlogo.png" alt="GRIET Logo" className="griet-logo" />
              <img src="/accredition.png" alt="Accreditations" className="accredition-logo" />
            </div>
          </div>
          <div className="student-info">
            <h2>Student Portal</h2>
            <p>Welcome to your dashboard</p>
          </div>
          <div className="header-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="search-btn" 
              onClick={handleSearch}
              type="button"
            >
              🔍
            </button>
          </div>
        </div>
      </header>

      <div className={`student-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <aside className="student-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActivePage('dashboard')}
              type="button"
            >
              Dashboard
            </button>
            
            <div className={`nav-section ${isAcademicsOpen ? 'open' : ''}`}>
              <button
                className={`nav-link nav-section-header ${isAcademicsOpen ? 'open' : ''}`}
                onClick={() => setIsAcademicsOpen(!isAcademicsOpen)}
                type="button"
              >
                <span>Academics</span>
                {isInAcademics && (
                <span className="nav-section-icon">{isAcademicsOpen ? '▼' : '▶'}</span>
                )}
              </button>
              {isAcademicsOpen && (
                <div className="nav-section-sublinks">
                  <button
                    className={`nav-link nav-sublink ${activePage === 'courses' ? 'active' : ''}`}
                    onClick={() => {
                      setActivePage('courses')
                      setIsAcademicsOpen(true)
                    }}
                    type="button"
                  >
                    Courses
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'attendance' ? 'active' : ''}`}
                    onClick={() => {
                      setActivePage('attendance')
                      setIsAcademicsOpen(true)
                    }}
                    type="button"
                  >
                    Attendance
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'assignments' ? 'active' : ''}`}
                    onClick={() => {
                      setActivePage('assignments')
                      setIsAcademicsOpen(true)
                    }}
                    type="button"
                  >
                    Assignments
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'resources' ? 'active' : ''}`}
                    onClick={() => {
                      setActivePage('resources')
                      setIsAcademicsOpen(true)
                    }}
                    type="button"
                  >
                    Resources
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'feedback' ? 'active' : ''}`}
                    onClick={() => {
                      setActivePage('feedback')
                      setIsAcademicsOpen(true)
                    }}
                    type="button"
                  >
                    Feedback
                  </button>
                </div>
              )}
            </div>

            

            <div className={`nav-section ${isExamsOpen ? 'open' : ''}`}>
              <button
                className={`nav-link nav-section-header ${isExamsOpen ? 'open' : ''}`}
                onClick={() => setIsExamsOpen(!isExamsOpen)}
                type="button"
              >
                <span>Exams</span>
                {isInExams && (
                <span className="nav-section-icon">{isExamsOpen ? '▼' : '▶'}</span>
                )}
              </button>
              {isExamsOpen && (
                <div className="nav-section-sublinks">
                  <button
                    className={`nav-link nav-sublink ${activePage === 'exams-schedule' ? 'active' : ''}`}
                    onClick={() => setActivePage('exams-schedule')}
                    type="button"
                  >
                    Exam Schedule
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'exams-answer-keys' ? 'active' : ''}`}
                    onClick={() => setActivePage('exams-answer-keys')}
                    type="button"
                  >
                    Answer Keys
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'exams-grades-and-marks' ? 'active' : ''}`}
                    onClick={() => setActivePage('exams-grades-and-marks')}
                    type="button"
                  >
                    Grades and Marks
                  </button>
                </div>
              )}
            </div>

            <button
              className={`nav-link ${activePage === 'notices' ? 'active' : ''}`}
              onClick={() => setActivePage('notices')}
              type="button"
            >
              Notices
            </button>

            <div className={`nav-section ${isGRIETOpen ? 'open' : ''}`}>
              <button
                className={`nav-link nav-section-header ${isGRIETOpen ? 'open' : ''}`}
                onClick={() => setIsGRIETOpen(!isGRIETOpen)}
                type="button"
              >
                <span>GRIET</span>
                {isInGRIET && (
                <span className="nav-section-icon">{isGRIETOpen ? '▼' : '▶'}</span>
                )}
              </button>
              {isGRIETOpen && (
                <div className="nav-section-sublinks">
                  <button
                    className={`nav-link nav-sublink ${activePage === 'griet-guidelines' ? 'active' : ''}`}
                    onClick={() => setActivePage('griet-guidelines')}
                    type="button"
                  >
                    Guidelines
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'griet-news' ? 'active' : ''}`}
                    onClick={() => setActivePage('griet-news')}
                    type="button"
                  >
                    News & Events
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'griet-internships' ? 'active' : ''}`}
                    onClick={() => setActivePage('griet-internships')}
                    type="button"
                  >
                    Internship & Placements
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'griet-resume' ? 'active' : ''}`}
                    onClick={() => setActivePage('griet-resume')}
                    type="button"
                  >
                    Resume
                  </button>
                </div>
              )}
            </div>

            <div className={`nav-section ${isHelpDeskOpen ? 'open' : ''}`}>
              <button
                className={`nav-link nav-section-header ${isHelpDeskOpen ? 'open' : ''}`}
                onClick={() => setIsHelpDeskOpen(!isHelpDeskOpen)}
                type="button"
              >
                <span>Help Desk</span>
                {isInHelpDesk && (
                <span className="nav-section-icon">{isHelpDeskOpen ? '▼' : '▶'}</span>
                )}
              </button>
              {isHelpDeskOpen && (
                <div className="nav-section-sublinks">
                  <button
                    className={`nav-link nav-sublink ${activePage === 'helpdesk-dayscholar' ? 'active' : ''}`}
                    onClick={() => {
                      setActivePage('helpdesk-dayscholar')
                      setIsHelpDeskOpen(true)
                    }}
                    type="button"
                  >
                    Day Scholar
                  </button>
                  <button
                    className={`nav-link nav-sublink ${activePage === 'helpdesk-hostler' ? 'active' : ''}`}
                    onClick={() => {
                      setActivePage('helpdesk-hostler')
                      setIsHelpDeskOpen(true)
                    }}
                    type="button"
                  >
                    Hostler
                  </button>
                </div>
              )}
            </div>

            <button
              className={`nav-link ${activePage === 'profile' ? 'active' : ''}`}
              onClick={() => setActivePage('profile')}
              type="button"
            >
              My Info
            </button>

            <button
              className={`nav-link ${activePage === 'settings' ? 'active' : ''}`}
              onClick={() => setActivePage('settings')}
              type="button"
            >
              Settings
            </button>
            <button
              className="nav-link logout"
              onClick={handleLogout}
              type="button"
            >
              🚪 Logout
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {activePage === 'dashboard' && (
        <section className="attendance-section">
          <div className="attendance-controls">
            <div className="welcome-text">Welcome back, <strong>{studentName}</strong></div>
            <label className="semester-filter">
              <span>Attendance:</span>
              <select
                className="semester-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value, 10))}
              >
                <option value={1}>Sem 1</option>
                <option value={2}>Sem 2</option>
                <option value={3}>Sem 3</option>
                <option value={4}>Sem 4</option>
                <option value={5}>Sem 5</option>
              </select>
            </label>
          </div>
          <div className="attendance-header">
            <h3>Attendance Overview</h3>
            <button 
              className="details-btn" 
              type="button"
              onClick={() => {
                setActivePage('attendance')
                setIsAcademicsOpen(true)
              }}
            >
              Detailed View
            </button>
          </div>
          <div className="attendance-chart-container">
            <div className="attendance-chart">
            {attendance.map((sub) => (
                <div key={sub.subject} className="chart-bar-wrapper">
                  <div className="chart-label">{sub.subject}</div>
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ height: `${sub.percentage}%` }}
                      title={`${sub.percentage}% (${sub.present}/${sub.total})`}
                    >
                      <span className="chart-percentage">{sub.percentage}%</span>
                  </div>
                  </div>
                  <div className="chart-details">
                    <span className="chart-present">{sub.present}/{sub.total}</span>
                  </div>
                </div>
              ))}
                </div>
          </div>
        </section>
          )}

          {activePage === 'dashboard' && (
        <section className="timetable-section">
          <h3>Class Timetable</h3>
          <div className="timetable-wrapper">
            <div className="timetable-tabs">
              {days.map((day) => (
                <button
                  key={day.key}
                  className={`timetable-tab ${activeDay === day.key ? 'active' : ''}`}
                  onClick={() => setActiveDay(day.key)}
                  type="button"
                >
                  {day.label}
                </button>
              ))}
            </div>
            <table className="timetable">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Room</th>
                  <th>Faculty</th>
                </tr>
              </thead>
              <tbody>
                {timetable?.map((slot, idx) => {
                  const subject = slot[activeDay]
                  const isBreak = subject === 'Break'
                  return (
                    <tr key={idx}>
                      <td className="time-cell">{slot.time}</td>
                      <td>{subject}</td>
                      <td>{isBreak ? '-' : getRoom(subject)}</td>
                      <td>{isBreak ? '-' : getFaculty(subject)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
          )}

          {activePage === 'courses' && (
        <section className="courses-section">
          <div className="courses-header">
            <h3>My Courses</h3>
            <label className="semester-filter">
              <span>Semester:</span>
              <select
                className="semester-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value, 10))}
              >
                <option value={1}>Sem 1</option>
                <option value={2}>Sem 2</option>
                <option value={3}>Sem 3</option>
                <option value={4}>Sem 4</option>
                <option value={5}>Sem 5</option>
              </select>
            </label>
          </div>
          <div className="courses-grid">
            {courses.map((course, index) => (
              <div key={index} className="course-card">
                <h4>{course.courseName}</h4>
                <div className="course-info">
                  <p><strong>Code:</strong> {course.code}</p>
                  <p><strong>Professor:</strong> {course.professor}</p>
                  <p><strong>Credits:</strong> {course.credits}</p>
                  <div className="course-link">
                    <a 
                      href={course.googleClassroom} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="classroom-link"
                    >
                      📚 Google Classroom
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
          )}

          {activePage === 'attendance' && (
        <section className="attendance-section">
          <div className="attendance-details-header">
            <h3>Attendance Details</h3>
            <label className="semester-filter">
              <span>Semester:</span>
              <select
                className="semester-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value, 10))}
              >
                <option value={1}>Sem 1</option>
                <option value={2}>Sem 2</option>
                <option value={3}>Sem 3</option>
                <option value={4}>Sem 4</option>
                <option value={5}>Sem 5</option>
              </select>
            </label>
          </div>
          
          {/* Summary Statistics */}
          {(() => {
            const totalClasses = attendance.reduce((sum, sub) => sum + sub.total, 0)
            const totalPresent = attendance.reduce((sum, sub) => sum + sub.present, 0)
            const totalAbsent = attendance.reduce((sum, sub) => sum + sub.absent, 0)
            const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0
            const avgPercentage = Math.round(attendance.reduce((sum, sub) => sum + sub.percentage, 0) / attendance.length)
            
            return (
              <div className="attendance-summary">
                <div className="summary-card">
                  <div className="summary-label">Total Classes</div>
                  <div className="summary-value">{totalClasses}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Present</div>
                  <div className="summary-value present">{totalPresent}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Absent</div>
                  <div className="summary-value absent">{totalAbsent}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Overall Attendance</div>
                  <div className="summary-value percentage">{overallPercentage}%</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Average Percentage</div>
                  <div className="summary-value percentage">{avgPercentage}%</div>
                </div>
              </div>
            )
          })()}

          <div className="attendance-chart-container">
            <div className="attendance-chart">
              {attendance.map((sub) => (
                <div key={sub.subject} className="chart-bar-wrapper">
                  <div className="chart-label">{sub.subject}</div>
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ height: `${sub.percentage}%` }}
                      title={`${sub.percentage}% (${sub.present}/${sub.total})`}
                    >
                      <span className="chart-percentage">{sub.percentage}%</span>
                    </div>
                  </div>
                  <div className="chart-details">
                    <span className="chart-present">{sub.present}/{sub.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Table */}
          <div className="attendance-table-container">
            <h4>Subject-wise Detailed Attendance</h4>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Total Classes</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Deficit to 75%</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((sub) => {
                  const deficit = Math.max(0, Math.ceil((sub.total * 0.75) - sub.present))
                  const status = sub.percentage >= 75 ? 'Safe' : sub.percentage >= 65 ? 'Warning' : 'Risk'
                  const statusClass = status.toLowerCase()
                  
                  return (
                    <tr key={sub.subject}>
                      <td className="subject-name">{sub.subject}</td>
                      <td>{sub.total}</td>
                      <td className="present-cell">{sub.present}</td>
                      <td className="absent-cell">{sub.absent}</td>
                      <td>
                        <div className="percentage-cell">
                          <span className={`percentage-value ${statusClass}`}>{sub.percentage}%</span>
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${statusClass}`}
                              style={{ width: `${sub.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>{status}</span>
                      </td>
                      <td className={deficit > 0 ? 'deficit-cell' : 'no-deficit'}>
                        {deficit > 0 ? `${deficit} classes` : 'Met'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
          )}

          {activePage === 'assignments' && (
        <section className="assignments-section">
          <h3>Assignments</h3>
          <div className="assignments-list">
            <div className="assignment-card">
              <div className="assignment-header">
                <h4>CN Assignment 1</h4>
                <span className="assignment-status pending">Pending</span>
              </div>
              <p><strong>Subject:</strong> Computer Networks</p>
              <p><strong>Due Date:</strong> 2025-01-25</p>
              <p><strong>Description:</strong> Implement routing algorithms</p>
            </div>
            <div className="assignment-card">
              <div className="assignment-header">
                <h4>DBMS Project</h4>
                <span className="assignment-status submitted">Submitted</span>
              </div>
              <p><strong>Subject:</strong> Database Management</p>
              <p><strong>Due Date:</strong> 2025-01-20</p>
              <p><strong>Description:</strong> Design a database for library management</p>
            </div>
            <div className="assignment-card">
              <div className="assignment-header">
                <h4>WT Lab Exercise</h4>
                <span className="assignment-status pending">Pending</span>
              </div>
              <p><strong>Subject:</strong> Web Technologies</p>
              <p><strong>Due Date:</strong> 2025-01-28</p>
              <p><strong>Description:</strong> Create a responsive web page</p>
            </div>
          </div>
        </section>
          )}

          {activePage === 'exams-schedule' && (
        <section className="exams-section">
          <h3>Exam Schedule</h3>
          <div className="exams-table-container">
            <table className="exams-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Code</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {examSchedule.map((exam, idx) => (
                  <tr key={idx}>
                    <td className="course-name">{exam.course}</td>
                    <td>{exam.code}</td>
                    <td>{exam.date}</td>
                    <td>{exam.time}</td>
                    <td>{exam.venue}</td>
                    <td><span className="exam-type-badge">{exam.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
          )}

          {activePage === 'exams-answer-keys' && (
        <section className="exams-section">
          <h3>Answer Keys</h3>
          <div className="answer-keys-grid">
            {answerKeys.map((key, idx) => (
              <div key={idx} className="answer-key-card">
                <div className="answer-key-header">
                  <h4>{key.exam}</h4>
                  <span className="key-date">{key.date}</span>
                </div>
                <p className="key-subject">{key.subject}</p>
                <a href={key.link} className="download-link">📥 Download Answer Key</a>
              </div>
            ))}
          </div>
        </section>
          )}

          {activePage === 'exams-grades-and-marks' && (
        <section className="exams-section">
          <h3>Grades and Marks</h3>
          <div className="grades-summary">
            <div className="summary-card">
              <div className="summary-label">Current SGPA</div>
              <div className="summary-value">8.3</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Overall CGPA</div>
              <div className="summary-value">8.5</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Credits Completed</div>
              <div className="summary-value">117</div>
            </div>
          </div>
          <div className="grades-table-container">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Internal</th>
                  <th>External</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Credits</th>
                </tr>
              </thead>
              <tbody>
                {gradesData.map((grade, idx) => (
                  <tr key={idx}>
                    <td className="subject-name">{grade.subject}</td>
                    <td>{grade.code}</td>
                    <td>{grade.internal}</td>
                    <td>{grade.external}</td>
                    <td className="total-marks">{grade.total}</td>
                    <td><span className={`grade-badge grade-${grade.grade.toLowerCase().replace('+', 'plus')}`}>{grade.grade}</span></td>
                    <td>{grade.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
          )}

          {activePage === 'resources' && (
        <section className="resources-section">
          <h3>Academic Resources</h3>
          <div className="resources-grid">
            {resources.map((category, idx) => (
              <div key={idx} className="resource-category-card">
                <h4>{category.category}</h4>
                <div className="resource-items">
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="resource-item">
                      <div className="resource-info">
                        <span className="resource-name">{item.name}</span>
                        <div className="resource-meta">
                          <span className="resource-type">{item.type}</span>
                          <span className="resource-size">{item.size}</span>
                        </div>
                      </div>
                      <a href={item.link} className="resource-download">⬇</a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
          )}

          {activePage === 'feedback' && (
        <section className="feedback-section">
          <div className="feedback-header">
            <h3>Submit Course Feedback</h3>
            <label className="semester-filter">
              <span>Semester:</span>
              <select
                className="semester-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value, 10))}
              >
                <option value={1}>Sem 1</option>
                <option value={2}>Sem 2</option>
                <option value={3}>Sem 3</option>
                <option value={4}>Sem 4</option>
                <option value={5}>Sem 5</option>
              </select>
            </label>
          </div>

          {!feedbackSubmitted ? (
            <form
              className="feedback-form"
              onSubmit={(e) => {
                e.preventDefault()
                setFeedbackSubmitted(true)
              }}
            >
              <div className="form-row">
                <label className="form-field">
                  <span>Course</span>
                  <select
                    required
                    value={feedbackCourseCode}
                    onChange={(e) => setFeedbackCourseCode(e.target.value)}
                  >
                    <option value="" disabled>Select a course</option>
                    {(courses || []).map((c) => (
                      <option key={c.code} value={c.code}>{c.courseName} ({c.code})</option>
                    ))}
                  </select>
                </label>
                <label className="form-field checkbox">
                  <input
                    type="checkbox"
                    checked={feedbackAnonymous}
                    onChange={(e) => setFeedbackAnonymous(e.target.checked)}
                  />
                  <span>Submit anonymously</span>
                </label>
              </div>

              <div className="ratings-grid">
                <div className="rating-item">
                  <label>Teaching Quality</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={feedbackRatings.teaching}
                    onChange={(e) => setFeedbackRatings({ ...feedbackRatings, teaching: parseInt(e.target.value, 10) })}
                  />
                  <span className="rating-value">{feedbackRatings.teaching}/10</span>
                </div>
                <div className="rating-item">
                  <label>Course Materials</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={feedbackRatings.materials}
                    onChange={(e) => setFeedbackRatings({ ...feedbackRatings, materials: parseInt(e.target.value, 10) })}
                  />
                  <span className="rating-value">{feedbackRatings.materials}/10</span>
                </div>
                <div className="rating-item">
                  <label>Assessment Fairness</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={feedbackRatings.assessment}
                    onChange={(e) => setFeedbackRatings({ ...feedbackRatings, assessment: parseInt(e.target.value, 10) })}
                  />
                  <span className="rating-value">{feedbackRatings.assessment}/10</span>
                </div>
                <div className="rating-item">
                  <label>Overall</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={feedbackRatings.overall}
                    onChange={(e) => setFeedbackRatings({ ...feedbackRatings, overall: parseInt(e.target.value, 10) })}
                  />
                  <span className="rating-value">{feedbackRatings.overall}/10</span>
                </div>
              </div>

              <label className="form-field full">
                <span>Comments</span>
                <textarea
                  rows={5}
                  placeholder="Share specific feedback, suggestions, or concerns..."
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                />
              </label>

              <div className="form-actions">
                <button className="btn-secondary" type="button" onClick={() => {
                  setFeedbackCourseCode('')
                  setFeedbackAnonymous(false)
                  setFeedbackRatings({ teaching: 5, materials: 5, assessment: 5, overall: 5 })
                  setFeedbackComments('')
                }}>Clear</button>
                <button className="btn-primary" type="submit">Submit Feedback</button>
              </div>
            </form>
          ) : (
            <div className="feedback-success">
              <h4>Thank you!</h4>
              <p>Your feedback has been recorded. We appreciate your time.</p>
              <button
                className="btn-primary"
                type="button"
                onClick={() => {
                  setFeedbackCourseCode('')
                  setFeedbackAnonymous(false)
                  setFeedbackRatings({ teaching: 5, materials: 5, assessment: 5, overall: 5 })
                  setFeedbackComments('')
                  setFeedbackSubmitted(false)
                }}
              >
                Submit another response
              </button>
            </div>
          )}
        </section>
          )}

          {activePage === 'griet-guidelines' && (
        <section className="iic-section griet-section">
          <h3>GRIET Guidelines</h3>
          <div className="guidelines-grid">
            {grietGuidelines.map((guideline, idx) => (
              <div key={idx} className="guideline-card">
                <h4>{guideline.title}</h4>
                <p>{guideline.description}</p>
                <span className="guideline-date">Updated: {guideline.date}</span>
              </div>
            ))}
          </div>
        </section>
          )}

          {activePage === 'griet-news' && (
        <section className="iic-section griet-section">
          <h3>GRIET News & Events</h3>
          <div className="news-grid">
            {grietNews.map((news, idx) => (
              <div key={idx} className="news-card">
                <div className="news-header">
                  <span className="news-category">{news.category}</span>
                  <span className="news-date">{news.date}</span>
                </div>
                <h4>{news.title}</h4>
                <p>{news.description}</p>
              </div>
            ))}
          </div>
        </section>
          )}

          {activePage === 'griet-internships' && (
        <section className="iic-section griet-section">
          <h3>Internship & Placements</h3>
          <div className="internships-grid">
            {internships.map((internship, idx) => (
              <div key={idx} className="internship-card">
                <div className="internship-header">
                  <h4>{internship.company}</h4>
                  <span className={`internship-type ${internship.type.toLowerCase()}`}>{internship.type}</span>
                </div>
                <p className="internship-role">{internship.role}</p>
                <div className="internship-footer">
                  <span className="deadline">Deadline: {internship.deadline}</span>
                  <span className={`status ${internship.status.toLowerCase()}`}>{internship.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
          )}

          {activePage === 'griet-resume' && (
        <section className="iic-section griet-section">
          <h3>Resume & Profile</h3>
          <div className="resume-container">
            <div className="resume-upload-card">
              <h4>Upload Resume</h4>
              <input type="file" accept=".pdf,.doc,.docx" className="file-input" />
              <button className="btn-primary">Upload Resume</button>
            </div>
            <div className="atc-checker-card">
              <h4>AtCoder Profile Checker</h4>
              <p>Check your AtCoder competitive programming profile</p>
              <div className="atc-input-group">
                <input
                  type="text"
                  placeholder="Enter AtCoder Handle"
                  value={atcHandle}
                  onChange={(e) => setAtcHandle(e.target.value)}
                  className="atc-input"
                />
                <button
                  onClick={handleCheckAtc}
                  disabled={isLoadingAtc || !atcHandle.trim()}
                  className="btn-primary"
                >
                  {isLoadingAtc ? 'Checking...' : 'Check Profile'}
                </button>
              </div>
              {atcResult && (
                <div className="atc-result">
                  <h5>Profile: {atcResult.handle}</h5>
                  <div className="atc-stats">
                    <div className="atc-stat">
                      <span className="stat-label">Rating</span>
                      <span className="stat-value" style={{ color: getRatingColor(atcResult.color) }}>{atcResult.rating}</span>
                    </div>
                    <div className="atc-stat">
                      <span className="stat-label">Rank</span>
                      <span className="stat-value">#{atcResult.rank}</span>
                    </div>
                    <div className="atc-stat">
                      <span className="stat-label">Problems Solved</span>
                      <span className="stat-value">{atcResult.solved}</span>
                    </div>
                    <div className="atc-stat">
                      <span className="stat-label">Color</span>
                      <span className="stat-value">{atcResult.color}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
          )}

          {activePage === 'helpdesk-dayscholar' && (
        <section className="helpdesk-section">
          <h3>Help Desk - Day Scholar</h3>
          <div className="helpdesk-container">
            <div className="helpdesk-info-card">
              <h4>Contact Information</h4>
              <p><strong>Email:</strong> dayscholar-support@griet.edu</p>
              <p><strong>Phone:</strong> +91-40-1234-5678</p>
              <p><strong>Office Hours:</strong> 9:00 AM - 5:00 PM</p>
              <p>For day scholar students support and queries.</p>
            </div>
            <div className="chatbot-card">
              <h4>AI Assistant Chatbot</h4>
              <div className="chatbot-container">
                <div className="chat-messages">
                  {chatMessages.length === 0 && (
                    <div className="chat-welcome">
                      <p>👋 Hi! I'm your AI assistant powered by Gemini 2.5 Flash. How can I help you today?</p>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.role}`}>
                      <div className="message-content">{msg.content}</div>
                    </div>
                  ))}
                  {isLoadingChat && (
                    <div className="chat-message assistant">
                      <div className="message-content">Thinking...</div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input-container">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="chat-input"
                    disabled={isLoadingChat}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoadingChat || !chatInput.trim()}
                    className="chat-send-btn"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
          )}

          {activePage === 'helpdesk-hostler' && (
        <section className="helpdesk-section">
          <h3>Help Desk - Hostler</h3>
          <div className="helpdesk-container">
            <div className="helpdesk-info-card">
              <h4>Contact Information</h4>
              <p><strong>Email:</strong> hostel-support@griet.edu</p>
              <p><strong>Phone:</strong> +91-40-1234-5679</p>
              <p><strong>Office Hours:</strong> 9:00 AM - 6:00 PM</p>
              <p>For hostel students support and queries.</p>
            </div>
            <div className="chatbot-card">
              <h4>AI Assistant Chatbot</h4>
              <div className="chatbot-container">
                <div className="chat-messages">
                  {chatMessages.length === 0 && (
                    <div className="chat-welcome">
                      <p>👋 Hi! I'm your AI assistant powered by Gemini 2.5 Flash. How can I help you today?</p>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.role}`}>
                      <div className="message-content">{msg.content}</div>
                    </div>
                  ))}
                  {isLoadingChat && (
                    <div className="chat-message assistant">
                      <div className="message-content">Thinking...</div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input-container">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="chat-input"
                    disabled={isLoadingChat}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoadingChat || !chatInput.trim()}
                    className="chat-send-btn"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
          )}

          {activePage === 'settings' && (
        <section className="settings-section">
          <div className="settings-header">
          <h3>Settings</h3>
            <p className="settings-subtitle">Manage your preferences and account settings</p>
          </div>

          <div className="settings-grid">
            {/* Notifications Section */}
            <div className="settings-group-card">
              <div className="settings-group-header">
                <span className="settings-icon">🔔</span>
                <div>
                  <h4>Notifications</h4>
                  <p>Control how you receive updates and alerts</p>
                </div>
              </div>
              <div className="settings-options">
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Email Notifications</span>
                    <span className="setting-desc">Receive notifications via email</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Push Notifications</span>
                    <span className="setting-desc">Browser push notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.push}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, push: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Assignment Reminders</span>
                    <span className="setting-desc">Get reminded about upcoming assignments</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.assignmentReminders}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, assignmentReminders: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Exam Alerts</span>
                    <span className="setting-desc">Alerts for upcoming exams</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.examAlerts}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, examAlerts: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Announcements</span>
                    <span className="setting-desc">Notify about new announcements</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.announcements}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, announcements: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="settings-group-card">
              <div className="settings-group-header">
                <span className="settings-icon">🎨</span>
                <div>
                  <h4>Appearance</h4>
                  <p>Customize the look and feel</p>
                </div>
              </div>
              <div className="settings-options">
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Dark Mode</span>
                    <span className="setting-desc">Switch to dark theme</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.appearance.darkMode}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, darkMode: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Compact View</span>
                    <span className="setting-desc">Reduce spacing for more content</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.appearance.compactView}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, compactView: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Language</span>
                    <span className="setting-desc">Select your preferred language</span>
                  </div>
                  <select 
                    className="setting-select"
                    value={settings.appearance.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, language: e.target.value }
                    })}
                  >
                    <option value="en">English</option>
                    <option value="zh">Chinese</option>
                    <option value="hi">हिन्दी</option>
                    <option value="te">తెలుగు</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="settings-group-card">
              <div className="settings-group-header">
                <span className="settings-icon">🔒</span>
                <div>
                  <h4>Privacy</h4>
                  <p>Manage your privacy settings</p>
                </div>
              </div>
              <div className="settings-options">
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Profile Visibility</span>
                    <span className="setting-desc">Who can view your profile</span>
                  </div>
                  <select 
                    className="setting-select"
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, profileVisibility: e.target.value }
                    })}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Show Email</span>
                    <span className="setting-desc">Show email on your profile</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.privacy.showEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showEmail: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Show Phone Number</span>
                    <span className="setting-desc">Show phone number on profile</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.privacy.showPhone}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showPhone: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="settings-group-card">
              <div className="settings-group-header">
                <span className="settings-icon">⚙️</span>
                <div>
                  <h4>Account & Security</h4>
                  <p>Security and session settings</p>
                </div>
              </div>
              <div className="settings-options">
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Two-Factor Authentication</span>
                    <span className="setting-desc">Add an extra layer of security</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.account.twoFactorAuth}
                      onChange={(e) => setSettings({
                        ...settings,
                        account: { ...settings.account, twoFactorAuth: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Auto Logout</span>
                    <span className="setting-desc">Automatically log out when inactive</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.account.autoLogout}
                      onChange={(e) => setSettings({
                        ...settings,
                        account: { ...settings.account, autoLogout: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Session Timeout</span>
                    <span className="setting-desc">Auto-logout after inactivity (minutes)</span>
                  </div>
                  <select 
                    className="setting-select"
                    value={settings.account.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      account: { ...settings.account, sessionTimeout: e.target.value }
                    })}
                    disabled={!settings.account.autoLogout}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button className="settings-btn settings-btn-primary">Save Changes</button>
            <button className="settings-btn settings-btn-secondary">Reset to Defaults</button>
          </div>
        </section>
          )}

          {activePage === 'notices' && (
        <section className="notices-section">
          <h3>Notices & Announcements</h3>
          <div className="notices-wrapper">
            <table className="notices-table">
              <thead>
                <tr>
                  <th>Notice</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((noticeItem, idx) => (
                  <tr key={idx}>
                    <td className="notice-text">{noticeItem.notice}</td>
                    <td className="notice-date">{noticeItem.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
          )}

          {activePage === 'profile' && (
        <section className="profile-section">
          <div className="profile-header-section">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                <span className="avatar-initials">SN</span>
              </div>
              <button className="profile-edit-btn">
                <span>✏️</span>
                Edit Profile
              </button>
            </div>
            <div className="profile-header-info">
          <h3>Student Profile</h3>
              <p className="profile-subtitle">View and manage your academic information</p>
              </div>
            </div>

          <div className="profile-grid">
            {/* Bio Data Card */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <span className="profile-card-icon">👤</span>
                <h4>Personal Information</h4>
              </div>
              <div className="profile-content">
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📝</span>
                    <span>Full Name</span>
                  </div>
                  <div className="profile-info-value">Student Name</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">🔢</span>
                    <span>Roll Number</span>
                  </div>
                  <div className="profile-info-value">20XX12345</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">🏛️</span>
                    <span>Branch</span>
                  </div>
                  <div className="profile-info-value">Computer Science & Engineering</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📅</span>
                    <span>Year / Semester</span>
                  </div>
                  <div className="profile-info-value">III Year / I Semester</div>
                </div>
              </div>
            </div>

            {/* Academic Performance Card */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <span className="profile-card-icon">📊</span>
                <h4>Academic Performance</h4>
              </div>
              <div className="profile-content">
                <div className="profile-stat-item">
                  <div className="stat-value-large">8.5</div>
                  <div className="stat-label">CGPA</div>
                  <div className="stat-badge stat-badge-success">Excellent</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">✅</span>
                    <span>Attendance</span>
                  </div>
                  <div className="profile-info-value">
                    <span className="attendance-value">86%</span>
                    <div className="attendance-bar">
                      <div className="attendance-bar-fill" style={{ width: '86%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📈</span>
                    <span>Last Semester SGPA</span>
                  </div>
                  <div className="profile-info-value">8.3</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📉</span>
                    <span>Previous Semester SGPA</span>
                  </div>
                  <div className="profile-info-value">8.1</div>
                </div>
              </div>
            </div>

            {/* Financial Information Card */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <span className="profile-card-icon">💰</span>
                <h4>Fee Details</h4>
              </div>
              <div className="profile-content">
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">💳</span>
                    <span>Payment Status</span>
                  </div>
                  <div className="profile-info-value">
                    <span className="status-badge status-badge-paid">Paid</span>
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📊</span>
                    <span>Pending Amount</span>
                  </div>
                  <div className="profile-info-value amount-value">₹0.00</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📆</span>
                    <span>Last Payment Date</span>
                  </div>
                  <div className="profile-info-value">Aug 15, 2025</div>
                </div>
              </div>
            </div>

            {/* Backlogs Card */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <span className="profile-card-icon">📚</span>
                <h4>Backlogs</h4>
              </div>
              <div className="profile-content">
                <div className="profile-stat-item">
                  <div className="stat-value-large stat-value-success">0</div>
                  <div className="stat-label">Current Backlogs</div>
                  <div className="stat-badge stat-badge-success">Clear</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📖</span>
                    <span>Backlog History</span>
                  </div>
                  <div className="profile-info-value">1 (Cleared)</div>
                </div>
              </div>
            </div>

            {/* Outings Card */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <span className="profile-card-icon">🚪</span>
                <h4>Outings</h4>
              </div>
              <div className="profile-content">
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📊</span>
                    <span>Total Outings</span>
                  </div>
                  <div className="profile-info-value">3</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📅</span>
                    <span>Last Outing</span>
                  </div>
                  <div className="profile-info-value">Sep 15, 2025</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">⏰</span>
                    <span>Remaining Outings</span>
                  </div>
                  <div className="profile-info-value">
                    <span className="status-badge status-badge-info">Unlimited</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Counseling Card */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <span className="profile-card-icon">💬</span>
                <h4>Counseling</h4>
              </div>
              <div className="profile-content">
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">👨‍🏫</span>
                    <span>Assigned Counselor</span>
                  </div>
                  <div className="profile-info-value">Prof. XYZ</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📅</span>
                    <span>Last Session</span>
                  </div>
                  <div className="profile-info-value">Aug 22, 2025</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📞</span>
                    <span>Contact</span>
                  </div>
                  <div className="profile-info-value">
                    <button className="contact-btn">Schedule Session</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Disciplinary Action Card */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <span className="profile-card-icon">⚖️</span>
                <h4>Disciplinary Records</h4>
              </div>
              <div className="profile-content">
                <div className="profile-info-item">
                  <div className="profile-info-label">
                    <span className="info-icon">📋</span>
                    <span>Records</span>
                  </div>
                  <div className="profile-info-value">
                    <span className="status-badge status-badge-success">None</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
          )}
        </main>
      </div>
    </div>
  )
}



