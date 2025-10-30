import { useState } from 'react'
import './HODDashboard.css'
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
  setTimetable: (timetable: TimetableSlot[]) => void
}

type ActivePage = 'timetable' | 'attendance' | 'feedback' | 'exam-schedule' | 'griet-guidelines' | 'griet-news' | 'griet-internships' | 'griet-resume'

type StudentAttendance = {
  rollNo: string
  name: string
  semester: number
  subject: string
  totalClasses: number
  present: number
  absent: number
  percentage: number
}

type StudentFeedback = {
  id: string
  studentName: string
  rollNo: string
  courseCode: string
  courseName: string
  teaching: number
  materials: number
  assessment: number
  overall: number
  comments: string
  anonymous: boolean
  submittedDate: string
}

type ExamSchedule = Object & {
  course: string
  code: string
  date: string
  time: string
  venue: string
  type: string
}

const subjects = ['CN', 'DBMS', 'WT', 'DS', 'OS', 'EM', 'PC', 'Java']

export default function HODDashboard({ timetable, setTimetable }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState<ActivePage>('timetable')
  const [isGRIETOpen, setIsGRIETOpen] = useState(false)
  const [activeDay, setActiveDay] = useState<keyof Omit<TimetableSlot, 'time'>>('monday')
  const [draggedCell, setDraggedCell] = useState<{ rowIndex: number; day: keyof Omit<TimetableSlot, 'time'> } | null>(null)
  const [showSaved, setShowSaved] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState<number>(1)
  const [selectedSubject, setSelectedSubject] = useState<string>('')

  // Students Attendance Data
  const attendanceData: StudentAttendance[] = [
    { rollNo: 'GR22A1234', name: 'John Doe', semester: 5, subject: 'Computer Networks', totalClasses: 40, present: 36, absent: 4, percentage: 90 },
    { rollNo: 'GR22A1235', name: 'Jane Smith', semester: 5, subject: 'Computer Networks', totalClasses: 40, present: 38, absent: 2, percentage: 95 },
    { rollNo: 'GR22A1236', name: 'Bob Johnson', semester: 5, subject: 'Computer Networks', totalClasses: 40, present: 32, absent: 8, percentage: 80 },
    { rollNo: 'GR22A1237', name: 'Alice Williams', semester: 5, subject: 'Computer Networks', totalClasses: 40, present: 35, absent: 5, percentage: 88 },
    { rollNo: 'GR22A1238', name: 'Charlie Brown', semester: 5, subject: 'Database Management Systems', totalClasses: 38, present: 36, absent: 2, percentage: 95 },
    { rollNo: 'GR22A1239', name: 'Diana Prince', semester: 5, subject: 'Database Management Systems', totalClasses: 38, present: 34, absent: 4, percentage: 89 },
    { rollNo: 'GR22A1240', name: 'Eve Adams', semester: 5, subject: 'Full Stack Development', totalClasses: 42, present: 40, absent: 2, percentage: 95 },
  ]

  // Student Feedback Data
  const feedbackData: StudentFeedback[] = [
    {
      id: '1',
      studentName: 'John Doe',
      rollNo: 'GR22A1234',
      courseCode: 'GR22A3044',
      courseName: 'Computer Networks',
      teaching: 8,
      materials: 9,
      assessment: 7,
      overall: 8,
      comments: 'Great teaching methodology. The professor explains concepts clearly and uses practical examples.',
      anonymous: false,
      submittedDate: '2025-02-10',
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      rollNo: 'GR22A1235',
      courseCode: 'GR22A3044',
      courseName: 'Computer Networks',
      teaching: 9,
      materials: 8,
      assessment: 9,
      overall: 9,
      comments: 'Excellent course materials and assignments. Very helpful for understanding networking concepts.',
      anonymous: false,
      submittedDate: '2025-02-09',
    },
    {
      id: '3',
      studentName: 'Anonymous',
      rollNo: 'N/A',
      courseCode: 'GR22A3069',
      courseName: 'Data Warehousing and Data Mining',
      teaching: 6,
      materials: 7,
      assessment: 5,
      overall: 6,
      comments: 'Could improve on providing more examples and practice problems.',
      anonymous: true,
      submittedDate: '2025-02-08',
    },
  ]

  // Exam Schedule Data
  const examSchedule: ExamSchedule[] = [
    { course: 'Computer Networks', code: 'GR22A3044', date: '2025-02-15', time: '09:00 AM - 12:00 PM', venue: 'Hall A, Block 3', type: 'Mid-term' },
    { course: 'Data Warehousing and Data Mining', code: 'GR22A3069', date: '2025-02-17', time: '09:00 AM - 12:00 PM', venue: 'Hall B, Block 3', type: 'Mid-term' },
    { course: 'Artificial Intelligence', code: 'GR22A3070', date: '2025-02-19', time: '09:00 AM - 12:00 PM', venue: 'Hall A, Block 3', type: 'Mid-term starting' },
    { course: 'Professional Elective I', code: 'PE-I', date: '2025-02-21', time: '02:00 PM - 5:00 PM', venue: 'Hall C, Block 3', type: 'Mid-term' },
    { course: 'Open Elective I', code: 'OE-I', date: '2025-02-22', time: '09:00 AM - 12:00 PM', venue: 'Hall A, Block 2', type: 'Mid-term' },
  ]

  // GRIET Data
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

  const days: Array<{ key: keyof Omit<TimetableSlot, 'time'>; label: string }> = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
  ]

  const availableSubjects = Array.from(new Set(attendanceData.map(a => a.subject)))

  const handleDragStart = (e: React.DragEvent, rowIndex: number, day: keyof Omit<TimetableSlot, 'time'>) => {
    setDraggedCell({ rowIndex, day })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', '')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (
    e: React.DragEvent,
    targetRowIndex: number,
    targetDay: keyof Omit<TimetableSlot, 'time'>
  ) => {
    e.preventDefault()
    if (!draggedCell) return
    const newTimetable = [...timetable]
    const sourceCell = newTimetable[draggedCell.rowIndex][draggedCell.day]
    const targetCell = newTimetable[targetRowIndex][targetDay]
    if (sourceCell !== 'Break' && targetCell !== 'Break') {
      newTimetable[draggedCell.rowIndex][draggedCell.day] = targetCell
      newTimetable[targetRowIndex][targetDay] = sourceCell
      setTimetable(newTimetable)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    }
    setDraggedCell(null)
  }

  const handleTextChange = (
    value: string,
    rowIndex: number,
    day: keyof Omit<TimetableSlot, 'time'>
  ) => {
    const newTimetable = [...timetable]
    newTimetable[rowIndex][day] = value
    setTimetable(newTimetable)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }

  const handleSave = () => {
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }

  const filteredAttendance = selectedSubject
    ? attendanceData.filter(a => a.subject === selectedSubject)
    : attendanceData

  const filteredAttendanceBySemester = filteredAttendance.filter(a => a.semester === selectedSemester)

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

  const renderContent = () => {
    switch (activePage) {
      case 'timetable':
  return (
        <section className="timetable-editor">
          <div className="editor-header">
            <h3>Edit Timetable (Drag & Drop)</h3>
            <p className="instruction">Drag cells to swap subjects, or click to edit directly</p>
          </div>

          <div className="subject-reference">
            <strong>Available Subjects: </strong>
            {subjects.map((sub) => (
              <span key={sub} className="subject-tag">
                {sub}
              </span>
            ))}
          </div>

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
            <table className="timetable-editable">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Room</th>
                  <th>Faculty</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((slot, rowIndex) => {
                  const subject = slot[activeDay]
                  const isBreak = subject === 'Break'
                  return (
                    <tr key={rowIndex}>
                      <td className="time-cell">{slot.time}</td>
                      <td
                        draggable={!isBreak}
                        onDragStart={(e) => handleDragStart(e, rowIndex, activeDay)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, rowIndex, activeDay)}
                        className={`editable-cell ${isBreak ? 'break-cell' : ''}`}
                      >
                        {isBreak ? (
                          subject
                        ) : (
                          <input
                            type="text"
                            value={subject}
                            onChange={(e) => handleTextChange(e.target.value, rowIndex, activeDay)}
                            className="cell-input"
                            placeholder="Subject"
                          />
                        )}
                      </td>
                      <td className="readonly-cell">{isBreak ? '-' : getRoom(subject)}</td>
                      <td className="readonly-cell">{isBreak ? '-' : getFaculty(subject)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="editor-actions">
            {showSaved && <span className="saved-message">✓ Changes saved successfully!</span>}
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="reset-btn" onClick={() => setTimetable(timetable)}>Reset</button>
            </div>
          </section>
        )

      case 'attendance':
        return (
          <section className="attendance-section">
            <h3>Students Attendance Overview</h3>
            <div className="attendance-wrapper">
              <div className="attendance-filters">
                <div className="form-group">
                  <label>Semester</label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                    className="form-input"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                    <option value={3}>Semester 3</option>
                    <option value={4}>Semester 4</option>
                    <option value={5}>Semester 5</option>
                    <option value={6}>Semester 6</option>
                    <option value={7}>Semester 7</option>
                    <option value={8}>Semester 8</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Subjects</option>
                    {availableSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="attendance-stats">
                <div className="stat-card">
                  <div className="stat-value">{filteredAttendanceBySemester.length}</div>
                  <div className="stat-label">Total Students</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {filteredAttendanceBySemester.length > 0
                      ? Math.round(
                          filteredAttendanceBySemester.reduce((sum, a) => sum + a.percentage, 0) /
                            filteredAttendanceBySemester.length
                        )
                      : 0}%
                  </div>
                  <div className="stat-label">Average Attendance</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {filteredAttendanceBySemester.filter(a => a.percentage < 75).length}
                  </div>
                  <div className="stat-label">Below 75%</div>
                </div>
              </div>

              <div className="attendance-table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Semester</th>
                      <th>Subject</th>
                      <th>Total Classes</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendanceBySemester.map((student, index) => (
                      <tr key={index}>
                        <td>{student.rollNo}</td>
                        <td>{student.name}</td>
                        <td>{student.semester}</td>
                        <td>{student.subject}</td>
                        <td>{student.totalClasses}</td>
                        <td className="present-cell">{student.present}</td>
                        <td className="absent-cell">{student.absent}</td>
                        <td>
                          <span className={`percentage-badge ${student.percentage >= 75 ? 'good' : 'low'}`}>
                            {student.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )

      case 'feedback':
        return (
          <section className="feedback-section">
            <h3>Student Feedback</h3>
            <div className="feedback-wrapper">
              <div className="feedback-stats">
                <div className="stat-card">
                  <div className="stat-value">{feedbackData.length}</div>
                  <div className="stat-label">Total Feedback</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {feedbackData.length > 0
                      ? Math.round(
                          feedbackData.reduce((sum, f) => sum + f.overall, 0) / feedbackData.length * 10
                        ) / 10
                      : 0}
                  </div>
                  <div className="stat-label">Average Rating</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {feedbackData.filter(f => f.anonymous).length}
                  </div>
                  <div className="stat-label">Anonymous</div>
                </div>
              </div>

              <div className="feedback-list">
                {feedbackData.map(feedback => (
                  <div key={feedback.id} className="feedback-card">
                    <div className="feedback-header">
                      <div>
                        <h4>{feedback.courseName}</h4>
                        <p className="course-code">{feedback.courseCode}</p>
                      </div>
                      <span className="feedback-date">{feedback.submittedDate}</span>
                    </div>
                    <div className="feedback-student">
                      <strong>Student:</strong> {feedback.anonymous ? 'Anonymous' : `${feedback.studentName} (${feedback.rollNo})`}
                    </div>
                    <div className="feedback-ratings">
                      <div className="rating-display">
                        <span className="rating-label">Teaching:</span>
                        <span className="rating-value">{feedback.teaching}/10</span>
                      </div>
                      <div className="rating-display">
                        <span className="rating-label">Materials:</span>
                        <span className="rating-value">{feedback.materials}/10</span>
                      </div>
                      <div className="rating-display">
                        <span className="rating-label">Assessment:</span>
                        <span className="rating-value">{feedback.assessment}/10</span>
                      </div>
                      <div className="rating-display">
                        <span className="rating-label">Overall:</span>
                        <span className="rating-value overall">{feedback.overall}/10</span>
                      </div>
                    </div>
                    {feedback.comments && (
                      <div className="feedback-comments">
                        <strong>Comments:</strong>
                        <p>{feedback.comments}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'exam-schedule':
        return (
          <section className="exam-schedule-section">
            <h3>Exam Schedule</h3>
            <div className="exam-schedule-wrapper">
              <table className="exam-schedule-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Course Code</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Venue</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {examSchedule.map((exam, index) => (
                    <tr key={index}>
                      <td>{exam.course}</td>
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
        )

      case 'griet-guidelines':
        return (
          <section className="griet-guidelines-section">
            <h3>GRIET Guidelines</h3>
            <div className="guidelines-wrapper">
              <div className="guidelines-grid">
                {grietGuidelines.map((guideline, index) => (
                  <div key={index} className="guideline-card">
                    <h4>{guideline.title}</h4>
                    <p>{guideline.description}</p>
                    <div className="guideline-date">Date: {guideline.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'griet-news':
        return (
          <section className="griet-news-section">
            <h3>GRIET News & Updates</h3>
            <div className="news-wrapper">
              <div className="news-grid">
                {grietNews.map((news, index) => (
                  <div key={index} className="news-card">
                    <div className="news-header">
                      <span className="news-category">{news.category}</span>
                      <span className="news-date">{news.date}</span>
                    </div>
                    <h4>{news.title}</h4>
                    <p>{news.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'griet-internships':
        return (
          <section className="griet-internships-section">
            <h3>Internships & Placements</h3>
            <div className="internships-wrapper">
              <div className="internships-grid">
                {internships.map((internship, index) => (
                  <div key={index} className="internship-card">
                    <div className="internship-header">
                      <h4>{internship.company}</h4>
                      <span className={`internship-type ${internship.type.toLowerCase()}`}>{internship.type}</span>
                    </div>
                    <div className="internship-role">{internship.role}</div>
                    <div className="internship-footer">
                      <span className="deadline">Deadline: {internship.deadline}</span>
                      <span className={`status ${internship.status.toLowerCase()}`}>{internship.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'griet-resume':
        return (
          <section className="griet-resume-section">
            <h3>Resume Management</h3>
            <div className="resume-wrapper">
              <div className="resume-info-card">
                <h4>Student Resume Statistics</h4>
                <div className="resume-stats">
                  <div className="stat-card">
                    <div className="stat-value">150</div>
                    <div className="stat-label">Total Resumes</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">45</div>
                    <div className="stat-label">Updated This Month</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">92%</div>
                    <div className="stat-label">Completion Rate</div>
                  </div>
                </div>
                <p className="resume-note">
                  View and manage student resume uploads. Students can upload their resumes through the student portal,
                  and HODs can access them for placement coordination and verification.
                </p>
              </div>
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="hod-dashboard">
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
          <div className="hod-info">
            <h2>HOD Portal</h2>
            <p>Department Management</p>
          </div>
        </div>
      </header>

      <div className={`hod-layout ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <aside className={`hod-sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
          <nav className="sidebar-nav">
            <button
              className={`nav-link ${activePage === 'timetable' ? 'active' : ''}`}
              onClick={() => setActivePage('timetable')}
              type="button"
            >
              📅 Timetable Management
            </button>
            <button
              className={`nav-link ${activePage === 'attendance' ? 'active' : ''}`}
              onClick={() => setActivePage('attendance')}
              type="button"
            >
              ✅ Students Attendance
            </button>
            <button
              className={`nav-link ${activePage === 'feedback' ? 'active' : ''}`}
              onClick={() => setActivePage('feedback')}
              type="button"
            >
              💬 Student Feedback
            </button>
            <button
              className={`nav-link ${activePage === 'exam-schedule' ? 'active' : ''}`}
              onClick={() => setActivePage('exam-schedule')}
              type="button"
            >
              📝 Exam Schedule
            </button>
            <div className="nav-section">
              <button
                className={`nav-section-header ${isGRIETOpen ? 'open' : ''}`}
                onClick={() => setIsGRIETOpen(!isGRIETOpen)}
                type="button"
              >
                <span>🏛️ GRIET Work</span>
                <span className={`nav-section-icon ${isGRIETOpen ? 'open' : ''}`}>
                  {isGRIETOpen ? '▼' : '▶'}
                </span>
              </button>
              {isGRIETOpen && (
                <div className="nav-section-sublinks">
                  <button
                    className={`nav-sublink ${activePage === 'griet-guidelines' ? 'active' : ''}`}
                    onClick={() => setActivePage('griet-guidelines')}
                    type="button"
                  >
                    📋 Guidelines
                  </button>
                  <button
                    className={`nav-sublink ${activePage === 'griet-news' ? 'active' : ''}`}
                    onClick={() => setActivePage('griet-news')}
                    type="button"
                  >
                    📰 News & Updates
                  </button>
                  <button
                    className={`nav-sublink ${activePage === 'griet-internships' ? 'active' : ''}`}
                    onClick={() => setActivePage('griet-internships')}
                    type="button"
                  >
                    💼 Internships & Placements
                  </button>
                  <button
                    className={`nav-sublink ${activePage === 'griet-resume' ? 'active' : ''}`}
                    onClick={() => setActivePage('griet-resume')}
                    type="button"
                  >
                    📄 Resume Management
                  </button>
                </div>
              )}
            </div>
            <button
              className={`nav-link logout`}
              onClick={handleLogout}
              type="button"
            >
              🚪 Logout
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {renderContent()}
      </main>
      </div>
    </div>
  )
}
