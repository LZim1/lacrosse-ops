import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Layout from './components/Layout'
import Login from './pages/Login'
import AcceptInvite from './pages/AcceptInvite'
import ProgramPicker from './pages/ProgramPicker'
import ProgramDashboard from './pages/ProgramDashboard'
import ProgramAdmin from './pages/ProgramAdmin'
import SuperAdmin from './pages/SuperAdmin'
import Templates from './pages/Templates'

function AuthenticatedApp() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProgramPicker />} />
        <Route path="/programs/:programId" element={<ProgramDashboard />} />
        <Route path="/programs/:programId/admin" element={<ProgramAdmin />} />
        <Route path="/programs/:programId/templates" element={<Templates />} />
        <Route path="/super-admin" element={<SuperAdmin />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/join" element={<AcceptInvite />} />
        <Route path="/*" element={session ? <AuthenticatedApp /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
