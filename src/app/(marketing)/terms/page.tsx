import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — Tenths',
}

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">Terms of Service</h1>
        <p className="text-sm text-[#666] mb-10">Last updated: March 4, 2026</p>

        <div className="space-y-8 text-sm text-[#AAA] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using Tenths (&quot;the Service&quot;), operated by Flyin Finn Racing LLC (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;),
              you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">2. Description of Service</h2>
            <p>
              Tenths is a web-based application that provides chassis setup calculations, diagnostic troubleshooting,
              session logging, and reference materials for short track racing. The Service is provided &quot;as is&quot; and is intended
              for informational and educational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">3. User Accounts</h2>
            <p>
              To access certain features, you must create an account. You are responsible for maintaining the confidentiality
              of your account credentials and for all activities that occur under your account. You must provide accurate information
              when creating an account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">4. Subscriptions and Billing</h2>
            <p>
              Tenths offers a free tier and a paid Pro subscription. Pro subscriptions are billed monthly through Stripe.
              You may cancel your subscription at any time through your account settings or the Stripe Customer Portal.
              Cancellations take effect at the end of the current billing period. We do not offer refunds for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#888]">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to reverse-engineer, decompile, or hack the Service</li>
              <li>Share your account credentials with others</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Scrape, crawl, or otherwise extract data from the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">6. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind. Setup recommendations, diagnostic suggestions,
              and all other outputs are for informational purposes only. You are solely responsible for any modifications you make
              to your race car. We are not liable for any damage, injury, or loss resulting from the use of information provided
              by the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Flyin Finn Racing LLC shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in
              connection with your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of material changes by posting
              the updated terms on this page. Continued use of the Service after changes constitutes acceptance of the
              modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">9. Contact</h2>
            <p>
              If you have questions about these Terms, contact us at{' '}
              <a href="mailto:support@tenths.racing" className="text-[#FF8A00] hover:text-[#FFA640]">support@tenths.racing</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#333]/30">
          <p className="text-xs text-[#666]">
            <Link href="/privacy" className="text-[#888] hover:text-[#F5F5F5]">Privacy Policy</Link>
            {' '}&middot;{' '}
            <Link href="/" className="text-[#888] hover:text-[#F5F5F5]">Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
