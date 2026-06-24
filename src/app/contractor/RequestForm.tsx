'use client'

import { useActionState, useRef } from 'react'
import { createRequest } from '../actions'

const initialState = { error: '' }

export default function RequestForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function wrappedAction(_prev: typeof initialState, formData: FormData) {
    try {
      await createRequest(formData)
      formRef.current?.reset()
      return { error: '' }
    } catch {
      return { error: 'Failed to submit request. Please try again.' }
    }
  }

  const [state, action, pending] = useActionState(wrappedAction, initialState)

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-black mb-1" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a category…</option>
          <option value="hvac">HVAC</option>
          <option value="plumbing">Plumbing</option>
          <option value="automotive">Automotive</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="partName">
          Part Name / Description
        </label>
        <input
          id="partName"
          name="partName"
          type="text"
          required
          placeholder="e.g. Carrier 24ACC636A003 Fan Motor"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          defaultValue="1"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Urgency, job site details, alternatives…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Submitting…' : 'Submit Request'}
      </button>
    </form>
  )
}
