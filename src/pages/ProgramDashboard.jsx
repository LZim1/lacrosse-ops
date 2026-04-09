import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MONTH_ORDER = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7]
const MONTH_NAMES = {
  1: 'January', 2: 'February', 3: 'March', 4: 'April',
  5: 'May', 6: 'June', 7: 'July', 8: 'August',
  9: 'September', 10: 'October', 11: 'November', 12: 'December',
}
const STATUS_LABELS = { pending: 'Pending', in_progress: 'In Progress', complete: 'Complete' }
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  complete: 'bg-green-100 text-green-800',
}

function getCurrentSeasonStart() {
  const now = new Date()
  return now.getMonth() + 1 >= 8 ? now.getFullYear() : now.getFullYear() - 1
}

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr + 'T12:00:00') - new Date()) / (1000 * 60 * 60 * 24))
}

function DueBadge({ dueDate }) {
  const days = daysUntil(dueDate)
  if (days < 0) return <span className="text-xs text-red-600 font-medium">Overdue</span>
  if (days === 0) return <span className="text-xs text-red-500 font-medium">Due today</span>
  if (days <= 7) return <span className="text-xs text-orange-500 font-medium">Due in {days}d</span>
  return <span className="text-xs text-gray-400">Due {new Date(dueDate + 'T12:00:00').toLocaleDateString()}</span>
}

