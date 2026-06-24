import { makeExecutableSchema } from '@graphql-tools/schema'
import { pubsub } from './pubsub'
import { getRequests, addRequest, setStatus } from '../lib/db'
import type { PartRequest, Category, Status } from '../lib/db'

const typeDefs = /* GraphQL */ `
  enum Category {
    hvac
    plumbing
    automotive
  }

  enum Status {
    pending
    filled
    shipped
  }

  type PartRequest {
    id: String!
    category: Category!
    partName: String!
    quantity: Int!
    notes: String!
    status: Status!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    requests(status: Status, category: Category): [PartRequest!]!
    request(id: String!): PartRequest
  }

  type Mutation {
    createRequest(
      category: Category!
      partName: String!
      quantity: Int!
      notes: String
    ): PartRequest!

    updateStatus(id: String!, status: Status!): PartRequest!
  }

  type Subscription {
    requestChanged: PartRequest!
  }
`

const resolvers = {
  Query: {
    requests: (_: unknown, args: { status?: Status; category?: Category }) =>
      getRequests(args),

    request: async (_: unknown, { id }: { id: string }) => {
      const all = await getRequests({})
      return all.find((r) => r.id === id) ?? null
    },
  },

  Mutation: {
    createRequest: async (
      _: unknown,
      args: { category: Category; partName: string; quantity: number; notes?: string }
    ): Promise<PartRequest> => {
      const req = await addRequest({
        category: args.category,
        partName: args.partName,
        quantity: args.quantity,
        notes: args.notes ?? '',
      })
      pubsub.publish('REQUEST_CHANGE', req)
      return req
    },

    updateStatus: async (
      _: unknown,
      { id, status }: { id: string; status: Status }
    ): Promise<PartRequest> => {
      const req = await setStatus(id, status)
      if (!req) throw new Error(`Request not found: ${id}`)
      pubsub.publish('REQUEST_CHANGE', req)
      return req
    },
  },

  Subscription: {
    requestChanged: {
      subscribe: () => pubsub.subscribe('REQUEST_CHANGE'),
      resolve: (payload: PartRequest) => payload,
    },
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
