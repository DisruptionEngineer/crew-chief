import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Tenths',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#F5F5F5] transition-colors mb-8"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#666] mb-10">Last updated: March 4, 2026</p>

        <div className="space-y-8 text-sm text-[#AAA] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect the following information when you use Tenths:</p>
            <ul className="list-disc list-inside space-y-1 text-[#888]">
              <li><strong className="text-[#AAA]">Account information:</strong> Email address and encrypted password when you sign up</li>
              <li><strong className="text-[#AAA]">Profile data:</strong> Car class, track, and racing preferences you provide during onboarding</li>
              <li><strong className="text-[#AAA]">Usage data:</strong> Setup calculations, session logs, and diagnostic queries you create</li>
              <li><strong className="text-[#AAA]">Payment information:</strong> Processed securely by Stripe — we never store your card details</li>
              <li><strong className="text-[#AAA]">Analytics:</strong> Anonymous page view data collected via Plausible Analytics (no cookies, no personal data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#888]">
              <li>Provide and improve the Service</li>
              <li>Generate personalized setup recommendations based on your car and track</li>
              <li>Process subscription payments</li>
              <li>Send transactional emails (account confirmation, password reset)</li>
              <li>Understand how the Service is used to make it better</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">3. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase (hosted on AWS) with encryption at rest and in transit.
              Authentication is handled via Supabase Auth with industry-standard security practices. Payment processing
              is handled entirely by Stripe, a PCI-compliant payment processor. We never have access to your full
              credit card number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1 text-[#888]">
              <li><strong className="text-[#AAA]">Supabase:</strong> Database, authentication, and backend infrastructure</li>
              <li><strong className="text-[#AAA]">Stripe:</strong> Payment processing for Pro subscriptions</li>
              <li><strong className="text-[#AAA]">Vercel:</strong> Application hosting and deployment</li>
              <li><strong className="text-[#AAA]">Plausible Analytics:</strong> Privacy-friendly, cookie-free website analytics</li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">5. Cookies</h2>
            <p>
              Tenths uses only essential cookies required for authentication and session management.
              We do not use tracking cookies or advertising cookies. Our analytics provider (Plausible) does not
              use cookies and does not collect personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">6. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#888]">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your session logs and setup data</li>
              <li>Cancel your subscription at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:support@tenths.racing" className="text-[#FF8A00] hover:text-[#FFA640]">support@tenths.racing</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">7. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. If you delete your account, we will remove
              your personal data within 30 days, except where retention is required by law or for legitimate business
              purposes (such as resolving disputes or enforcing agreements).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Tenths is not intended for children under 13. We do not knowingly collect personal information from
              children under 13. If we learn that we have collected data from a child under 13, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of material changes by posting
              the updated policy on this page with a revised &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">10. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{' '}
              <a href="mailto:support@tenths.racing" className="text-[#FF8A00] hover:text-[#FFA640]">support@tenths.racing</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#333]/30">
          <p className="text-xs text-[#666]">
            <Link href="/terms" className="text-[#888] hover:text-[#F5F5F5]">Terms of Service</Link>
            {' '}&middot;{' '}
            <Link href="/" className="text-[#888] hover:text-[#F5F5F5]">Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
