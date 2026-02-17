import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Digital Twin - Professional Profile RAG",
  description: "AI-powered digital twin that answers questions about Vivian Mibei's professional background",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="min-h-screen bg-gradient-to-br from-background to-background/95">{children}</div>
      </body>
    </html>
  )
}
