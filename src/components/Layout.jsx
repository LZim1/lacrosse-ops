import { useEffect, useState } from 'react'
import { useMatch, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Layout({ children }) {
  const [profile, setProfile] = useState(null)
  const [program, setProgram] = useState(null)
  const navigate = useNavigate()

  const programMatch = useMatch('/programs/:programId/*')
  const programId = programMatch?.params?.programId

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('profiles').select('name, role, is_super_admin').eq('id', user.id).single()
      if (data) setProfile(data)
    }
    load()
  }, [])

  useEffect(() => {
    if (!programId) { setProgram(null); return }
    supabase.from('programs').select('name').eq('id', programId).single()
      .then(({ data }) => { if (data) setProgram(data) })
  }, [programId])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="font-bold text-gray-900 hover:text-blue-600 text-base">
            Lacrosse Ops
          </Link>

          {program && (
            <>
              <span className="text-gray-300 mx-1">/</span>
              <span className="font-semibold text-gray-700">{program.name}</span>
              <span className="text-gray-200 mx-2">|</span>
              <Link to={`/programs/${programId}`} className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link to={`/programs/${programId}/admin`} className="text-gray-600 hover:text-gray-900 ml-4">Admin</Link>
              <Link to={`/programs/${programId}/templates`} className="text-gray-600 hover:text-gray-900 ml-4">Templates</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {profile?.is_super_admin && (
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-700">
              All Programs
            </Link>
          )}
          <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-gray-800">
            Sign out
          </button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
