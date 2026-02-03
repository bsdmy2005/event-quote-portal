"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Wrench,
  ArrowRight,
  Users,
  CheckCircle,
  Zap,
  Send,
  FolderOpen,
  BarChart3,
  MessageSquare,
  Calculator,
  Briefcase,
  Landmark,
  FileText,
  Target,
  Brain,
  Rocket,
  Clock,
  X,
  MapPin,
  FileCheck,
  Mail,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Who We Serve - 4 Stakeholders
const STAKEHOLDERS = [
  {
    icon: Building2,
    title: "Event Agencies",
    subtitle: "Streamline your procurement",
    benefits: [
      "Send RFQs to multiple suppliers at once",
      "Compare quotes and build cost estimates",
      "Manage projects from brief to closure",
    ],
    cta: "For Agencies",
    href: "/agencies",
  },
  {
    icon: Wrench,
    title: "Suppliers",
    subtitle: "Get qualified leads",
    benefits: [
      "Receive targeted RFQ invitations",
      "No cold calling - verified opportunities",
      "Showcase your services to agencies",
    ],
    cta: "For Suppliers",
    href: "/suppliers",
  },
  {
    icon: Briefcase,
    title: "Cost Consultants",
    subtitle: "Align scope with budgets",
    benefits: [
      "Review briefs and align deliverables",
      "Benchmark costs against industry standards",
      "Support project closure and reconciliation",
    ],
    cta: "For Consultants",
    href: "/waitlist",
  },
  {
    icon: Landmark,
    title: "Funders",
    subtitle: "Fund verified projects",
    benefits: [
      "Access platform-vetted opportunities",
      "PO-based funding with clear terms",
      "Connect with event companies directly",
    ],
    cta: "For Funders",
    href: "/waitlist",
  },
];

// Platform Features - Available Now
const AVAILABLE_FEATURES = [
  {
    icon: Users,
    title: "Multi-Supplier RFQs",
    description: "Send requests to multiple suppliers simultaneously with detailed briefs and deadlines.",
  },
  {
    icon: Calculator,
    title: "Cost Estimation",
    description: "Compile quotes, compare pricing, and build comprehensive cost estimates efficiently.",
  },
  {
    icon: Zap,
    title: "Lead Generation",
    description: "Suppliers receive qualified leads with clear requirements - no cold calling.",
  },
];

// Platform Features - Coming Soon
const COMING_FEATURES = [
  { icon: Send, title: "Tender Distribution" },
  { icon: FolderOpen, title: "Document Storage" },
  { icon: BarChart3, title: "Analysis Tools" },
  { icon: MessageSquare, title: "Communication Hub" },
  { icon: Brain, title: "AI Workflows" },
  { icon: CircleDollarSign, title: "Funding Marketplace" },
];

// How It Works - Simple Process
const PROCESS_STEPS = [
  {
    step: 1,
    title: "Brief & Quote",
    description: "Agencies create briefs, suppliers submit quotes, consultants align scope.",
    icon: FileText,
  },
  {
    step: 2,
    title: "Compare & Select",
    description: "Analyze quotes, benchmark costs, and select the best suppliers for your project.",
    icon: Target,
  },
  {
    step: 3,
    title: "Execute",
    description: "Manage the project with centralized documents, communication, and tracking.",
    icon: CheckCircle,
  },
  {
    step: 4,
    title: "Fund & Close",
    description: "Access project funding, complete deliverables, and reconcile with full transparency.",
    icon: FileCheck,
  },
];

// Roadmap
const ROADMAP = [
  { phase: "Phase 1", title: "Live", features: ["RFQs", "Cost Estimation", "Leads"], status: "live" },
  { phase: "Phase 2", title: "Building", features: ["Tenders", "Documents", "Messaging"], status: "building" },
  { phase: "Phase 3", title: "Planned", features: ["AI Tools", "Analytics"], status: "planned" },
  { phase: "Phase 4", title: "Future", features: ["Funding", "Payments"], status: "future" },
];

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Beta Banner */}
      {showBanner && (
        <div className="bg-blue-600 text-white py-2.5 px-4 relative">
          <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
            <span className="font-medium">
              We&apos;re in Beta — Join early for exclusive access
            </span>
            <Button
              asChild
              size="sm"
              className="bg-white text-blue-600 hover:bg-blue-50 h-7 px-3 text-xs font-semibold"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              The Complete Event
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Procurement Platform</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Connect event agencies, suppliers, cost consultants, and funders on one integrated platform.
              From quote to funding — streamlined.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base font-semibold"
              >
                <Link href="/waitlist">
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 h-12 text-base font-semibold"
              >
                <Link href="#how-it-works">
                  See How It Works
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free to join
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Early access perks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Who We Serve
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              One platform connecting every stakeholder in the event procurement ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STAKEHOLDERS.map((stakeholder) => (
              <Card
                key={stakeholder.title}
                className="border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <stakeholder.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {stakeholder.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">{stakeholder.subtitle}</p>
                  <ul className="space-y-2 mb-6">
                    {stakeholder.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                  >
                    <Link href={stakeholder.href}>
                      {stakeholder.cta}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Platform Capabilities
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful tools for modern event procurement
            </p>
          </div>

          {/* Available Now */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />
                Available Now
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {AVAILABLE_FEATURES.map((feature) => (
                <Card key={feature.title} className="border-0 shadow-sm bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-slate-200 text-slate-600 hover:bg-slate-200">
                Coming Soon
              </Badge>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {COMING_FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-600"
                >
                  <feature.icon className="h-4 w-4 text-slate-400" />
                  {feature.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A streamlined process from brief to project completion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.step} className="relative text-center">
                {/* Connector line */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200" />
                )}

                {/* Step number */}
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold relative z-10">
                  {step.step}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Roadmap
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Building the future of event procurement
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {ROADMAP.map((phase) => (
              <div
                key={phase.phase}
                className={`rounded-xl p-5 ${
                  phase.status === "live"
                    ? "bg-blue-600"
                    : "bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {phase.phase}
                  </span>
                  {phase.status === "live" && (
                    <Badge className="bg-white/20 text-white text-xs hover:bg-white/20">
                      Live
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {phase.title}
                </h3>
                <ul className="space-y-1.5">
                  {phase.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                      {phase.status === "live" ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to streamline your event procurement?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join our waitlist and be among the first to experience the platform.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 h-12 text-base font-semibold"
            >
              <Link href="/waitlist">
                Join the Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-blue-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Free to join
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Early access perks
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Shape the product
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
