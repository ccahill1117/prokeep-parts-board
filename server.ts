import { createServer } from 'http'
import next from 'next'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import { schema } from './src/graphql/schema'

const port = parseInt(process.env.PORT ?? '3000', 10)
const dev = process.env.NODE_ENV !== 'production'

const httpServer = createServer()
const app = next({ dev, httpServer })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  httpServer.on('request', handle)

  // Use noServer so Next.js can handle its own upgrade events (HMR etc.)
  // We intercept only requests to /graphql ourselves.
  const wss = new WebSocketServer({ noServer: true })
  useServer({ schema }, wss)

  httpServer.on('upgrade', (req, socket, head) => {
    const { pathname } = new URL(req.url ?? '/', `http://localhost:${port}`)
    if (pathname === '/graphql') {
      wss.handleUpgrade(req, socket, head, (client) => {
        wss.emit('connection', client, req)
      })
    }
  })

  httpServer.listen(port, () => {
    console.log(`> Next.js ready on http://localhost:${port}`)
    console.log(`> GraphQL HTTP:  http://localhost:${port}/api/graphql`)
    console.log(`> GraphQL WS:    ws://localhost:${port}/graphql`)
  })
})
