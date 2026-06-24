export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getRequests, Status } from '../lib/store'
import { CATEGORY_LABELS, CATEGORY_STYLES, STATUS_STYLES, STATUS_LABELS } from '../ui/badges'
import StatusActions from './StatusActions'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const STATUS_ORDER: Status[] = ['pending', 'filled', 'shipped']

export default async function DistributorPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>
}) {
  const { status: filterStatus, category: filterCategory } = await searchParams
  const allRequests = await getRequests()

  const requests = allRequests.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false
    if (filterCategory && r.category !== filterCategory) return false
    return true
  })

  const counts = {
    all: allRequests.length,
    pending: allRequests.filter((r) => r.status === 'pending').length,
    filled: allRequests.filter((r) => r.status === 'filled').length,
    shipped: allRequests.filter((r) => r.status === 'shipped').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Home
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-semibold text-gray-900">Distributor Dashboard</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: counts.all, style: 'text-gray-900' },
            { label: 'Pending', value: counts.pending, style: 'text-amber-700' },
            { label: 'Filled', value: counts.filled, style: 'text-indigo-700' },
            { label: 'Shipped', value: counts.shipped, style: 'text-emerald-700' },
          ].map(({ label, value, style }) => (
            <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-center">
              <p className={`text-2xl font-bold ${style}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-600">Filter:</span>

          <div className="flex flex-wrap gap-2">
            {(['', 'pending', 'filled', 'shipped'] as const).map((s) => {
              const isActive = (filterStatus ?? '') === s
              const label = s === '' ? 'All statuses' : STATUS_LABELS[s]
              const params = new URLSearchParams()
              if (s) params.set('status', s)
              if (filterCategory) params.set('category', filterCategory)
              const href = `/distributor${params.toString() ? '?' + params.toString() : ''}`
              return (
                <Link
                  key={s}
                  href={href}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {(['', 'hvac', 'plumbing', 'automotive'] as const).map((c) => {
              const isActive = (filterCategory ?? '') === c
              const label = c === '' ? 'All categories' : CATEGORY_LABELS[c]
              const params = new URLSearchParams()
              if (filterStatus) params.set('status', filterStatus)
              if (c) params.set('category', c)
              const href = `/distributor${params.toString() ? '?' + params.toString() : ''}`
              return (
                <Link
                  key={c}
                  href={href}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Request list — grouped by status */}
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm text-gray-400">
            No requests match this filter.
          </div>
        ) : (
          <div className="space-y-8">
            {STATUS_ORDER.map((s) => {
              const group = requests.filter((r) => r.status === s)
              if (group.length === 0) return null
              return (
                <div key={s}>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {STATUS_LABELS[s]} · {group.length}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.map((req) => (
                      <div
                        key={req.id}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[req.category]}`}>
                              {CATEGORY_LABELS[req.category]}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[req.status]}`}>
                              {STATUS_LABELS[req.status]}
                            </span>
                          </div>
                          <span className="shrink-0 text-xs text-gray-400">{timeAgo(req.createdAt)}</span>
                        </div>

                        <div>
                          <p className="font-medium text-gray-900 leading-snug">{req.partName}</p>
                          <p className="text-sm text-gray-500 mt-0.5">Qty: {req.quantity}</p>
                          {req.notes && (
                            <p className="text-sm text-gray-500 mt-2 border-t border-gray-100 pt-2">{req.notes}</p>
                          )}
                        </div>

                        <StatusActions id={req.id} status={req.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
