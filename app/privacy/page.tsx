import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Quote Portal",
  description:
    "Privacy Policy for Quote Portal — learn how we collect, use, and protect your personal information on our event industry RFQ management platform."
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

        {/* 1. Introduction */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Quote Portal (<strong>quoteportal.co.za</strong>). Quote
            Portal is a Software-as-a-Service (SaaS) platform designed for the
            event industry, enabling agencies, suppliers, and cost consultants to
            manage Requests for Quotation (RFQs), proposals, and cost estimates
            in a streamlined digital workspace. This Privacy Policy explains how
            we collect, use, store, and protect your personal information when
            you use our platform. By accessing or using Quote Portal, you agree
            to the practices described in this policy.
          </p>
        </section>

        {/* 2. Data We Collect */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2. Data We Collect
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We collect the following categories of information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Account Data:</strong> Your name, email address,
              organisation name, and other details provided during registration
              and onboarding.
            </li>
            <li>
              <strong>Workspace Data:</strong> RFQs, proposals, cost estimates,
              documents, and any other content you create or upload within the
              platform.
            </li>
            <li>
              <strong>Usage Data:</strong> Analytics information, application
              logs, feature usage patterns, and device or browser information
              collected automatically when you interact with our service.
            </li>
            <li>
              <strong>Payment Data:</strong> Billing information necessary to
              process subscription payments. Payment data is processed securely
              by our authorised payment provider and is not stored directly on
              our servers.
            </li>
          </ul>
        </section>

        {/* 3. How We Use Your Data */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            3. How We Use Your Data
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Operate, maintain, and provide the features and functionality of
              Quote Portal.
            </li>
            <li>
              Process payments and manage your subscription.
            </li>
            <li>
              Improve, develop, and enhance our product and user experience.
            </li>
            <li>
              Communicate with you about your account, service updates, and
              support requests.
            </li>
            <li>
              Ensure the security and integrity of our platform, including fraud
              prevention and abuse detection.
            </li>
          </ul>
        </section>

        {/* 4. Data Sharing */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4. Data Sharing
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We do not sell your personal information. We may share data with
            trusted third-party service providers solely to operate and deliver
            our service. These providers include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Authentication Provider:</strong> To manage secure
              user sign-in and identity verification.
            </li>
            <li>
              <strong>Payment Provider:</strong> To process subscription
              payments securely.
            </li>
            <li>
              <strong>Cloud Storage Provider:</strong> To store uploaded files
              and documents reliably.
            </li>
            <li>
              <strong>Email Service Provider:</strong> To send transactional
              emails such as RFQ notifications and account communications.
            </li>
            <li>
              <strong>Hosting Provider:</strong> To host our application and
              database infrastructure.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            All third-party providers are contractually obligated to handle your
            data in accordance with applicable data protection laws and our
            privacy standards.
          </p>
        </section>

        {/* 5. Data Storage and Security */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            5. Data Storage and Security
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We take the security of your data seriously and implement
            appropriate technical and organisational measures, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>SSL/TLS encryption for all data transmitted between your browser and our servers.</li>
            <li>Role-based access controls to limit data access to authorised personnel only.</li>
            <li>Regular security reviews and vulnerability assessments.</li>
            <li>Data hosted on secure cloud infrastructure with industry-standard protections.</li>
          </ul>
        </section>

        {/* 6. Data Retention */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            6. Data Retention
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your personal information and workspace data are retained for as
            long as your account remains active. Upon account deletion, we will
            remove your data within 30 days, except where retention is required
            to comply with legal obligations, resolve disputes, or enforce our
            agreements.
          </p>
        </section>

        {/* 7. Your Rights */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            7. Your Rights
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Access:</strong> Request a copy of the personal data we
              hold about you.
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate or
              incomplete data.
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal data,
              subject to legal retention requirements.
            </li>
            <li>
              <strong>Export:</strong> Request your data in a portable,
              machine-readable format.
            </li>
            <li>
              <strong>Restriction:</strong> Request that we restrict processing
              of your data in certain circumstances.
            </li>
            <li>
              <strong>Withdraw Consent:</strong> Where processing is based on
              consent, you may withdraw it at any time.
            </li>
            <li>
              <strong>Lodge a Complaint:</strong> You have the right to lodge a
              complaint with the Information Regulator (South Africa) if you
              believe your personal information has been unlawfully processed.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            To exercise any of these rights, please contact us at{" "}
            <a
              href="mailto:support@quoteportal.co.za"
              className="text-blue-600 hover:underline"
            >
              support@quoteportal.co.za
            </a>
            .
          </p>
        </section>

        {/* 8. POPIA Compliance */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            8. POPIA Compliance
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Quote Portal complies with the Protection of Personal Information
            Act, 2013 (POPIA) of South Africa. We process personal information
            lawfully, and our legal bases for processing include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Contractual Obligation:</strong> Processing necessary to
              perform our contract with you (i.e., providing the Quote Portal
              service).
            </li>
            <li>
              <strong>Legitimate Interest:</strong> Processing necessary for our
              legitimate business interests, such as improving our platform and
              ensuring security, provided these interests do not override your
              rights.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            For any POPIA-related queries or to contact our Information Officer,
            please email{" "}
            <a
              href="mailto:support@quoteportal.co.za"
              className="text-blue-600 hover:underline"
            >
              support@quoteportal.co.za
            </a>
            .
          </p>
        </section>

        {/* 9. Consumer Protection Act (CPA) */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            9. Consumer Protection Act (CPA)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Quote Portal is committed to compliance with the South African
            Consumer Protection Act, 2008 (CPA). We ensure that our services are
            marketed and provided in a fair, transparent, and honest manner. You
            are entitled to clear and accurate information about our services,
            pricing, and terms. Should you have any concerns regarding your
            consumer rights, please contact us at{" "}
            <a
              href="mailto:support@quoteportal.co.za"
              className="text-blue-600 hover:underline"
            >
              support@quoteportal.co.za
            </a>
            .
          </p>
        </section>

        {/* 10. International Data Transfers */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            10. International Data Transfers
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your data may be processed and stored on servers located outside of
            South Africa. Where international data transfers occur, we ensure
            that adequate safeguards are in place, including contractual
            commitments from our service providers to protect your data in
            accordance with applicable data protection laws, including POPIA.
          </p>
        </section>

        {/* 11. Cookies */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            11. Cookies
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Quote Portal uses essential cookies that are strictly necessary for
            the operation of our platform, such as authentication and session
            management. We do not use tracking or advertising cookies without
            your explicit consent. You may manage cookie preferences through
            your browser settings.
          </p>
        </section>

        {/* 12. Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            12. Children&apos;s Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Quote Portal is a business-to-business platform and is not intended
            for use by individuals under the age of 18. We do not knowingly
            collect personal information from children. If we become aware that
            we have collected data from a person under 18, we will take steps to
            delete that information promptly.
          </p>
        </section>

        {/* 13. Changes to This Policy */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            13. Changes to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, technology, or legal requirements. If we
            make material changes, we will notify you via email or through an
            in-app notification. We encourage you to review this page
            periodically for the latest information on our privacy practices.
          </p>
        </section>

        {/* 14. Contact */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            14. Contact
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="text-gray-700 mt-3">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:support@quoteportal.co.za"
              className="text-blue-600 hover:underline"
            >
              support@quoteportal.co.za
            </a>
          </p>
        </section>

        {/* Footer Links */}
        <hr className="my-8 border-gray-200" />
        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-gray-700 hover:underline">
            Terms of Service
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
