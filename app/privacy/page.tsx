export default function PrivacyPage() {
  const lastUpdated = 'March 2025'

  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="prose-custom space-y-10">

          <Section title="1. Who We Are">
            <p>
              AdeGrange Child Foundation (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a non-profit organisation
              registered in the United States and Nigeria, dedicated to advancing maternal and child
              health across Africa.
            </p>
            <p>
              <strong>Data Controller:</strong> Adenike Grange<br />
              <strong>Email:</strong>{' '}
              <a href="mailto:adenikegrange@adegrangefoundation.org">
                adenikegrange@adegrangefoundation.org
              </a>
            </p>
          </Section>

          <Section title="2. Applicable Law">
            <p>
              As an organisation operating across multiple jurisdictions, we comply with the following
              data protection frameworks:
            </p>
            <ul>
              <li><strong>United States:</strong> applicable US federal and state privacy laws.</li>
              <li><strong>Nigeria:</strong> the Nigeria Data Protection Act 2023 (NDPA) and the
                Nigeria Data Protection Regulation (NDPR).</li>
              <li>
                We apply the higher standard of protection where laws overlap, consistent with
                internationally recognised privacy principles.
              </li>
            </ul>
          </Section>

          <Section title="3. What Personal Data We Collect">
            <p>We collect the following categories of personal data:</p>
            <ul>
              <li>
                <strong>Contact Form:</strong> full name, email address, phone number
                (including country code), and message content.
              </li>
              <li>
                <strong>Admin Access:</strong> password credentials for authorised
                administrative personnel only.
              </li>
              <li>
                <strong>Analytics Data:</strong> anonymised usage data including pages visited,
                time on site, device type, and approximate location via Google Analytics.
              </li>
            </ul>
            <p>We do not collect payment information, sensitive personal data, or data from
              children under 13 years of age.</p>
          </Section>

          <Section title="4. How We Use Your Data">
            <ul>
              <li>To respond to enquiries submitted through our contact form.</li>
              <li>To understand how visitors use our website and improve our content
                (Google Analytics).</li>
              <li>To ensure secure access to our administrative systems.</li>
              <li>To comply with our legal and regulatory obligations.</li>
            </ul>
            <p>We do not sell, rent, or share your personal data with third parties for
              marketing purposes.</p>
          </Section>

          <Section title="5. Legal Basis for Processing">
            <ul>
              <li><strong>Consent:</strong> when you submit our contact form.</li>
              <li><strong>Legitimate interests:</strong> for website analytics and
                security monitoring.</li>
              <li><strong>Legal obligation:</strong> where required by applicable law.</li>
            </ul>
          </Section>

          <Section title="6. Google Analytics">
            <p>
              Our website uses Google Analytics, a web analytics service provided by Google LLC.
              Google Analytics uses cookies to collect anonymised information about how visitors
              use our site.
            </p>
            <p>
              The data collected is used to compile reports on website activity. Google may
              transfer this data to servers in the United States or other countries.
            </p>
            <p>
              You can opt out of Google Analytics tracking by installing the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics Opt-out Browser Add-on
              </a>.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>We use the following types of cookies:</p>
            <ul>
              <li><strong>Essential cookies:</strong> required for the site to function correctly.</li>
              <li><strong>Analytics cookies:</strong> Google Analytics cookies to understand
                visitor behaviour (anonymised).</li>
              <li><strong>Theme preference:</strong> a cookie to remember your light/dark
                mode preference.</li>
            </ul>
            <p>You can control cookies through your browser settings at any time.</p>
          </Section>

          <Section title="8. Data Retention">
            <p>
              Contact form enquiries are retained for as long as necessary to respond to your
              request, and for a maximum of 12 months thereafter unless a longer retention
              period is required by law.
            </p>
            <p>
              Google Analytics data is retained for 14 months by default, in line with
              Google&apos;s standard retention settings.
            </p>
          </Section>

          <Section title="9. Your Rights">
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>The right to access the personal data we hold about you.</li>
              <li>The right to request correction of inaccurate data.</li>
              <li>The right to request deletion of your data.</li>
              <li>The right to object to or restrict processing.</li>
              <li>The right to data portability.</li>
              <li>The right to withdraw consent at any time.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:adenikegrange@adegrangefoundation.org">
                adenikegrange@adegrangefoundation.org
              </a>.
              We will respond within 30 days.
            </p>
          </Section>

          <Section title="10. Data Security">
            <p>
              We take reasonable technical and organisational measures to protect your personal
              data against unauthorised access, loss, or disclosure. All data transmitted via
              our contact form is encrypted using HTTPS.
            </p>
          </Section>

          <Section title="11. Third-Party Services">
            <p>We use the following third-party services that may process your data:</p>
            <ul>
              <li><strong>Resend</strong> — email delivery service for contact form submissions.</li>
              <li><strong>Google Analytics</strong> — website usage analytics.</li>
              <li><strong>Supabase</strong> — database and media storage for programme content.</li>
              <li><strong>Vercel</strong> — website hosting and deployment.</li>
            </ul>
            <p>Each provider operates under their own privacy policy and data processing agreements.</p>
          </Section>

          <Section title="12. International Data Transfers">
            <p>
              Your data may be processed in the United States, Nigeria, or other countries
              where our service providers operate. We ensure appropriate safeguards are in place
              for any international transfers, consistent with applicable law.
            </p>
          </Section>

          <Section title="13. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted
              on this page with an updated revision date. We encourage you to review this policy
              periodically.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              If you have any questions, concerns, or complaints about this Privacy Policy or
              how we handle your personal data, please contact:
            </p>
            <p>
              <strong>Adenike Grange</strong> — Data Controller<br />
              <a href="mailto:adenikegrange@adegrangefoundation.org">
                adenikegrange@adegrangefoundation.org
              </a><br />
              AdeGrange Child Foundation
            </p>
          </Section>

        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
        {title}
      </h2>
      <div className="space-y-3 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 [&_strong]:text-gray-900 [&_strong]:dark:text-white [&_a]:text-pink-600 [&_a]:hover:text-pink-500 [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  )
}
