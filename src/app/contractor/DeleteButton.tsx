'use client'

import { useActionState } from 'react'
import { deleteRequest } from '../actions'
import { Status } from '../lib/store'

export default function DeleteButton({ id, status }: { id: string; status: Status }) {
  const [, action, pending] = useActionState(async (_prev: null, formData: FormData) => {
    await deleteRequest(formData)
    return null
  }, null)

  const isFilled = status === 'filled'
  const isDisabled = pending || isFilled

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isDisabled}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? '…' : 'Delete'}
        {isFilled && (
          <span
            title="A filled request cannot be deleted - please reach out to the distributor"
            className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-100 text-red-400 text-[10px] font-bold leading-none cursor-help"
          >
            ?
          </span>
        )}
      </button>
    </form>
  )
}
