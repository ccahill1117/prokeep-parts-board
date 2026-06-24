'use client'

import { useActionState } from 'react'
import { updateStatus } from '../actions'
import { Status } from '../lib/store'

const TRANSITIONS: Record<Status, { label: string; next: Status }[]> = {
  pending: [{ label: 'Mark Filled', next: 'filled' }],
  filled: [{ label: 'Mark Shipped', next: 'shipped' }, { label: 'Back to Pending', next: 'pending' }],
  shipped: [{ label: 'Back to Filled', next: 'filled' }],
}

const BUTTON_STYLES: Record<string, string> = {
  filled: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  shipped: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  pending: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
}

export default function StatusActions({ id, status }: { id: string; status: Status }) {
  const [, action, pending] = useActionState(async (_prev: null, formData: FormData) => {
    await updateStatus(formData)
    return null
  }, null)

  const transitions = TRANSITIONS[status]

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map(({ label, next }) => (
        <form key={next} action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={next} />
          <button
            type="submit"
            disabled={pending}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${BUTTON_STYLES[next]}`}
          >
            {pending ? '…' : label}
          </button>
        </form>
      ))}
    </div>
  )
}
