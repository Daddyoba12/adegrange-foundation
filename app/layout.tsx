import "./globals.css"
import { ThemeProvider } from "next-themes"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "AdeGrange Child Foundation",
  description: "Empowering Mothers. Protecting Children. Transforming Africa.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}