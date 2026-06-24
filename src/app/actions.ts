'use server'

import { revalidatePath } from 'next/cache'
import { addRequest, setStatus, deleteRequest as dbDeleteRequest } from '../lib/db'
import { pubsub } from '../graphql/pubsub'
import type { Category, Status } from '../lib/db'

export async function createRequest(formData: FormData) {
  const category = formData.get('category') as Category
  const partName = (formData.get('partName') as string).trim()
  const quantity = parseInt(formData.get('quantity') as string, 10)
  const notes = (formData.get('notes') as string | null)?.trim() ?? ''

  if (!category || !partName || isNaN(quantity) || quantity < 1) {
    throw new Error('Invalid request data')
  }

  const req = await addRequest({ category, partName, quantity, notes })
  pubsub.publish('REQUEST_CHANGE', req)
  revalidatePath('/')
}

export async function deleteRequest(formData: FormData) {
  const id = formData.get('id') as string
  await dbDeleteRequest(id)
  revalidatePath('/')
}

export async function updateStatus(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as Status
  const req = await setStatus(id, status)
  if (req) pubsub.publish('REQUEST_CHANGE', req)
  revalidatePath('/')
}
