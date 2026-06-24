export const dynamic = 'force-dynamic'

import { getRequests, Status } from '../lib/store'
import { CATEGORY_LABELS, CATEGORY_STYLES, STATUS_STYLES, STATUS_LABELS } from '../ui/badges'
import RequestForm from '../contractor/RequestForm'
import StatusActions from '../distributor/StatusActions'
import DeleteButton from '../contractor/DeleteButton'
import RealtimeUpdater from '../ui/RealtimeUpdater'
import Link from 'next/link'

const STATUS_ORDER: Status[] = ['pending', 'filled', 'shipped']

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>
}) {
  const { status: filterStatus, category: filterCategory } = await searchParams
  const allRequests = await getRequests()

  const filtered = allRequests.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false
    if (filterCategory && r.category !== filterCategory) return false
    return true
  })

  const counts = {
    pending: allRequests.filter((r) => r.status === 'pending').length,
    filled: allRequests.filter((r) => r.status === 'filled').length,
    shipped: allRequests.filter((r) => r.status === 'shipped').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <RealtimeUpdater />

      <header className="border-b border-gray-200 bg-white shrink-0">
        <div className="mx-auto max-w-screen-xl px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Home
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Parts Request Board</h1>
          <span className="text-gray-300 text-sm">·</span>
          <span className="text-sm text-gray-500">HVAC · Plumbing · Automotive</span>
        </div>
      </header>

      <div className="flex flex-1 mx-auto w-full max-w-screen-xl divide-x divide-gray-200">

        {/* ── LEFT: Contractor ── */}
        <section className="flex flex-col w-[420px] shrink-0">
          <div className="border-b border-gray-200 bg-white px-6 py-3 flex items-center gap-2">
            <span className="text-base">🔧</span>
            <h2 className="text-sm font-semibold text-gray-900">Contractor</h2>
            <span className="ml-auto text-xs text-gray-400">{allRequests.length} request{allRequests.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="border-b border-gray-200 bg-white px-6 py-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">New Request</p>
              <RequestForm />
            </div>

            <div className="flex-1 px-4 py-4 space-y-3">
              {allRequests.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
                  No requests yet.
                </div>
              )}
              {allRequests.map((req) => (
                <div key={req.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[req.category]}`}>
                      {CATEGORY_LABELS[req.category]}
                    </span>
                    <div className="flex items-start gap-2 shrink-0">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[req.status]}`}>
                        {STATUS_LABELS[req.status]}
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400" title={`Last updated: ${new Date(req.updatedAt).toLocaleString()}`}>Up: {timeAgo(req.updatedAt)}</span>
                        <span className="text-xs text-gray-400" title={`Created: ${new Date(req.createdAt).toLocaleString()}`}>Cr: {timeAgo(req.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{req.partName}</p>
                  <p className="text-xs text-gray-500">Qty: {req.quantity}</p>
                  {req.notes && <p className="text-xs text-gray-400 border-t border-gray-100 pt-2">{req.notes}</p>}
                  <div className="pt-1">
                    <DeleteButton id={req.id} status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RIGHT: Distributor ── */}
        <section className="flex flex-col flex-1 min-w-0">
          <div className="border-b border-gray-200 bg-white px-6 py-3 flex items-center gap-2">
            <span className="text-base">📦</span>
            <h2 className="text-sm font-semibold text-gray-900">Distributor</h2>
            <div className="ml-4 flex gap-2">
              {[
                { label: 'Pending', count: counts.pending, style: 'bg-amber-100 text-amber-700' },
                { label: 'Filled', count: counts.filled, style: 'bg-indigo-100 text-indigo-700' },
                { label: 'Shipped', count: counts.shipped, style: 'bg-emerald-100 text-emerald-700' },
              ].map(({ label, count, style }) => (
                <span key={label} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
                  {count} {label}
                </span>
              ))}
            </div>
          </div>

          <div className="border-b border-gray-100 bg-white px-6 py-2.5 flex flex-wrap gap-2 items-center">
            {(['', 'pending', 'filled', 'shipped'] as const).map((s) => {
              const isActive = (filterStatus ?? '') === s
              const params = new URLSearchParams()
              if (s) params.set('status', s)
              if (filterCategory) params.set('category', filterCategory)
              return (
                <Link key={s} href={`/board${params.toString() ? '?' + params : ''}`}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${isActive ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>
                  {s === '' ? 'All' : STATUS_LABELS[s as Status]}
                </Link>
              )
            })}
            <span className="text-gray-200">|</span>
            {(['', 'hvac', 'plumbing', 'automotive'] as const).map((c) => {
              const isActive = (filterCategory ?? '') === c
              const params = new URLSearchParams()
              if (filterStatus) params.set('status', filterStatus)
              if (c) params.set('category', c)
              return (
                <Link key={c} href={`/board${params.toString() ? '?' + params : ''}`}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${isActive ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>
                  {c === '' ? 'All categories' : CATEGORY_LABELS[c]}
                </Link>
              )
            })}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400">
                No requests match this filter.
              </div>
            )}
            {STATUS_ORDER.map((s) => {
              const group = filtered.filter((r) => r.status === s)
              if (group.length === 0) return null
              return (
                <div key={s}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    {STATUS_LABELS[s]} · {group.length}
                  </p>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    {group.map((req) => (
                      <div key={req.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[req.category]}`}>
                            {CATEGORY_LABELS[req.category]}
                          </span>
                          <div className="flex items-start gap-2 shrink-0">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[req.status]}`}>
                              {STATUS_LABELS[req.status]}
                            </span>
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-400" title={`Last updated: ${new Date(req.updatedAt).toLocaleString()}`}>Up: {timeAgo(req.updatedAt)}</span>
                              <span className="text-xs text-gray-400" title={`Created: ${new Date(req.createdAt).toLocaleString()}`}>Cr: {timeAgo(req.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 leading-snug">{req.partName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Qty: {req.quantity}</p>
                          {req.notes && <p className="text-xs text-gray-400 border-t border-gray-100 pt-2 mt-2">{req.notes}</p>}
                        </div>
                        <StatusActions id={req.id} status={req.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
