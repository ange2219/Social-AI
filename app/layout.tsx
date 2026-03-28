import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Social IA — Assistant Community Manager',
  description: 'Gérez tous vos réseaux sociaux avec l\'intelligence artificielle.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body>{children}</body>
    </html>
  )
}
