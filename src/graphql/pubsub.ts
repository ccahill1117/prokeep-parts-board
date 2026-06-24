import { createPubSub } from 'graphql-yoga'
import type { PartRequest } from '../lib/db'

export const pubsub = createPubSub<{
  REQUEST_CHANGE: [PartRequest]
}>()
