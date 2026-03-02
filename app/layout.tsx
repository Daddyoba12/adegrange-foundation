import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  metadataBase: new URL("https://adegrangefoundation.org"), // change when domain is live

  title: {
    default: "AdeGrange Child Foundation",
    template: "%s | AdeGrange Child Foundation",
  },

  description:
    "Advancing maternal and child health through sustainable community development across Africa.",

  keywords: [
    "AdeGrange Child Foundation",
    "Maternal Health Africa",
    "Child Health NGO",
    "Nonprofit UK",
    "Community Development",
  ],

  authors: [{ name: "AdeGrange Child Foundation" }],
  creator: "AdeGrange Child Foundation",
  publisher: "AdeGrange Child Foundation",

  manifest: "/manifest.json",

  icons: {
    icon: "/icon-192x192.png",
    shortcut: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AdeGrange",
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://adegrangefoundation.org",
    title: "AdeGrange Child Foundation",
    description:
      "Empowering Mothers. Protecting Children. Transforming Communities.",
    siteName: "AdeGrange Child Foundation",
    images: [
      {
        url: "/images/logo.JPG",
        width: 1200,
        height: 630,
        alt: "AdeGrange Child Foundation Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AdeGrange Child Foundation",
    description:
      "Advancing maternal and child health through sustainable development.",
    images: ["/images/logo.JPG"],
  },

  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" href="/icon-192x192.png" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icon-192x192.png" />

        {/* NGO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              name: "AdeGrange Child Foundation",
              url: "https://adegrangefoundation.org",
              logo:
                "https://adegrangefoundation.org/images/logo.JPG",
              description:
                "Advancing maternal and child health through sustainable community development across Africa.",
              areaServed: "Africa",
              foundingDate: "2017",
            }),
          }}
        />
      </head>

      <body className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          
<main className="min-h-screen transition-colors duration-500 pt-20">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}