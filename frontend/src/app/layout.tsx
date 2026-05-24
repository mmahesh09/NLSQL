import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from './providers'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'QueryAI — Natural Language to SQL',
  description: 'Ask questions about your data in plain English. Kaveri converts natural language to SQL instantly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${inter.variable}`}>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
