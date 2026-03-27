import Link from "next/link"

export const metadata = {
  title: "Thank You | AdeGrange Child Foundation",
}

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { ref?: string; name?: string; amount?: string; currency?: string }
}) {
  const ref      = searchParams.ref      ?? "—"
  const name     = searchParams.name     ?? "Donor"
  const amount   = searchParams.amount   ?? ""
  const currency = searchParams.currency ?? ""

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16
                    bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-lg text-center space-y-6">

        {/* Success icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto">
          <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thank you, {name}!
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Your generous donation is making a real difference for mothers and children across Africa.
          </p>
        </div>

        {/* Donor reference card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-left space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            Donation Summary
          </p>

          {[
            { label: "Donor Reference", value: ref },
            ...(amount ? [{ label: "Amount", value: `${currency} ${amount}` }] : []),
            { label: "Status", value: "Confirmed" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className={`text-sm font-semibold ${label === "Status" ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-600">
          A confirmation email has been sent to your registered email address.
          Please keep your donor reference for your records.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white transition-all active:scale-95"
          >
            Back to Home
          </Link>
          <Link
            href="/donate"
            className="px-6 py-3 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
          >
            Donate Again
          </Link>
        </div>

      </div>
    </div>
  )
}
