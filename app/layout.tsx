import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fiveout',
  description: 'Catálogo Fiveout',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}