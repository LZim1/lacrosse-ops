import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SuperAdmin() {
  const [programs, setPrograms] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [directorId, setDirectorId] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const [{ data: programData }, { data: profileData }] = await Promise.all([
        supabase.from('programs').select('id, name, created_at').order('name'),
        supabase.from('profiles').select('id, name, is_super_admin').order('name'),
      ])
      if (programData) setPrograms(programData)
      if (profileData) setProfiles(profileData)
      setLoading(false)
    }
    load()
  }, [])

  async function createProgram(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)

    const { data: program, error } = await supabase
      .from('programs').insert({ name: newName.trim() }).select().single()

    if (!error && program) {
      if (directorId) {
        await supabase.from('program_members').insert({
          program_id: program.id,
          user_id: directorId,
          role: 'director',
        })
      }
      setPrograms(prev => [...prev, program].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setDirectorId('')
      setShowCreate(false)
    }
    setCreating(false)
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">All Programs</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
        >
          + New Program
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-8">Company-wide view. All programs across the organization.</p>

      {showCreate && (
        <form onSubmit={createProgram} className="bg-white border rounded-lg p-5 mb-6 space-y-4">
          <h2 className="font-semibold">New Program</h2>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Program name</label>
            <input
              autoFocus
              required
              placeholder="e.g. Yeti, East Ave, TI National"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Assign a director (optional)</label>
            <select value={directorId} onChange={e => setDirectorId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm">
              <option value="">— Choose a director —</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}{p.is_super_admin ? ' (super admin)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={creating}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {creating ? 'Creating...' : 'Create Program'}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-sm text-gray-500 px-3 py-2 hover:text-gray-800">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map(program => (
          <button
            key={program.id}
            onClick={() => navigate(`/programs/${program.id}`)}
            className="bg-white border rounded-lg p-5 text-left hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <span className="font-semibold text-gray-900 group-hover:text-blue-700 block mb-3">
              {program.name}
            </span>
            <p className="text-xs text-gray-400 group-hover:text-blue-400">
              Open program →
            </p>
          </button>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p>No programs yet. Create your first one.</p>
        </div>
      )}
    </div>
  )
}
