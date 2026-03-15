'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed this session
    const dismissed = sessionStorage.getItem('pwa-dismissed')
    if (dismissed) return

    // Detect iOS (Safari does not fire beforeinstallprompt)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isInStandaloneMode =
      'standalone' in window.navigator &&
      (window.navigator as any).standalone === true

    if (ios && !isInStandaloneMode) {
      setIsIOS(true)
      // Small delay so page loads first
      setTimeout(() => setVisible(true), 2500)
      return
    }

    // Android / Desktop Chrome / Edge
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setVisible(true), 2500)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function handleDismiss() {
    setVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem('pwa-dismissed', 'true')
  }

  async function handleInstall() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
    }
    setPrompt(null)
  }

  if (!visible || isDismissed) return null

  return (
    <>
      {/* Backdrop — subtle, not blocking */}
      <div className="fixed inset-0 z-[998] pointer-events-none" />

      {/* Prompt card — slides up from bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[999] p-4 sm:p-6
                   animate-slide-up"
      >
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Top pink accent */}
          <div className="h-1 bg-gradient-to-r from-pink-500 to-pink-600" />

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">

              {/* App icon */}
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icon-192x192.png"
                  alt="AdeGrange App Icon"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight">
                  Install AdeGrange App
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {isIOS
                    ? 'Add to your home screen for quick access — tap the share button then "Add to Home Screen".'
                    : 'Install our app for faster access, offline browsing and a better experience.'}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* iOS instruction or Install button */}
            {isIOS ? (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Tap <strong>Share</strong> then <strong>Add to Home Screen</strong>
                </p>
              </div>
            ) : (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95
                             bg-pink-600 hover:bg-pink-700 text-white shadow-sm"
                >
                  Install App
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95
                             border-gray-300 dark:border-gray-700
                             text-gray-700 dark:text-gray-300
                             hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Not Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
