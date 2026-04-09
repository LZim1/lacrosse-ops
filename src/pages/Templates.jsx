import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORY_ORDER = [
  'Season Launch',
  'Weekly Operations',
  'Gear & Store',
  'Travel & Events',
  'Registration & Tryouts',
  'New Families',
  'Policy',
  'Season Close',
]

function HighlightedText({ text }) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <mark key={i} className="bg-yellow-100 text-yellow-800 rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('sort_order', { ascending: true })
      if (!error && data) {
        setTemplates(data)
        if (data.length > 0) setSelected(data[0])
      }
      setLoading(false)
    }
    load()
  }, [])

  const categories = [...new Set(templates.map(t => t.category).filter(Boolean))]
    .sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b))

  const filtered = templates.filter(t => {
    const matchesSearch = !search ||
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.body?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || t.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = filtered.filter(t => t.category === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Left panel — template list */}
      <div className="w-72 shrink-0 border-r bg-white flex flex-col">
        <div className="p-3 border-b">
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {categories.length > 1 && (
          <div className="px-3 py-2 border-b flex flex-wrap gap-1">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`text-xs px-2 py-1 rounded-full border ${!categoryFilter ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                className={`text-xs px-2 py-1 rounded-full border ${categoryFilter === cat ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-y-auto flex-1">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 border-b">
                {cat}
              </div>
              {items.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelected(template)}
                  className={`w-full text-left px-4 py-3 border-b text-sm hover:bg-gray-50 transition-colors ${selected?.id === template.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}
                >
                  <div className={`font-medium ${selected?.id === template.id ? 'text-blue-700' : 'text-gray-800'}`}>
                    {template.name}
                  </div>
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="p-4 text-sm text-gray-400">No templates match your search.</p>
          )}
        </div>
      </div>

      {/* Right panel — template detail */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {selected ? (
          <div className="max-w-2xl mx-auto p-8">
            <div className="flex items-start justify-between mb-1">
              <h1 className="text-xl font-bold text-gray-900">{selected.name}</h1>
              {selected.category && (
                <span className="text-xs bg-white border text-gray-500 px-2 py-1 rounded shrink-0 ml-4 mt-1">
                  {selected.category}
                </span>
              )}
            </div>

            {/* Subject line */}
            <div className="bg-white border rounded-lg p-4 mb-4 mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</span>
                <CopyButton text={selected.subject} label="Copy subject" />
              </div>
              <p className="text-sm text-gray-800">
                <HighlightedText text={selected.subject} />
              </p>
            </div>

            {/* Body */}
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Body</span>
                <CopyButton text={selected.body} label="Copy body" />
              </div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                <HighlightedText text={selected.body} />
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Highlighted fields like <mark className="bg-yellow-100 text-yellow-800 px-1 rounded">[this]</mark> need to be filled in before sending.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Select a template to view it.
          </div>
        )}
      </div>
    </div>
  )
}
