import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MONTH_ORDER = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7]
const MONTH_NAMES = {
  1: 'January', 2: 'February', 3: 'March', 4: 'April',
  5: 'May', 6: 'June', 7: 'July', 8: 'August',
  9: 'September', 10: 'October', 11: 'November', 12: 'December',
}
const CATEGORIES = [
  'Communication', 'Scheduling', 'Gear & Uniforms', 'Facilities',
  'Registration & Tryouts', 'Travel & Events', 'TeamSnap & Volunteers', 'Admin',
]
const CATEGORY_COLORS = {
  'Communication': 'bg-blue-100 text-blue-700',
  'Scheduling': 'bg-purple-100 text-purple-700',
  'Gear & Uniforms': 'bg-orange-100 text-orange-700',
  'Facilities': 'bg-green-100 text-green-700',
  'Registration & Tryouts': 'bg-red-100 text-red-700',
  'Travel & Events': 'bg-yellow-100 text-yellow-800',
  'TeamSnap & Volunteers': 'bg-teal-100 text-teal-700',
  'Admin': 'bg-gray-100 text-gray-600',
}

function getDueDate(month, startYear) {
  const year = month >= 8 ? startYear : startYear + 1
  return `${year}-${String(month).padStart(2, '0')}-15`
}

export default function ProgramAdmin() {
  const { programId } = useParams()
  const currentYear = new Date().getFullYear()

  const [tab, setTab] = useState('library')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // Task library state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', category: '', month_trigger: 8 })
  const [addingTask, setAddingTask] = useState(false)

  // Season setup state
  const [startYear, setStartYear] = useState(currentYear)
  const [initializing, setInitializing] = useState(false)
  const [initMessage, setInitMessage] = useState(null)

  // Team state
  const [members, setMembers] = useState([])
  const [editingMember, setEditingMember] = useState(null)

  // Invite state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('staff')
  const [creatingInvite, setCreatingInvite] = useState(false)
  const [inviteLink, setInviteLink] = useState(null)

  useEffect(() => {
    loadTasks()
    loadTeam()
  }, [programId])

  async function loadTasks() {
    const { data } = await supabase.from('tasks').select('*').order('month_trigger')
    if (data) setTasks(data)
    setLoading(false)
  }

  async function loadTeam() {
    const { data: memberData } = await supabase
      .from('program_members').select('id, user_id, role').eq('program_id', programId)
    const { data: allProfiles } = await supabase.from('profiles').select('id, name').order('name')

    if (memberData && allProfiles) {
      const profileMap = Object.fromEntries(allProfiles.map(p => [p.id, p]))
      setMembers(memberData.map(m => ({ ...m, name: profileMap[m.user_id]?.name ?? m.user_id })))
    }
  }

  async function createInvite(e) {
    e.preventDefault()
    setCreatingInvite(true)
    setInviteLink(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('invites')
      .insert({ program_id: programId, role: inviteRole, email: inviteEmail || null, created_by: user.id })
      .select().single()
    if (!error && data) {
      setInviteLink(`${window.location.origin}/join?token=${data.token}`)
      setInviteEmail('')
    }
    setCreatingInvite(false)
  }

  async function handleAddTask(e) {
    e.preventDefault()
    setAddingTask(true)
    const { error } = await supabase.from('tasks').insert(newTask)
    if (!error) {
      await loadTasks()
      setNewTask({ title: '', description: '', category: '', month_trigger: 8 })
      setShowAddForm(false)
    }
    setAddingTask(false)
  }

  async function handleInitializeSeason() {
    setInitializing(true)
    setInitMessage(null)
    const { data: { user } } = await supabase.auth.getUser()

    const { data: existing } = await supabase
      .from('task_instances')
      .select('id')
      .eq('program_id', programId)
      .gte('due_date', `${startYear}-08-01`)
      .lte('due_date', `${startYear + 1}-07-31`)
      .limit(1)

    if (existing?.length > 0) {
      setInitMessage({ type: 'error', text: `The ${startYear}–${startYear + 1} season already has tasks for this program.` })
      setInitializing(false)
      return
    }

    const instances = tasks.map(task => ({
      task_id: task.id,
      assigned_to: user.id,
      due_date: getDueDate(task.month_trigger, startYear),
      status: 'pending',
      program_id: programId,
    }))

    const { error } = await supabase.from('task_instances').insert(instances)
    if (error) {
      setInitMessage({ type: 'error', text: 'Failed to initialize: ' + error.message })
    } else {
      setInitMessage({ type: 'success', text: `${instances.length} tasks created for the ${startYear}–${startYear + 1} season.` })
    }
    setInitializing(false)
  }

  async function addMember(e) {
    e.preventDefault()
    if (!addUserId) return
    setAddingMember(true)
    const { error } = await supabase.from('program_members').insert({
      program_id: programId,
      user_id: addUserId,
      role: addRole,
    })
    if (!error) {
      setAddUserId('')
      setAddRole('staff')
      await loadTeam()
    }
    setAddingMember(false)
  }

  async function updateMemberRole(memberId, role) {
    await supabase.from('program_members').update({ role }).eq('id', memberId)
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role } : m))
    setEditingMember(null)
  }

  async function removeMember(memberId) {
    await supabase.from('program_members').delete().eq('id', memberId)
    setMembers(prev => prev.filter(m => m.id !== memberId))
    await loadTeam()
  }

  const tasksByMonth = MONTH_ORDER.reduce((acc, month) => {
    acc[month] = tasks.filter(t => t.month_trigger === month)
    return acc
  }, {})

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex gap-2">
          {[['library', 'Task Library'], ['season', 'Season Setup'], ['team', 'Team']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded text-sm font-medium ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Library */}
      {tab === 'library' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{tasks.length} tasks in library</p>
            <button onClick={() => setShowAddForm(!showAddForm)}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
              + Add Task
            </button>
          </div>
          {showAddForm && (
            <form onSubmit={handleAddTask} className="bg-white border rounded-lg p-4 mb-6 space-y-3">
              <h3 className="font-medium text-sm">New Task</h3>
              <input required placeholder="Title" value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm" />
              <textarea placeholder="Description (optional)" value={newTask.description}
                onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm" rows={2} />
              <div className="flex gap-3">
                <select required value={newTask.category}
                  onChange={e => setNewTask(p => ({ ...p, category: e.target.value }))}
                  className="border rounded px-3 py-2 text-sm flex-1">
                  <option value="">Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newTask.month_trigger}
                  onChange={e => setNewTask(p => ({ ...p, month_trigger: parseInt(e.target.value) }))}
                  className="border rounded px-3 py-2 text-sm">
                  {MONTH_ORDER.map(m => <option key={m} value={m}>{MONTH_NAMES[m]}</option>)}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddForm(false)} className="text-sm text-gray-500 px-3 py-1.5">Cancel</button>
                <button type="submit" disabled={addingTask}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">
                  {addingTask ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          )}
          <div className="space-y-8">
            {MONTH_ORDER.map(month => {
              const monthTasks = tasksByMonth[month]
              if (!monthTasks?.length) return null
              return (
                <section key={month}>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                    {MONTH_NAMES[month]} <span className="font-normal text-gray-400">· {monthTasks.length} tasks</span>
                  </h2>
                  <div className="space-y-2">
                    {monthTasks.map(task => (
                      <div key={task.id} className="bg-white border rounded-lg px-4 py-3 flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm">{task.title}</span>
                          {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
                        </div>
                        {task.category && (
                          <span className={`text-xs px-2 py-0.5 rounded shrink-0 mt-0.5 ${CATEGORY_COLORS[task.category] || 'bg-gray-100 text-gray-600'}`}>
                            {task.category}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      )}

      {/* Season Setup */}
      {tab === 'season' && (
        <div className="max-w-lg">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-1">Initialize a Season</h2>
            <p className="text-sm text-gray-500 mb-5">
              Creates one task instance for every task in the library, scoped to this program and pre-dated to the right month.
            </p>
            <div className="flex items-end gap-4 mb-5">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Season</label>
                <select value={startYear}
                  onChange={e => { setStartYear(parseInt(e.target.value)); setInitMessage(null) }}
                  className="border rounded px-3 py-2 text-sm">
                  {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => (
                    <option key={y} value={y}>{y}–{y + 1}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-400 mb-2">{tasks.length} tasks will be created</p>
            </div>
            <button onClick={handleInitializeSeason} disabled={initializing || tasks.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {initializing ? 'Initializing...' : `Initialize ${startYear}–${startYear + 1} Season`}
            </button>
            {initMessage && (
              <p className={`mt-4 text-sm ${initMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {initMessage.text}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Team */}
      {tab === 'team' && (
        <div className="max-w-xl">
          {/* Invite form */}
          <div className="bg-white border rounded-lg p-5 mb-6">
            <h2 className="font-semibold mb-1">Invite a team member</h2>
            <p className="text-sm text-gray-500 mb-4">
              Generate an invite link and share it however you'd like — email, Slack, text.
              They'll set up their own account and be added to this program automatically.
            </p>
            <form onSubmit={createInvite} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Their email (optional)</label>
                <input
                  type="email"
                  placeholder="Pre-fill their email on the signup form"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                  className="border rounded px-3 py-2 text-sm">
                  <option value="staff">Staff</option>
                  <option value="director">Director</option>
                </select>
              </div>
              <button type="submit" disabled={creatingInvite}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {creatingInvite ? 'Creating...' : 'Generate link'}
              </button>
            </form>

            {inviteLink && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-medium mb-2">Invite link ready — share this:</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={inviteLink}
                    className="flex-1 text-xs bg-white border rounded px-2 py-1.5 text-gray-700 font-mono"
                    onFocus={e => e.target.select()}
                  />
                  <button
                    onClick={() => { navigator.clipboard.writeText(inviteLink); }}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-green-600 mt-2">Link expires when used. Generate a new one for each person.</p>
              </div>
            )}
          </div>

          {/* Current members */}
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Current members · {members.length}
          </h2>
          <div className="space-y-2">
            {members.length === 0 && <p className="text-sm text-gray-400">No members yet.</p>}
            {members.map(member => (
              <div key={member.id} className="bg-white border rounded-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">{member.name}</span>
                  {editingMember === member.id ? (
                    <select defaultValue={member.role}
                      onChange={e => updateMemberRole(member.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs">
                      <option value="staff">Staff</option>
                      <option value="director">Director</option>
                    </select>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${member.role === 'director' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {member.role}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {editingMember === member.id
                    ? <button onClick={() => setEditingMember(null)} className="text-xs text-gray-400 hover:text-gray-700">Cancel</button>
                    : <button onClick={() => setEditingMember(member.id)} className="text-xs text-gray-400 hover:text-gray-700">Edit role</button>
                  }
                  <button onClick={() => removeMember(member.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
