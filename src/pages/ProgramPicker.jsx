import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProgramPicker() {
  const [programs, setPrograms] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('profiles').select('is_super_admin').eq('id', user.id).single()

      const superAdmin = profile?.is_super_admin ?? false
      setIsSuperAdmin(superAdmin)

      if (superAdmin) {
        // Super admins see all programs
        const { data } = await supabase.from('programs').select('*').order('name')
        if (data) setPrograms(data)
      } else {
        // Others see only their programs
        const { data } = await supabase
          .from('program_members')
          .select('role, programs(id, name)')
          .eq('user_id', user.id)
          .order('programs(name)')
        if (data) {
          const mapped = data.map(m => ({ ...m.programs, memberRole: m.role }))
          // Auto-redirect if only one program
          if (mapped.length === 1) {
            navigate(`/programs/${mapped[0].id}`, { replace: true })
            return
          }
          setPrograms(mapped)
        }
      }

      setLoading(false)
    }
    load()
  }, [navigate])

  async function createProgram(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    const { data, error } = await supabase
      .from('programs').insert({ name: newName.trim() }).select().single()
    if (!error && data) {
      setPrograms(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setShowCreate(false)
    }
    setCreating(false)
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isSuperAdmin ? 'All programs across the organization' : 'Your assigned programs'}
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
          >
            + New Program
          </button>
        )}
      </div>

      {showCreate && (
        <form onSubmit={createProgram} className="bg-white border rounded-lg p-4 mb-6 flex gap-3">
          <input
            autoFocus
            required
            placeholder="Program name (e.g. Yeti, East Ave)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="text-sm text-gray-500 hover:text-gray-800 px-2"
          >
            Cancel
          </button>
        </form>
      )}

      {programs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No programs yet.</p>
          {isSuperAdmin && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Create your first program
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {programs.map(program => (
            <button
              key={program.id}
              onClick={() => navigate(`/programs/${program.id}`)}
              className="bg-white border rounded-lg p-5 text-left hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-gray-900 group-hover:text-blue-700">
                  {program.name}
                </span>
                {program.memberRole && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${program.memberRole === 'director' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {program.memberRole}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 group-hover:text-blue-400">
                Open program →
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
