import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from '@/components/google-analytics'

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'מחולל הדילמות הפיקודיות | מודל הרצפים',
  description: 'בחר דילמה מהרשימה וקבל פתרון מובנה לפי מודל הרצפים - כלי עזר למפקדים',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'מחולל הדילמות הפיקודיות',
    description: 'כלי עזר למפקדים לפתרון דילמות פיקודיות לפי מודל הרצפים',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className="antialiased">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  )
}
