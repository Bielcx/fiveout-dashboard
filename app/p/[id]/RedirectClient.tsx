'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectClient({ id }: { id: string }) {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/catalogo?id=${id}`)
  }, [id, router])

  return (
    <div style={{ background: '#0a0806', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b5d4f', letterSpacing: '0.2em' }}>
        carregando...
      </p>
    </div>
  )
}
