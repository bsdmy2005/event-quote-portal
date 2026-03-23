import { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Pricing | Quote Portal",
  description:
    "Simple, transparent pricing for Quote Portal — the software platform for event agencies, suppliers, and cost consultants in South Africa.",
}

const tiers = [
  {
    name: "Starter",
    description: "For small agencies getting started with digital quoting.",
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    cta: "Get Started Free",
    ctaHref: "/sign-up",
    ctaVariant: "outline" as const,
    features: [
      "Up to 3 team members",
      "5 RFQs per month",
      "Basic supplier directory",
      "Email support",
      "Consent-based supplier communication",
      "SSL-encrypted platform access",
    ],
  },
  {
    name: "Professional",
    description:
      "For growing agencies that need full platform access and tools.",
    monthlyPrice: 499,
    annualPrice: 4990,
    popular: true,
    cta: "Start Free Trial",
    ctaHref: "/sign-up",
    ctaVariant: "default" as const,
    features: [
      "Up to 10 team members",
      "Unlimited RFQs",
      "Full supplier directory",
      "Cost estimate builder",
      "Priority email support",
      "Proposal management",
      "Consent-based supplier communication",
      "POPIA compliance tools",
    ],
  },
  {
    name: "Enterprise",
    description:
      "For large organisations needing advanced analytics and custom workflows.",
    monthlyPrice: 999,
    annualPrice: 9990,
    popular: false,
    cta: "Contact Sales",
    ctaHref: "mailto:support@quoteportal.co.za",
    ctaVariant: "outline" as const,
    features: [
      "Unlimited team members",
      "Unlimited RFQs",
      "Everything in Professional",
      "Supplier analytics & rankings",
      "Custom evaluation templates",
      "Dedicated account manager",
      "API access",
      "Advanced compliance & audit logs",
    ],
  },
]

const includedFeatures = [
  "SSL encryption",
  "POPIA compliance",
  "99.9% uptime SLA",
  "Regular backups",
  "South African data hosting",
]

const faqs = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle. Your data is always preserved when switching plans.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. The Professional and Enterprise plans both include a 14-day free trial so you can explore the full feature set of the software platform before committing.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards. Payments are processed securely through our payment partner. Enterprise customers can also pay via EFT or invoice.",
  },
  {
    question: "What happens when my trial ends?",
    answer:
      "When your trial ends, you can choose to subscribe to a paid plan or continue on the free Starter plan. You will not be charged unless you explicitly choose a paid subscription.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. Quote Portal is a software platform hosted on South African infrastructure with SSL encryption, regular backups, and full POPIA compliance. Your data is never shared with third parties.",
  },
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes. There are no long-term contracts. You can cancel your subscription at any time and continue using the platform until the end of your current billing period.",
  },
]

function formatPrice(price: number): string {
  return price === 0 ? "R0" : `R${price.toLocaleString("en-ZA")}`
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Quote Portal is the software platform built for event agencies,
            suppliers, and cost consultants in South Africa. Choose the plan
            that fits your organisation.
          </p>
        </div>
      </section>

      {/* Pricing Toggle Info */}
      <section className="px-4 pb-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Prices shown are monthly. Pay annually and{" "}
          <span className="font-semibold text-foreground">save 17%</span>.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={
                tier.popular
                  ? "relative border-primary shadow-lg"
                  : "relative"
              }
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription className="min-h-[40px]">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {formatPrice(tier.monthlyPrice)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  {tier.annualPrice > 0 && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      or {formatPrice(tier.annualPrice)}/year
                    </p>
                  )}
                </div>

                <ul className="mb-8 space-y-3 text-left text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={tier.ctaVariant}
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link href={tier.ctaHref}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* All Plans Include */}
      <section className="border-t bg-muted/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            All plans include
          </h2>
          <p className="mt-2 text-muted-foreground">
            Every Quote Portal subscription comes with these essentials built
            into the platform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {includedFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm"
              >
                <Check className="h-4 w-4 text-primary" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b pb-6 last:border-b-0">
              <h3 className="text-base font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Footer Links */}
      <section className="border-t bg-muted/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            Have questions about which plan is right for you?{" "}
            <a
              href="mailto:support@quoteportal.co.za"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              support@quoteportal.co.za
            </a>
          </p>
          <div className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/terms"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/refund"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
