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
      <body className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white transition-colors duration-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Navbar />
          <main className="min-h-screen transition-colors duration-500">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}