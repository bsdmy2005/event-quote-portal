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
  FileCheck,
  Mail,
  CircleDollarSign,
  GitCompare,
  FileSearch,
  Shield,
  TrendingUp,
  Handshake,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Who We Serve - 4 Stakeholders (with expanded features)
const STAKEHOLDERS = [
  {
    icon: Building2,
    title: "Event Agencies",
    subtitle: "Streamline procurement & compile cost estimates",
    benefits: [
      "Send RFQs to multiple suppliers simultaneously",
      "Compare quotes and compile cost estimates for consultants",
      "Access document storage and centralized communication",
      "Rate suppliers and build trusted relationships",
      "Advertise your agency services on the platform",
    ],
    cta: "Learn More",
    href: "/features#agencies",
    color: "blue",
  },
  {
    icon: Wrench,
    title: "Suppliers",
    subtitle: "Get qualified leads & respond to RFQs",
    benefits: [
      "Receive targeted RFQ invitations from verified agencies",
      "Respond to RFQs directly within the platform",
      "Advertise your services and build your profile",
      "Earn ratings and reviews to grow your reputation",
      "Access PO-based funding for confirmed projects",
    ],
    cta: "Learn More",
    href: "/features#suppliers",
    color: "green",
  },
  {
    icon: Briefcase,
    title: "Cost Consultants",
    subtitle: "Issue RFQs to agencies & benchmark costs",
    benefits: [
      "Issue RFQs to multiple event agencies for projects",
      "Compare agency proposals and select best fit",
      "Review cost estimates with industry benchmarking",
      "Align scope and budgets before procurement begins",
      "Generate closure reports with efficiency insights",
    ],
    cta: "Learn More",
    href: "/features#consultants",
    color: "purple",
  },
  {
    icon: Landmark,
    title: "Funders",
    subtitle: "Fund verified POs & manage portfolio",
    benefits: [
      "Browse platform-verified purchase orders",
      "Access risk analytics on agencies and suppliers",
      "Connect directly with event companies",
      "Structure flexible financing terms",
      "Track and manage your funding portfolio",
    ],
    cta: "Learn More",
    href: "/features#funders",
    color: "emerald",
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

// AI Features - Detailed
const AI_FEATURES = [
  {
    icon: Mail,
    title: "Smart Email Drafting",
    description: "AI-assisted communication with suppliers and stakeholders. Generate professional RFQ emails, follow-ups, and responses.",
  },
  {
    icon: GitCompare,
    title: "Workflow Comparison",
    description: "Intelligent analysis of proposals and workflows. Compare multiple quotes side-by-side with AI-powered insights.",
  },
  {
    icon: Calculator,
    title: "CE Estimation",
    description: "AI-powered cost estimate generation and validation. Get instant benchmarks against industry standards.",
  },
  {
    icon: FileSearch,
    title: "Document Analysis",
    description: "Automated extraction and analysis of quotes, proposals, and contracts. Save hours on manual review.",
  },
];

// Funding Marketplace Features
const FUNDING_FEATURES = [
  {
    icon: FileCheck,
    title: "PO-Based Funding",
    description: "Unlock working capital based on approved purchase orders",
  },
  {
    icon: Handshake,
    title: "Investor Marketplace",
    description: "Connect with funders looking to invest in verified projects",
  },
  {
    icon: Shield,
    title: "Platform-Verified",
    description: "All projects vetted and approved through our platform",
  },
  {
    icon: TrendingUp,
    title: "Flexible Terms",
    description: "Competitive financing options tailored to project timelines",
  },
];

// Funding Process Steps
const FUNDING_PROCESS = [
  { step: 1, title: "Submit PO", description: "Upload approved purchase order" },
  { step: 2, title: "Platform Review", description: "We verify and approve the project" },
  { step: 3, title: "Funder Match", description: "Connect with interested financiers" },
  { step: 4, title: "Get Funded", description: "Receive working capital" },
];

// Communication Features
const COMMUNICATION_FEATURES = [
  { title: "Centralized Messaging", description: "All stakeholder communication in one place" },
  { title: "Thread Organization", description: "Conversations organized by project and RFQ" },
  { title: "Document Sharing", description: "Share files directly in conversations" },
  { title: "Notification Preferences", description: "Stay updated on what matters" },
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
            {STAKEHOLDERS.map((stakeholder) => {
              const colorClasses = {
                blue: { bg: "bg-blue-50", text: "text-blue-600", check: "text-blue-500" },
                green: { bg: "bg-green-50", text: "text-green-600", check: "text-green-500" },
                purple: { bg: "bg-purple-50", text: "text-purple-600", check: "text-purple-500" },
                emerald: { bg: "bg-emerald-50", text: "text-emerald-600", check: "text-emerald-500" },
              };
              const colors = colorClasses[stakeholder.color as keyof typeof colorClasses];

              return (
                <Card
                  key={stakeholder.title}
                  className="border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                      <stakeholder.icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {stakeholder.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">{stakeholder.subtitle}</p>
                    <ul className="space-y-2 mb-4">
                      {stakeholder.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className={`h-4 w-4 ${colors.check} mt-0.5 flex-shrink-0`} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    {stakeholder.benefits.length > 3 && (
                      <p className="text-xs text-slate-400 mb-4">
                        + {stakeholder.benefits.length - 3} more features
                      </p>
                    )}
                    <Button
                      asChild
                      variant="ghost"
                      className={`w-full justify-center ${colors.text} hover:${colors.bg} font-medium`}
                    >
                      <Link href={stakeholder.href}>
                        {stakeholder.cta}
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              );
            })}
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

      {/* AI-Powered Workflows Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 mb-4">
              <Brain className="h-3.5 w-3.5 mr-1.5" />
              Coming Soon
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              AI-Powered Workflows
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Harness intelligent automation to streamline your event procurement processes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {AI_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/80 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Communication Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Left: Content */}
            <div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Coming Soon
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Unified Communication Hub
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Keep all stakeholder conversations organized in one place. No more scattered emails or missed messages between agencies, suppliers, consultants, and funders.
              </p>

              <div className="space-y-4">
                {COMMUNICATION_FEATURES.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900">{feature.title}</h4>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="space-y-4">
                {/* Sample conversation threads */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Agency → Suppliers</p>
                      <p className="text-xs text-slate-500">RFQ #2024-089: AV Equipment</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 pl-11">Quote deadline extended to Friday...</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Cost Consultant</p>
                      <p className="text-xs text-slate-500">Budget Review: Corporate Launch</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 pl-11">Scope alignment complete, ready for...</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Landmark className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Funder Discussion</p>
                      <p className="text-xs text-slate-500">PO Funding: Project #2024-045</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 pl-11">Terms approved, disbursement in 48h...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Marketplace Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Left: Content */}
            <div className="text-white">
              <Badge className="bg-white/20 text-white hover:bg-white/20 mb-4">
                <Landmark className="h-3.5 w-3.5 mr-1.5" />
                Coming Soon
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Funding Marketplace
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Unlock working capital based on approved purchase orders. Connect event companies and suppliers with project financiers — all verified through our platform.
              </p>

              <div className="space-y-4 mb-8">
                {FUNDING_FEATURES.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{feature.title}</h4>
                      <p className="text-sm text-blue-200">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                <Link href="/waitlist">
                  <Bell className="mr-2 h-4 w-4" />
                  Get Notified at Launch
                </Link>
              </Button>
            </div>

            {/* Right: Process Steps */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-white font-semibold text-lg mb-6 text-center">
                How It Works
              </h3>

              <div className="space-y-4">
                {FUNDING_PROCESS.map((item) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1 bg-white/10 rounded-xl p-4">
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-blue-200 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
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
