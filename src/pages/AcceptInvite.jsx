import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AcceptInvite() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [invite, setInvite] = useState(null)
  const [programName, setProgramName] = useState('')
  const [status, setStatus] = useState('loading') // loading | ready | submitting | done | error
  const [errorMsg, setErrorMsg] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    async function load() {
      if (!token) { setStatus('error'); setErrorMsg('No invite token found in this link.'); return }

      // Check for existing session — if already logged in, just add them to the program
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: inviteData } = await supabase
          .from('invites').select('*, programs(name)').eq('token', token).single()
        if (!inviteData) { setStatus('error'); setErrorMsg('Invalid invite link.'); return }
        if (inviteData.accepted_at) { setStatus('error'); setErrorMsg('This invite has already been used.'); return }

        await supabase.from('program_members').insert({
          program_id: inviteData.program_id, user_id: session.user.id, role: inviteData.role,
        })
        await supabase.from('invites').update({ accepted_at: new Date().toISOString() }).eq('id', inviteData.id)
        navigate(`/programs/${inviteData.program_id}`, { replace: true })
        return
      }

      const { data, error } = await supabase
        .from('invites').select('*, programs(name)').eq('token', token).single()

      if (error || !data) { setStatus('error'); setErrorMsg('Invalid invite link.'); return }
      if (data.accepted_at) { setStatus('error'); setErrorMsg('This invite has already been used.'); return }

      setInvite(data)
      setProgramName(data.programs?.name ?? 'this program')
      if (data.email) setEmail(data.email)
      setStatus('ready')
    }
    load()
  }, [token, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setStatus('ready')
      setErrorMsg(signUpError.message)
      return
    }

    const userId = signUpData.user?.id
    if (!userId) {
      setStatus('ready')
      setErrorMsg('Something went wrong during signup. Please try again.')
      return
    }

    // Set their name on the profile (trigger creates it with email as name)
    await supabase.from('profiles').update({ name: name.trim() || email }).eq('id', userId)

    // Add to the program
    await supabase.from('program_members').insert({
      program_id: invite.program_id,
      user_id: userId,
      role: invite.role,
    })

    // Mark invite used
    await supabase.from('invites').update({ accepted_at: new Date().toISOString() }).eq('id', invite.id)

    // If email confirmation is disabled, we'll have a session — sign in and redirect
    if (signUpData.session) {
      navigate(`/programs/${invite.program_id}`, { replace: true })
    } else {
      // Email confirmation is enabled — tell them to check their email
      setStatus('confirm_email')
    }
  }

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">
      Loading...
    </div>
  )

  if (status === 'error') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow text-center max-w-sm w-full">
        <p className="text-gray-700 font-medium mb-2">Unable to accept invite</p>
        <p className="text-sm text-gray-500">{errorMsg}</p>
      </div>
    </div>
  )

  if (status === 'confirm_email') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow text-center max-w-sm w-full">
        <p className="text-gray-700 font-medium mb-2">Check your email</p>
        <p className="text-sm text-gray-500">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then log in.
        </p>
        <a href="/login" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Go to login
        </a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">You've been invited</h1>
          <p className="text-sm text-gray-500 mt-1">
            Set up your account to join <span className="font-medium text-gray-700">{programName}</span>
            {invite?.role === 'director' && <span className="ml-1 text-xs text-purple-600">(Director)</span>}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Your name</label>
            <input
              required
              type="text"
              placeholder="First and last name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              readOnly={!!invite?.email}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Password</label>
            <input
              required
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'submitting' ? 'Setting up your account...' : 'Create account and join'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  )
}
