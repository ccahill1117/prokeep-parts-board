import { createYoga } from 'graphql-yoga'
import { schema } from '@/graphql/schema'

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  // Enables the GraphiQL playground at /api/graphql
  graphiql: true,
})

export async function GET(req: Request) {
  return yoga.fetch(req)
}

export async function POST(req: Request) {
  return yoga.fetch(req)
}
