import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | Quote Portal",
  description:
    "Terms of Service for Quote Portal (quoteportal.co.za) — the SaaS platform connecting event agencies, suppliers, and cost consultants through a digital RFQ workflow."
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 2026</p>

        {/* 1. Agreement to Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Agreement to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using Quote Portal (
            <Link
              href="https://quoteportal.co.za"
              className="text-blue-600 hover:underline"
            >
              quoteportal.co.za
            </Link>
            ), you agree to be bound by these Terms of Service. If you do not
            agree to all of these terms, you may not access or use the platform.
            These terms constitute a legally binding agreement between you and
            Quote Portal.
          </p>
        </section>

        {/* 2. Description of Service */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Description of Service
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Quote Portal is a software-as-a-service (SaaS) product that
            connects event agencies, suppliers, and cost consultants through a
            digital Request for Quotation (RFQ) workflow. The platform provides
            tools for creating, sending, receiving, and evaluating quotations in
            the events industry.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Quote Portal is a <strong>software product</strong>. We provide the
            technology platform that facilitates communication and document
            exchange between parties. We are not a party to any transaction
            between agencies and suppliers, and we do not provide event
            management, consulting, or any other professional services directly.
          </p>
        </section>

        {/* 3. Acceptable Use */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Acceptable Use
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Quote Portal is a software product, not a marketing service. You
            agree to use the platform solely for its intended purpose of
            managing RFQ workflows in the events industry. When using Quote
            Portal, you must not:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              Send unsolicited bulk messages or spam through the platform
            </li>
            <li>
              Upload, distribute, or transmit adult, obscene, or sexually
              explicit content
            </li>
            <li>
              Use the platform to operate or promote pyramid schemes,
              multi-level marketing, or similar fraudulent activities
            </li>
            <li>
              Attempt to gain unauthorized access to other users' data,
              accounts, or any systems connected to the platform
            </li>
            <li>
              Use the platform in any manner that violates applicable local,
              national, or international laws and regulations
            </li>
            <li>
              Interfere with or disrupt the integrity or performance of the
              platform or its underlying infrastructure
            </li>
            <li>
              Misrepresent your identity or affiliation with any person or
              organization
            </li>
          </ul>
        </section>

        {/* 4. User Accounts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. User Accounts
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To use Quote Portal, you must create an account. By creating an
            account, you represent and warrant that:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>You are at least 18 years of age</li>
            <li>
              All information you provide during registration and while using
              the platform is accurate, current, and complete
            </li>
            <li>
              You will maintain and promptly update your account information to
              keep it accurate and complete
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            You are responsible for safeguarding the credentials used to access
            your account and for all activities that occur under your account.
            You must notify us immediately of any unauthorized use of your
            account or any other breach of security.
          </p>
        </section>

        {/* 5. Billing and Payments */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Billing and Payments
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Certain features of Quote Portal require a paid subscription.
            Payments are processed securely through our authorized payment
            provider. By subscribing to a paid plan, you agree to the following:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              Subscriptions automatically renew at the end of each billing
              cycle unless you cancel before the renewal date
            </li>
            <li>
              You authorize our payment provider to charge your selected
              payment method for recurring subscription fees
            </li>
            <li>
              All fees are exclusive of applicable taxes, which will be added
              where required by law
            </li>
            <li>
              You may cancel your subscription at any time through your account
              settings; cancellation takes effect at the end of the current
              billing period
            </li>
            <li>
              Refunds are handled in accordance with our{" "}
              <Link
                href="/refund"
                className="text-blue-600 hover:underline"
              >
                Refund Policy
              </Link>
            </li>
          </ul>
        </section>

        {/* 6. Free Trial / Beta */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Free Trial and Beta Access
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Quote Portal may offer free trials or beta access to certain
            features. During any trial or beta period:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              Access is provided on an &quot;as available&quot; basis with no
              guarantee of uptime or continued availability
            </li>
            <li>
              Features may be modified, limited, or removed at any time without
              prior notice
            </li>
            <li>
              We may transition trial or beta features to paid plans, at which
              point continued use will require a subscription
            </li>
            <li>
              Beta features may contain bugs or errors and are not guaranteed
              to function as described
            </li>
          </ul>
        </section>

        {/* 7. Data and Privacy */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Data and Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your privacy is important to us. Our collection and use of personal
            information is governed by our{" "}
            <Link
              href="/privacy"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </Link>
            , which forms part of these Terms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We do not sell your personal data to third parties. Data you upload
            to the platform (including RFQs, quotations, and related documents)
            remains yours. We process it solely to provide and improve the
            Quote Portal service.
          </p>
        </section>

        {/* 8. Intellectual Property */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Intellectual Property
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The Quote Portal platform, including its source code, design,
            logos, trademarks, and all related intellectual property, is owned
            by Quote Portal and protected by applicable intellectual property
            laws. Your subscription grants you a limited, non-exclusive,
            non-transferable licence to use the platform for its intended
            purpose. You may not copy, modify, distribute, reverse-engineer, or
            create derivative works based on any part of the platform without
            our prior written consent.
          </p>
        </section>

        {/* 9. Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            9. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The platform is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis without warranties of any kind, whether
            express or implied, including but not limited to implied warranties
            of merchantability, fitness for a particular purpose, and
            non-infringement.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            To the maximum extent permitted by law, Quote Portal shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, including but not limited to loss of profits,
            data, business opportunities, or goodwill, arising out of or in
            connection with your use of the platform.
          </p>
          <p className="text-gray-700 leading-relaxed">
            In no event shall Quote Portal&apos;s total aggregate liability
            exceed the amount you have paid to Quote Portal in subscription
            fees during the twelve (12) months immediately preceding the event
            giving rise to the claim.
          </p>
        </section>

        {/* 10. Termination */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            10. Termination
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You may cancel your account and stop using Quote Portal at any
            time. Upon cancellation, your access to paid features will continue
            until the end of your current billing period.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to suspend or terminate your account, without
            prior notice or liability, if you breach these Terms or engage in
            activity that we reasonably believe is harmful to the platform, its
            users, or third parties. Upon termination, your right to use the
            platform ceases immediately, though provisions that by their nature
            should survive (such as limitation of liability and governing law)
            will remain in effect.
          </p>
        </section>

        {/* 11. Governing Law */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            11. Governing Law
          </h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms shall be governed by and construed in accordance with
            the laws of the Republic of South Africa, including the Protection
            of Personal Information Act (POPIA) and the Consumer Protection Act
            (CPA), without regard to conflict of law provisions. Any disputes
            arising from these Terms or your use of the platform shall be
            subject to the exclusive jurisdiction of the courts of the Republic
            of South Africa.
          </p>
        </section>

        {/* 12. Changes to Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            12. Changes to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to update or modify these Terms at any time.
            When we make changes, we will update the &quot;Last updated&quot;
            date at the top of this page. Your continued use of Quote Portal
            after any changes constitutes your acceptance of the revised Terms.
            We encourage you to review these Terms periodically.
          </p>
        </section>

        {/* 13. Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            13. Contact
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms of Service, please
            contact us at{" "}
            <a
              href="mailto:support@quoteportal.co.za"
              className="text-blue-600 hover:underline"
            >
              support@quoteportal.co.za
            </a>
            .
          </p>
        </section>

        {/* Footer Links */}
        <hr className="border-gray-200 my-10" />
        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-700 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/refund" className="hover:text-gray-700 hover:underline">
            Refund Policy
          </Link>
          <Link href="/pricing" className="hover:text-gray-700 hover:underline">
            Pricing
          </Link>
        </div>
      </div>
    </div>
  )
}
