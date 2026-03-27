import Link from "next/link"

export const metadata = {
  title: "Terms & Conditions | AdeGrange Child Foundation",
  description: "Donation terms, refund policy, data privacy and charity registration details.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: January 2025 &nbsp;&middot;&nbsp; AdeGrange Child Foundation
          </p>
        </div>

        <div className="prose-content space-y-10">

          {/* 1. About the Foundation */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. About AdeGrange Child Foundation
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              AdeGrange Child Foundation is a registered charitable organisation operating in the
              United States and Nigeria, dedicated to advancing maternal and child health through
              sustainable community development across Africa.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><span className="font-semibold text-gray-900 dark:text-white">USA Registration:</span> [Registration Number — Pending]</p>
              <p><span className="font-semibold text-gray-900 dark:text-white">Nigeria Registration:</span> [Registration Number — Pending]</p>
              <p><span className="font-semibold text-gray-900 dark:text-white">Email:</span> info@adegrangefoundation.org</p>
            </div>
          </section>

          {/* 2. Donation Policy */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Donation Policy
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              By completing a donation through our website, you agree to the following:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {[
                "All donations are voluntary and made freely without coercion.",
                "Donations are processed securely via Stripe (USD/GBP) or Paystack (NGN).",
                "A unique donor reference number (e.g. ACF_1234567890) will be issued for every donation.",
                "You will receive a confirmation to the email address provided at the time of donation.",
                "Monthly donations will be charged on the same date each month until cancelled.",
                "You can cancel a monthly donation at any time by contacting us at info@adegrangefoundation.org.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 3. How Funds Are Used */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. How Your Funds Are Used
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              AdeGrange Child Foundation is committed to transparency. Donations are allocated as follows:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Maternal Health Programmes", pct: "40%" },
                { label: "Child Survival Initiatives", pct: "25%" },
                { label: "Education & Community Support", pct: "20%" },
                { label: "Operations & Administration", pct: "15%" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{row.label}</span>
                  <span className="text-sm font-bold text-pink-600">{row.pct}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500 italic">
              Allocations are approximate and may vary by programme cycle. Annual reports are published on our website.
            </p>
          </section>

          {/* 4. Refund Policy */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Refund Policy
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              We understand that mistakes happen. Our refund policy is as follows:
            </p>
            <ul className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {[
                "Refund requests must be submitted within 14 days of the donation date.",
                "Refunds are considered on a case-by-case basis and are not guaranteed once funds have been disbursed to programmes.",
                "To request a refund, email info@adegrangefoundation.org with your donor reference number and reason for the request.",
                "Approved refunds will be returned via the original payment method within 5-10 business days.",
                "Processing fees charged by Stripe or Paystack are non-refundable.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Data Privacy */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Data Privacy
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              We take your privacy seriously. When you donate, we collect:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
              {[
                "Your name and email address for donation records and communication.",
                "Your phone number (optional) for follow-up communications.",
                "Transaction data processed securely by Stripe or Paystack.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              We will never sell, rent, or share your personal data with third parties for marketing purposes.
              Your data is stored securely and used solely for donation administration and foundation communications.
              You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          {/* 6. Contact */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Contact Us
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              If you have any questions about these terms, please contact us at{" "}
              <a href="mailto:info@adegrangefoundation.org" className="text-pink-600 hover:text-pink-500 underline underline-offset-2">
                info@adegrangefoundation.org
              </a>
            </p>
          </section>

        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Donate
          </Link>
        </div>

      </div>
    </div>
  )
}
