import { Analytics } from '@vercel/analytics/next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-dm-serif' })

export const metadata: Metadata = {
  title: 'Bunny Apple Treats | Sweet moments, handmade in Bloemfontein',
  description: 'Beautiful celebration cakes, bento boxes, cupcakes and dessert treats handcrafted by Bunny Apple Treats in Bloemfontein.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fffaf8',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${dmSans.variable} ${dmSerif.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
