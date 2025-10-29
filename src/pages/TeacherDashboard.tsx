import { useState } from 'react'
import './TeacherDashboard.css'
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

type ActivePage = 'timetable' | 'attendance' | 'assignments' | 'resources' | 'answer-keys' | 'grades'

type StudentAttendance = {
  id: string
  name: string
  rollNo: string
  status: 'present' | 'absent' | null
}

type Assignment = {
  id: string
  title: string
  subject: string
  description: string
  dueDate: string
  maxMarks: number
  createdAt: string
}

type Resource = {
  id: string
  title: string
  subject: string
  type: 'pdf' | 'video' | 'document' | 'link'
  fileUrl: string
  uploadedAt: string
}

type AnswerKey = {
  id: string
  title: string
  subject: string
  examDate: string
  fileUrl: string
  uploadedAt: string
}

type Grade = {
  studentId: string
  studentName: string
  rollNo: string
  subject: string
  assignmentMarks: number
  quizMarks: number
  midTermMarks: number
  finalMarks: number
  totalMarks: number
  grade: string
}

export default function TeacherDashboard({ timetable }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState<ActivePage>('timetable')
  const [activeDay, setActiveDay] = useState<keyof Omit<TimetableSlot, 'time'>>('monday')
  
  // Attendance state
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<StudentAttendance[]>([
    { id: '1', name: 'John Doe', rollNo: 'GR22A1234', status: null },
    { id: '2', name: 'Jane Smith', rollNo: 'GR22A1235', status: null },
    { id: '3', name: 'Bob Johnson', rollNo: 'GR22A1236', status: null },
    { id: '4', name: 'Alice Williams', rollNo: 'GR22A1237', status: null },
    { id: '5', name: 'Charlie Brown', rollNo: 'GR22A1238', status: null },
  ])

  // Assignments state
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Web Development Project',
      subject: 'Full Stack Development',
      description: 'Build a full-stack web application using React and Node.js',
      dueDate: '2025-03-01',
      maxMarks: 100,
      createdAt: '2025-02-01',
    },
  ])
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    maxMarks: 0,
  })

  // Resources state
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Database Concepts Lecture Notes',
      subject: 'Database Management Systems',
      type: 'pdf',
      fileUrl: '#',
      uploadedAt: '2025-01-15',
    },
  ])

  // Answer Keys state
  const [answerKeys, setAnswerKeys] = useState<AnswerKey[]>([
    {
      id: '1',
      title: 'Mid-Term Exam Answer Key',
      subject: 'Computer Networks',
      examDate: '2025-02-10',
      fileUrl: '#',
      uploadedAt: '2025-02-11',
    },
  ])

  // Grades state
  const [grades, setGrades] = useState<Grade[]>([
    {
      studentId: '1',
      studentName: 'John Doe',
      rollNo: 'GR22A1234',
      subject: 'Full Stack Development',
      assignmentMarks: 85,
      quizMarks: 90,
      midTermMarks: 75,
      finalMarks: 88,
      totalMarks: 85,
      grade: 'A',
    },
    {
      studentId: '2',
      studentName: 'Jane Smith',
      rollNo: 'GR22A1235',
      subject: 'Full Stack Development',
      assignmentMarks: 92,
      quizMarks: 88,
      midTermMarks: 85,
      finalMarks: 90,
      totalMarks: 89,
      grade: 'A+',
    },
    {
      studentId: '3',
      studentName: 'Bob Johnson',
      rollNo: 'GR22A1236',
      subject: 'Full Stack Development',
      assignmentMarks: 78,
      quizMarks: 75,
      midTermMarks: 70,
      finalMarks: 80,
      totalMarks: 76,
      grade: 'B+',
    },
  ])

  const days: Array<{ key: keyof Omit<TimetableSlot, 'time'>; label: string }> = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
  ]

  const subjects = [
    'Full Stack Development',
    'Computer Networks',
    'Database Management Systems',
    'Artificial Intelligence',
    'Operating Systems',
  ]

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    setStudents(students.map(s => s.id === studentId ? { ...s, status } : s))
  }

  const handleSubmitAttendance = () => {
    // In real app, this would send data to backend
    const presentCount = students.filter(s => s.status === 'present').length
    const absentCount = students.filter(s => s.status === 'absent').length
    alert(`Attendance submitted successfully!\nPresent: ${presentCount}\nAbsent: ${absentCount}`)
    setStudents(students.map(s => ({ ...s, status: null })))
  }

  const handleAddAssignment = () => {
    if (!newAssignment.title || !newAssignment.subject || !newAssignment.dueDate) {
      alert('Please fill in all required fields')
      return
    }
    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setAssignments([...assignments, assignment])
    setNewAssignment({ title: '', subject: '', description: '', dueDate: '', maxMarks: 0 })
    alert('Assignment created successfully!')
  }

  const handleUploadResource = () => {
    // In real app, this would handle file upload
    alert('Resource upload functionality - integrate with file upload service')
  }

  const handleUploadAnswerKey = () => {
    // In real app, this would handle file upload
    alert('Answer key upload functionality - integrate with file upload service')
  }

  const handleUpdateGrades = () => {
    // In real app, this would save grades to backend
    alert('Grades updated successfully!')
  }

  const renderContent = () => {
    switch (activePage) {
      case 'timetable':
        return (
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
                  {timetable.map((slot, rowIndex) => {
                    const subject = slot[activeDay]
                    const isBreak = subject === 'Break'
                    return (
                      <tr key={rowIndex}>
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
        )

      case 'attendance':
        return (
          <section className="attendance-section">
            <h3>Mark Attendance</h3>
            <div className="attendance-wrapper">
              <div className="attendance-filters">
                <div className="form-group">
                  <label>Select Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="form-input"
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {selectedSubject && (
                <>
                  <div className="students-list">
                    <table className="attendance-table">
                      <thead>
                        <tr>
                          <th>Roll No</th>
                          <th>Name</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id}>
                            <td>{student.rollNo}</td>
                            <td>{student.name}</td>
                            <td>
                              <div className="attendance-buttons">
                                <button
                                  className={`attendance-btn ${student.status === 'present' ? 'present' : ''}`}
                                  onClick={() => handleAttendanceChange(student.id, 'present')}
                                  type="button"
                                >
                                  Present
                                </button>
                                <button
                                  className={`attendance-btn ${student.status === 'absent' ? 'absent' : ''}`}
                                  onClick={() => handleAttendanceChange(student.id, 'absent')}
                                  type="button"
                                >
                                  Absent
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button className="submit-btn" onClick={handleSubmitAttendance} type="button">
                    Submit Attendance
                  </button>
                </>
              )}
            </div>
          </section>
        )

      case 'assignments':
        return (
          <section className="assignments-section">
            <h3>Assign Assignments</h3>
            <div className="assignments-wrapper">
              <div className="new-assignment-form">
                <h4>Create New Assignment</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Assignment Title</label>
                    <input
                      type="text"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      className="form-input"
                      placeholder="Enter assignment title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select
                      value={newAssignment.subject}
                      onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                      className="form-input"
                    >
                      <option value="">-- Select Subject --</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Maximum Marks</label>
                    <input
                      type="number"
                      value={newAssignment.maxMarks}
                      onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: parseInt(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="100"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      className="form-input"
                      placeholder="Enter assignment description..."
                      rows={4}
                    />
                  </div>
                </div>
                <button className="submit-btn" onClick={handleAddAssignment} type="button">
                  Create Assignment
                </button>
              </div>

              <div className="assignments-list">
                <h4>Existing Assignments</h4>
                {assignments.map(assignment => (
                  <div key={assignment.id} className="assignment-card">
                    <div className="assignment-header">
                      <h5>{assignment.title}</h5>
                      <span className="assignment-subject">{assignment.subject}</span>
                    </div>
                    <p className="assignment-description">{assignment.description}</p>
                    <div className="assignment-footer">
                      <span>Due: {assignment.dueDate}</span>
                      <span>Max Marks: {assignment.maxMarks}</span>
                      <span>Created: {assignment.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'resources':
        return (
          <section className="resources-section">
            <h3>Send Resources</h3>
            <div className="resources-wrapper">
              <div className="upload-resource-form">
                <h4>Upload New Resource</h4>
                <div className="form-group">
                  <label>Resource Title</label>
                  <input type="text" className="form-input" placeholder="Enter resource title" />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select className="form-input">
                    <option value="">-- Select Subject --</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Resource Type</label>
                  <select className="form-input">
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="link">Link</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Upload File / Enter Link</label>
                  <input type="file" className="form-input" />
                </div>
                <button className="submit-btn" onClick={handleUploadResource} type="button">
                  Upload Resource
                </button>
              </div>

              <div className="resources-list">
                <h4>Uploaded Resources</h4>
                {resources.map(resource => (
                  <div key={resource.id} className="resource-card">
                    <div className="resource-header">
                      <h5>{resource.title}</h5>
                      <span className="resource-type">{resource.type.toUpperCase()}</span>
                    </div>
                    <div className="resource-info">
                      <span>Subject: {resource.subject}</span>
                      <span>Uploaded: {resource.uploadedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'answer-keys':
        return (
          <section className="answer-keys-section">
            <h3>Answer Keys</h3>
            <div className="answer-keys-wrapper">
              <div className="upload-answer-key-form">
                <h4>Upload Answer Key</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Answer Key Title</label>
                    <input type="text" className="form-input" placeholder="e.g., Mid-Term Exam Answer Key" />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select className="form-input">
                      <option value="">-- Select Subject --</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Exam Date</label>
                    <input type="date" className="form-input" />
                  </div>
                  <div className="form-group full-width">
                    <label>Upload Answer Key File</label>
                    <input type="file" className="form-input" accept=".pdf,.doc,.docx" />
                  </div>
                </div>
                <button className="submit-btn" onClick={handleUploadAnswerKey} type="button">
                  Upload Answer Key
                </button>
              </div>

              <div className="answer-keys-list">
                <h4>Uploaded Answer Keys</h4>
                {answerKeys.map(key => (
                  <div key={key.id} className="answer-key-card">
                    <div className="answer-key-header">
                      <h5>{key.title}</h5>
                      <span className="answer-key-subject">{key.subject}</span>
                    </div>
                    <div className="answer-key-info">
                      <span>Exam Date: {key.examDate}</span>
                      <span>Uploaded: {key.uploadedAt}</span>
                      <button className="view-btn">View / Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'grades':
        return (
          <section className="grades-section">
            <h3>Grades and Marks</h3>
            <div className="grades-wrapper">
              <div className="grades-filters">
                <div className="form-group">
                  <label>Select Subject</label>
                  <select className="form-input">
                    <option value="">-- Select Subject --</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grades-table-wrapper">
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Assignment</th>
                      <th>Quiz</th>
                      <th>Mid-Term</th>
                      <th>Final</th>
                      <th>Total</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map(grade => (
                      <tr key={grade.studentId}>
                        <td>{grade.rollNo}</td>
                        <td>{grade.studentName}</td>
                        <td>
                          <input
                            type="number"
                            value={grade.assignmentMarks}
                            onChange={(e) => {
                              const updatedGrades = grades.map(g =>
                                g.studentId === grade.studentId
                                  ? { ...g, assignmentMarks: parseInt(e.target.value) || 0 }
                                  : g
                              )
                              setGrades(updatedGrades)
                            }}
                            className="marks-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={grade.quizMarks}
                            onChange={(e) => {
                              const updatedGrades = grades.map(g =>
                                g.studentId === grade.studentId
                                  ? { ...g, quizMarks: parseInt(e.target.value) || 0 }
                                  : g
                              )
                              setGrades(updatedGrades)
                            }}
                            className="marks-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={grade.midTermMarks}
                            onChange={(e) => {
                              const updatedGrades = grades.map(g =>
                                g.studentId === grade.studentId
                                  ? { ...g, midTermMarks: parseInt(e.target.value) || 0 }
                                  : g
                              )
                              setGrades(updatedGrades)
                            }}
                            className="marks-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={grade.finalMarks}
                            onChange={(e) => {
                              const updatedGrades = grades.map(g =>
                                g.studentId === grade.studentId
                                  ? { ...g, finalMarks: parseInt(e.target.value) || 0 }
                                  : g
                              )
                              setGrades(updatedGrades)
                            }}
                            className="marks-input"
                          />
                        </td>
                        <td>{grade.totalMarks}</td>
                        <td>
                          <select
                            value={grade.grade}
                            onChange={(e) => {
                              const updatedGrades = grades.map(g =>
                                g.studentId === grade.studentId
                                  ? { ...g, grade: e.target.value }
                                  : g
                              )
                              setGrades(updatedGrades)
                            }}
                            className="grade-select"
                          >
                            <option value="S">S</option>
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="submit-btn" onClick={handleUpdateGrades} type="button">
                Save Grades
              </button>
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="teacher-dashboard">
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
          <div className="teacher-info">
            <h2>Teacher Portal</h2>
            <p>Welcome to your dashboard</p>
          </div>
        </div>
      </header>

      <div className={`teacher-layout ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <aside className={`teacher-sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
          <nav className="sidebar-nav">
            <button
              className={`nav-link ${activePage === 'timetable' ? 'active' : ''}`}
              onClick={() => setActivePage('timetable')}
              type="button"
            >
              📅 Timetable
            </button>
            <button
              className={`nav-link ${activePage === 'attendance' ? 'active' : ''}`}
              onClick={() => setActivePage('attendance')}
              type="button"
            >
              ✅ Attendance Tracking
            </button>
            <button
              className={`nav-link ${activePage === 'assignments' ? 'active' : ''}`}
              onClick={() => setActivePage('assignments')}
              type="button"
            >
              📝 Assign Assignments
            </button>
            <button
              className={`nav-link ${activePage === 'resources' ? 'active' : ''}`}
              onClick={() => setActivePage('resources')}
              type="button"
            >
              📚 Send Resources
            </button>
            <button
              className={`nav-link ${activePage === 'answer-keys' ? 'active' : ''}`}
              onClick={() => setActivePage('answer-keys')}
              type="button"
            >
              🔑 Answer Keys
            </button>
            <button
              className={`nav-link ${activePage === 'grades' ? 'active' : ''}`}
              onClick={() => setActivePage('grades')}
              type="button"
            >
              📊 Grades and Marks
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
