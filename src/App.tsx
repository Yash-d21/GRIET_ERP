import { useEffect, useRef, useState } from 'react'
import StudentDashboard from './pages/StudentDashboard'
import HODDashboard from './pages/HODDashboard'
import TeacherDashboard from './pages/TeacherDashboard'

const initialTimetable = [
  { time: '09:00 - 09:50', monday: 'CN', tuesday: 'DBMS', wednesday: 'CN', thursday: 'WT', friday: 'DS', saturday: 'OS' },
  { time: '10:00 - 10:50', monday: 'DBMS', tuesday: 'CN', wednesday: 'WT', thursday: 'DS', friday: 'CN', saturday: 'WT' },
  { time: '11:00 - 11:50', monday: 'WT', tuesday: 'DS', wednesday: 'DBMS', thursday: 'CN', friday: 'WT', saturday: 'DS' },
  { time: '12:00 - 12:50', monday: 'Break', tuesday: 'Break', wednesday: 'Break', thursday: 'Break', friday: 'Break', saturday: 'Break' },
  { time: '13:00 - 13:50', monday: 'DS', tuesday: 'WT', wednesday: 'CN', thursday: 'OS', friday: 'DBMS', saturday: 'CN' },
  { time: '14:00 - 14:50', monday: 'OS', tuesday: 'CN', wednesday: 'DS', thursday: 'WT', friday: 'OS', saturday: 'DBMS' },
]

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <img src="/grietlogo.png" alt="GRIET Logo" className="griet-logo" />
        <img src="/accredition.png" alt="Accreditations" className="accredition-logo" />
      </div>
    </header>
  )
}

function LoginCard({ title, onLogin }: { title: string; onLogin: () => void }) {
  return (
    <div className="login-card">
      <h2>{title}</h2>
      <form
        className="login-form"
        onSubmit={(e) => {
          
          e.preventDefault()
          onLogin()
        }}
      >
        <label>
          <span>Username</span>
          <input type="text" name="username" placeholder="Enter username" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password" placeholder="Enter password" required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <img src="/tars_logo.jpg" alt="TARS Networks Logo" className="tars-logo" />
        <p>Developed and maintained by TARS Networks</p>
      </div>
    </footer>
  )
}

function LoginPage({
  onHODLogin,
  onTeacherLogin,
  onStudentLogin,
}: {
  onHODLogin: () => void
  onTeacherLogin: () => void
  onStudentLogin: () => void
}) {
  return (
    <div className="page">
      <Header />
      <main className="login-container">
        <LoginCard title="HOD Login" onLogin={onHODLogin} />
        <LoginCard title="Teacher Login" onLogin={onTeacherLogin} />
        <LoginCard title="Student Login" onLogin={onStudentLogin} />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'student' | 'hod' | 'teacher'>('login')
  const [timetable, setTimetable] = useState(initialTimetable)
  const broadcastRef = useRef<BroadcastChannel | null>(null)
  const lastStoredRef = useRef<string>('')

  // Load persisted timetable on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('timetable')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setTimetable(parsed)
          lastStoredRef.current = stored
        }
      }
    } catch {}
  }, [])

  // Persist timetable changes and broadcast to other tabs/windows
  useEffect(() => {
    try {
      const serialized = JSON.stringify(timetable)
      localStorage.setItem('timetable', serialized)
      lastStoredRef.current = serialized
    } catch {}

    // Lazy-init BroadcastChannel
    if (!broadcastRef.current) {
      try {
        broadcastRef.current = new BroadcastChannel('timetable_channel')
      } catch {
        broadcastRef.current = null
      }
    }
    broadcastRef.current?.postMessage({ type: 'TIMETABLE_UPDATED', payload: timetable })
  }, [timetable])

  // Listen for external updates (other tabs/windows or manual localStorage changes)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'timetable' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) {
            setTimetable(parsed)
          }
        } catch {}
      }
    }

    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel('timetable_channel')
      channel.onmessage = (msg) => {
        if (msg?.data?.type === 'TIMETABLE_UPDATED' && Array.isArray(msg.data.payload)) {
          setTimetable(msg.data.payload)
        }
      }
    } catch {
      channel = null
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      if (channel) channel.close()
    }
  }, [])

  // Fallback: poll localStorage for changes if events/broadcasts don't fire (e.g., file://, some browsers)
  useEffect(() => {
    const interval = window.setInterval(() => {
      try {
        const stored = localStorage.getItem('timetable') || ''
        if (stored && stored !== lastStoredRef.current) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            lastStoredRef.current = stored
            setTimetable(parsed)
          }
        }
      } catch {}
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  if (currentView === 'login') {
    return (
      <LoginPage
        onHODLogin={() => setCurrentView('hod')}
        onTeacherLogin={() => setCurrentView('teacher')}
        onStudentLogin={() => setCurrentView('student')}
      />
    )
  }

  return (
    <>
      <div style={{ display: currentView === 'student' ? 'block' : 'none' }}>
        <StudentDashboard timetable={timetable} />
      </div>
      <div style={{ display: currentView === 'hod' ? 'block' : 'none' }}>
        <HODDashboard timetable={timetable} setTimetable={setTimetable} />
      </div>
      <div style={{ display: currentView === 'teacher' ? 'block' : 'none' }}>
        <TeacherDashboard timetable={timetable} />
      </div>
    </>
  )
}


