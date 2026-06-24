export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getRequests } from '../lib/store'
import { CATEGORY_LABELS, CATEGORY_STYLES, STATUS_STYLES, STATUS_LABELS } from '../ui/badges'
import RequestForm from './RequestForm'
import DeleteButton from './DeleteButton'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default async function ContractorPage() {
  const requests = await getRequests()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Home
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-semibold text-gray-900">Contractor Portal</h1>
          <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {requests.length} request{requests.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-5">New Part Request</h2>
            <RequestForm />
          </div>
        </aside>

        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-gray-700">Your Requests</h2>

          {requests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-400">
              No requests yet. Submit your first one →
            </div>
          )}

          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[req.category]}`}>
                  {CATEGORY_LABELS[req.category]}
                </span>
                <div className="flex items-start gap-2 shrink-0">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[req.status]}`}>
                    {STATUS_LABELS[req.status]}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400" title={`Last updated: ${new Date(req.updatedAt).toLocaleString()}`}>Up: {timeAgo(req.updatedAt)}</span>
                    <span className="text-xs text-gray-400" title={`Created: ${new Date(req.createdAt).toLocaleString()}`}>Cr: {timeAgo(req.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-900">{req.partName}</p>
                <p className="text-sm text-gray-500 mt-0.5">Qty: {req.quantity}</p>
              </div>

              {req.notes && (
                <p className="text-sm text-gray-500 border-t border-gray-100 pt-3">{req.notes}</p>
              )}
              <div>
                <DeleteButton id={req.id} status={req.status} />
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
