'use client'

import { useEffect } from 'react'
import { createClient } from 'graphql-ws'
import { useRouter } from 'next/navigation'

export default function RealtimeUpdater() {
  const router = useRouter()

  useEffect(() => {
    const client = createClient({
      url: `ws://${window.location.host}/graphql`,
    })

    const unsubscribe = client.subscribe(
      { query: `subscription { requestChanged { id } }` },
      {
        next: () => router.refresh(),
        error: (err) => console.error('[WS]', err),
        complete: () => {},
      }
    )

    return () => {
      unsubscribe()
      client.dispose()
    }
  }, [router])

  return null
}