function TaskDetailModal({ task, profiles, isDirector, onClose, onUpdate }) {
  const [notes, setNotes] = useState(task.notes || '')
  const [status, setStatus] = useState(task.status)
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    setSaving(true)
    const updates = { notes, status, assigned_to: assignedTo || null }
    await supabase.from('task_instances').update(updates).eq('id', task.id)
    onUpdate(task.id, updates)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg leading-snug">{task.tasks?.title}</h2>
              {task.tasks?.category && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">{task.tasks.category}</span>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none mt-0.5">×</button>
          </div>
          {task.tasks?.description && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{task.tasks.description}</p>
          )}
          <div className="mt-2"><DueBadge dueDate={task.due_date} /></div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            {isDirector && profiles.length > 0 && (
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Assigned to</label>
                <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">Unassigned</option>
                  {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Notes / Show your work</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={6}
              placeholder="Paste links, email drafts, notes on what was done, who was contacted, etc."
              className="w-full border rounded px-3 py-2 text-sm resize-y leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            <button onClick={save} disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProgramDashboard() {
  const { programId } = useParams()
  const seasonStart = getCurrentSeasonStart()

  const [tab, setTab] = useState('mine')
  const [memberRole, setMemberRole] = useState(null)
  const [myInstances, setMyInstances] = useState([])
  const [seasonInstances, setSeasonInstances] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [teamMemberFilter, setTeamMemberFilter] = useState(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: membership } = await supabase
        .from('program_members')
        .select('role')
        .eq('program_id', programId)
        .eq('user_id', user.id)
        .single()
      const role = membership?.role ?? null

      const { data: profileData } = await supabase
        .from('profiles').select('is_super_admin').eq('id', user.id).single()
      const isDirector = role === 'director' || profileData?.is_super_admin

      setMemberRole(isDirector ? 'director' : role)

      const { data: myData } = await supabase
        .from('task_instances')
        .select('*, tasks(title, description, category)')
        .eq('program_id', programId)
        .eq('assigned_to', user.id)
        .neq('status', 'complete')
        .order('due_date', { ascending: true })
      if (myData) setMyInstances(myData)

      if (isDirector) {
        const { data: seasonData } = await supabase
          .from('task_instances')
          .select('*, tasks(title, description, category)')
          .eq('program_id', programId)
          .gte('due_date', `${seasonStart}-08-01`)
          .lte('due_date', `${seasonStart + 1}-07-31`)
          .order('due_date', { ascending: true })
        if (seasonData) setSeasonInstances(seasonData)

        const { data: members } = await supabase
          .from('program_members')
          .select('user_id, profiles(id, name)')
          .eq('program_id', programId)
        if (members) setProfiles(members.map(m => m.profiles).filter(Boolean))
      }

      setLoading(false)
    }
    load()
  }, [programId, seasonStart])

  function applyUpdate(id, updates) {
    const apply = prev => prev.map(i => i.id === id ? { ...i, ...updates } : i)
    setMyInstances(prev => {
      const updated = apply(prev)
      // Remove from my tasks if reassigned away or completed
      return updated.filter(i => i.id !== id || (i.status !== 'complete'))
    })
    setSeasonInstances(apply)
    if (selectedTask?.id === id) setSelectedTask(prev => ({ ...prev, ...updates }))
  }

  async function updateStatus(id, status) {
    await supabase.from('task_instances').update({ status }).eq('id', id)
    applyUpdate(id, { status })
  }

  async function reassignTask(id, userId) {
    await supabase.from('task_instances').update({ assigned_to: userId }).eq('id', id)
    applyUpdate(id, { assigned_to: userId })
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  const overdue = myInstances.filter(i => daysUntil(i.due_date) < 0)
  const upcoming = myInstances.filter(i => daysUntil(i.due_date) >= 0)

  const categories = [...new Set(seasonInstances.map(i => i.tasks?.category).filter(Boolean))].sort()
  const filtered = categoryFilter ? seasonInstances.filter(i => i.tasks?.category === categoryFilter) : seasonInstances
  const groupedByMonth = MONTH_ORDER.reduce((acc, month) => {
    acc[month] = filtered.filter(i => new Date(i.due_date + 'T12:00:00').getMonth() + 1 === month)
    return acc
  }, {})
  const stats = {
    total: seasonInstances.length,
    complete: seasonInstances.filter(i => i.status === 'complete').length,
    inProgress: seasonInstances.filter(i => i.status === 'in_progress').length,
    pending: seasonInstances.filter(i => i.status === 'pending').length,
  }

  // Team view: group tasks by member
  const teamTasks = teamMemberFilter
    ? seasonInstances.filter(i => i.assigned_to === teamMemberFilter)
    : seasonInstances
  const memberTaskCounts = profiles.map(p => ({
    ...p,
    total: seasonInstances.filter(i => i.assigned_to === p.id).length,
    complete: seasonInstances.filter(i => i.assigned_to === p.id && i.status === 'complete').length,
    inProgress: seasonInstances.filter(i => i.assigned_to === p.id && i.status === 'in_progress').length,
  }))

  const tabs = [['mine', 'My Tasks'], ['season', 'Season Overview']]
  if (memberRole === 'director') tabs.push(['team', 'Team'])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {tab === 'mine' ? 'My Tasks' : tab === 'season' ? `${seasonStart}–${seasonStart + 1} Season` : 'Team'}
        </h1>
        {memberRole === 'director' && (
          <div className="flex gap-2">
            {tabs.map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded text-sm font-medium ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === 'mine' && (
        <div>
          {myInstances.length === 0 && <p className="text-gray-400">No open tasks. You're all caught up.</p>}
          {overdue.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3">Overdue</h2>
              <TaskList items={overdue} onStatusChange={updateStatus} onSelect={setSelectedTask} />
            </section>
          )}
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming</h2>
              <TaskList items={upcoming} onStatusChange={updateStatus} onSelect={setSelectedTask} />
            </section>
          )}
        </div>
      )}

      {tab === 'season' && (
        <div>
          {seasonInstances.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="mb-2">No tasks for this season yet.</p>
              <p className="text-sm">Go to Admin → Season Setup to initialize the {seasonStart}–{seasonStart + 1} season.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[['Total', stats.total, 'text-gray-700'], ['Complete', stats.complete, 'text-green-600'], ['In Progress', stats.inProgress, 'text-blue-600'], ['Pending', stats.pending, 'text-yellow-600']].map(([label, value, color]) => (
                  <div key={label} className="bg-white border rounded-lg px-4 py-3 text-center">
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mb-5">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Season progress</span>
                  <span>{Math.round((stats.complete / stats.total) * 100)}% complete</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(stats.complete / stats.total) * 100}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => setCategoryFilter(null)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!categoryFilter ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}>All</button>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${categoryFilter === cat ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="space-y-8">
                {MONTH_ORDER.map(month => {
                  const monthTasks = groupedByMonth[month]
                  if (!monthTasks?.length) return null
                  const monthComplete = monthTasks.filter(i => i.status === 'complete').length
                  const isCurrentMonth = new Date().getMonth() + 1 === month
                  return (
                    <section key={month}>
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className={`text-xs font-semibold uppercase tracking-widest ${isCurrentMonth ? 'text-blue-600' : 'text-gray-500'}`}>
                          {MONTH_NAMES[month]}
                          {isCurrentMonth && <span className="ml-2 normal-case tracking-normal font-medium text-blue-400">← current</span>}
                        </h2>
                        <span className="text-xs text-gray-400">{monthComplete}/{monthTasks.length} complete</span>
                      </div>
                      <div className="space-y-2">
                        {monthTasks.map(item => (
                          <div key={item.id}
                            onClick={() => setSelectedTask(item)}
                            className={`bg-white border rounded-lg px-4 py-3 flex items-start gap-4 transition-opacity cursor-pointer hover:border-blue-300 hover:shadow-sm ${item.status === 'complete' ? 'opacity-50' : ''}`}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-medium text-sm ${item.status === 'complete' ? 'line-through text-gray-400' : ''}`}>{item.tasks?.title}</span>
                                {item.tasks?.category && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.tasks.category}</span>}
                                {item.notes && <span className="text-xs text-blue-400">has notes</span>}
                              </div>
                              {item.tasks?.description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.tasks.description}</p>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                              {profiles.length > 0 && (
                                <select value={item.assigned_to || ''} onChange={e => reassignTask(item.id, e.target.value)}
                                  className="text-xs border rounded px-2 py-1 text-gray-600 max-w-[130px]">
                                  <option value="" disabled>Unassigned</option>
                                  {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>{STATUS_LABELS[item.status]}</span>
                              <select value={item.status} onChange={e => updateStatus(item.id, e.target.value)} className="text-sm border rounded px-2 py-1">
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="complete">Complete</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'team' && (
        <div>
          {seasonInstances.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p>No season tasks yet. Initialize the season first under Admin.</p>
            </div>
          ) : (
            <>
              {/* Member filter bar */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => setTeamMemberFilter(null)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!teamMemberFilter ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                  All members
                </button>
                {memberTaskCounts.map(m => (
                  <button key={m.id} onClick={() => setTeamMemberFilter(teamMemberFilter === m.id ? null : m.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${teamMemberFilter === m.id ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                    {m.name}
                    {m.total > 0 && <span className="ml-1 opacity-60">{m.complete}/{m.total}</span>}
                  </button>
                ))}
              </div>

              {/* If viewing all, group by member */}
              {!teamMemberFilter ? (
                <div className="space-y-8">
                  {memberTaskCounts.filter(m => m.total > 0).map(member => {
                    const memberTasks = seasonInstances.filter(i => i.assigned_to === member.id)
                    const open = memberTasks.filter(i => i.status !== 'complete')
                    const done = memberTasks.filter(i => i.status === 'complete')
                    return (
                      <section key={member.id}>
                        <div className="flex items-center gap-3 mb-3">
                          <h2 className="text-sm font-semibold text-gray-700">{member.name}</h2>
                          <span className="text-xs text-gray-400">{member.complete}/{member.total} complete</span>
                          {member.inProgress > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{member.inProgress} in progress</span>}
                        </div>
                        <div className="space-y-2">
                          {open.map(item => (
                            <TeamTaskRow key={item.id} item={item} profiles={profiles} onSelect={setSelectedTask} onStatusChange={updateStatus} onReassign={reassignTask} />
                          ))}
                          {done.map(item => (
                            <TeamTaskRow key={item.id} item={item} profiles={profiles} onSelect={setSelectedTask} onStatusChange={updateStatus} onReassign={reassignTask} />
                          ))}
                        </div>
                      </section>
                    )
                  })}
                  {memberTaskCounts.every(m => m.total === 0) && (
                    <p className="text-gray-400 text-center py-12">No tasks are assigned yet. Use Season Overview to assign tasks to team members.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {teamTasks.length === 0 && <p className="text-gray-400">No tasks assigned to this person.</p>}
                  {teamTasks.map(item => (
                    <TeamTaskRow key={item.id} item={item} profiles={profiles} onSelect={setSelectedTask} onStatusChange={updateStatus} onReassign={reassignTask} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          profiles={profiles}
          isDirector={memberRole === 'director'}
          onClose={() => setSelectedTask(null)}
          onUpdate={applyUpdate}
        />
      )}
    </div>
  )
}

function TeamTaskRow({ item, profiles, onSelect, onStatusChange, onReassign }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`bg-white border rounded-lg px-4 py-3 flex items-start gap-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all ${item.status === 'complete' ? 'opacity-50' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium text-sm ${item.status === 'complete' ? 'line-through text-gray-400' : ''}`}>{item.tasks?.title}</span>
          {item.tasks?.category && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.tasks.category}</span>}
          {item.notes && <span className="text-xs text-blue-400">has notes</span>}
        </div>
        <div className="mt-1"><DueBadge dueDate={item.due_date} /></div>
      </div>
      <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
        {profiles.length > 0 && (
          <select value={item.assigned_to || ''} onChange={e => onReassign(item.id, e.target.value)}
            className="text-xs border rounded px-2 py-1 text-gray-600 max-w-[130px]">
            <option value="">Unassigned</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>{STATUS_LABELS[item.status]}</span>
        <select value={item.status} onChange={e => onStatusChange(item.id, e.target.value)} className="text-sm border rounded px-2 py-1">
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>
      </div>
    </div>
  )
}

function TaskList({ items, onStatusChange, onSelect }) {
  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id}
          onClick={() => onSelect(item)}
          className="bg-white rounded-lg border p-4 flex items-start gap-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{item.tasks?.title}</span>
              {item.tasks?.category && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.tasks.category}</span>}
              {item.notes && <span className="text-xs text-blue-400">has notes</span>}
            </div>
            {item.tasks?.description && <p className="text-sm text-gray-500 mt-1">{item.tasks.description}</p>}
            <div className="mt-2"><DueBadge dueDate={item.due_date} /></div>
          </div>
          <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>{STATUS_LABELS[item.status]}</span>
            <select value={item.status} onChange={e => onStatusChange(item.id, e.target.value)} className="text-sm border rounded px-2 py-1">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="complete">Complete</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}
