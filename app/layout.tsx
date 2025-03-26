import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AppointmentProvider } from "@/components/providers/appointment-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Doctor Appointment Booking System",
  description: "Book and manage doctor appointments easily",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppointmentProvider>
            {children}
            <Toaster />
          </AppointmentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'