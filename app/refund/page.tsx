import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Refund Policy | Quote Portal",
  description:
    "Refund policy for Quote Portal subscriptions. Learn about our refund terms for monthly and annual plans, processing times, and your rights under South African consumer protection law."
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Refund Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: March 2026
          </p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            {/* 1. Overview */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Overview
              </h2>
              <p>
                This Refund Policy applies to all paid subscription plans
                purchased through Quote Portal (quoteportal.co.za). By
                subscribing to any paid plan, you agree to the terms outlined
                below. All payments and refunds are processed by our authorized
                payment provider.
              </p>
            </section>

            {/* 2. Free Trial and Beta */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Free Trial and Beta
              </h2>
              <p>
                If you are using Quote Portal during a free trial or beta
                period, no charges are applied to your account. Since no payment
                is collected during a trial or beta, no refund is applicable.
              </p>
            </section>

            {/* 3. Monthly Subscriptions */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Monthly Subscriptions
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  A <strong>full refund</strong> is available if requested within{" "}
                  <strong>14 days</strong> of your first payment.
                </li>
                <li>
                  After the 14-day window, no refunds will be issued for the
                  current billing period.
                </li>
                <li>
                  You may cancel your subscription at any time to prevent future
                  charges.
                </li>
              </ul>
            </section>

            {/* 4. Annual Subscriptions */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Annual Subscriptions
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  A <strong>full refund</strong> is available if requested within{" "}
                  <strong>30 days</strong> of payment.
                </li>
                <li>
                  After the 30-day window, no refunds will be issued for the
                  remainder of the annual billing period.
                </li>
              </ul>
            </section>

            {/* 5. How to Request a Refund */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. How to Request a Refund
              </h2>
              <p className="mb-3">
                To request a refund, please email us at{" "}
                <a
                  href="mailto:support@quoteportal.co.za"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  support@quoteportal.co.za
                </a>{" "}
                with the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your organization name</li>
                <li>The email address associated with your account</li>
                <li>The reason for your refund request</li>
              </ul>
            </section>

            {/* 6. Processing Time */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Processing Time
              </h2>
              <p>
                Once a refund request is approved, please allow{" "}
                <strong>5 to 10 business days</strong> for the refund to be
                processed. All refunds are issued to the original payment method
                used at the time of purchase. Refunds are processed by our
                authorized payment provider.
              </p>
            </section>

            {/* 7. Exceptions */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Exceptions
              </h2>
              <p>
                No refund will be issued if your account has been terminated due
                to a violation of our{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Terms of Service
                </Link>
                . This includes, but is not limited to, misuse of the platform,
                fraudulent activity, or any conduct that breaches the terms
                governing your use of Quote Portal.
              </p>
            </section>

            {/* 8. Plan Changes */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Plan Changes
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Downgrades:</strong> If you downgrade your
                  subscription plan, the change will take effect at the start of
                  your next billing cycle. No partial or mid-cycle refunds are
                  issued for downgrades.
                </li>
                <li>
                  <strong>Upgrades:</strong> If you upgrade your subscription
                  plan, the cost difference is prorated for the remainder of your
                  current billing cycle.
                </li>
              </ul>
            </section>

            {/* 9. Cancellation */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                9. Cancellation
              </h2>
              <p>
                You may cancel your subscription at any time. Upon cancellation,
                you will retain access to your paid features until the end of
                your current billing period. No further charges will be applied
                after cancellation.
              </p>
            </section>

            {/* 10. South African Consumer Protection */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                10. South African Consumer Protection
              </h2>
              <p>
                In accordance with the Consumer Protection Act (CPA), Section
                44, consumers in South Africa are entitled to a cooling-off
                period for certain transactions. If you have entered into a
                subscription as a result of direct marketing, you may cancel the
                transaction within 5 business days of the date of the
                transaction, and a full refund will be issued. Your rights under
                the CPA are not affected by this policy.
              </p>
            </section>

            {/* 11. Contact */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                11. Contact
              </h2>
              <p>
                If you have any questions about this Refund Policy, please
                contact us at{" "}
                <a
                  href="mailto:support@quoteportal.co.za"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  support@quoteportal.co.za
                </a>
                .
              </p>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <Link
                href="/terms"
                className="hover:text-gray-700 underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="hover:text-gray-700 underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/pricing"
                className="hover:text-gray-700 underline"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
