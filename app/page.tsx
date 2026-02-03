"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Wrench,
  ArrowRight,
  Star,
  MapPin,
  Users,
  Calendar,
  Award,
  Sparkles,
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
  ClipboardCheck,
  Target,
  Bell,
  FileCheck,
  Handshake,
  Shield,
  TrendingUp,
  Mail,
  GitCompare,
  FileSearch,
  Brain,
  Rocket,
  Clock,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Data for sections
const AVAILABLE_FEATURES = [
  {
    icon: Users,
    title: "Multi-Supplier RFQs",
    description:
      "Send RFQs to multiple suppliers simultaneously. Create detailed briefs with attachments, set deadlines, and manage responses all in one place.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Calculator,
    title: "Cost Estimation",
    description:
      "Compile Cost Estimates (CEs) efficiently. Receive PDF quotations from suppliers, compare pricing, and build comprehensive proposals faster.",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: Zap,
    title: "Qualified Lead Generation",
    description:
      "Suppliers receive targeted RFQ invitations from verified agencies. No cold calling - just qualified leads with clear project requirements.",
    gradient: "from-purple-500 to-purple-600",
  },
];

const COMING_SOON_FEATURES = [
  {
    icon: Send,
    title: "Tender Distribution",
    description: "Distribute tenders to qualified, verified suppliers automatically",
  },
  {
    icon: FolderOpen,
    title: "Document Storage",
    description: "Centralized document management for all project files",
  },
  {
    icon: BarChart3,
    title: "Analysis Tools",
    description: "Compare quotes and analyze costs with powerful insights",
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Unified messaging between all stakeholders",
  },
];

const AI_FEATURES = [
  {
    icon: Mail,
    title: "Smart Email Drafting",
    description: "AI-assisted communication with suppliers and stakeholders",
  },
  {
    icon: GitCompare,
    title: "Workflow Comparison",
    description: "Intelligent analysis of proposals and workflows",
  },
  {
    icon: Calculator,
    title: "CE Estimation",
    description: "AI-powered cost estimate generation and validation",
  },
  {
    icon: FileSearch,
    title: "Document Analysis",
    description: "Automated extraction and analysis of quotes",
  },
];

const VALUE_CHAIN = [
  { icon: Briefcase, title: "Cost Consultants", subtitle: "Strategic advisory" },
  { icon: Building2, title: "Agencies", subtitle: "Event management" },
  { icon: Wrench, title: "Suppliers", subtitle: "Service delivery" },
  { icon: Landmark, title: "Financiers", subtitle: "Project funding" },
];

const WORKFLOW_STEPS = [
  {
    icon: FileText,
    title: "Briefing & Alignment",
    description:
      "Compile and share comprehensive briefs with consultants to ensure scope and deliverables alignment before procurement begins.",
    features: ["Scope Definition", "Budget Framework", "Timeline Planning"],
  },
  {
    icon: Target,
    title: "Formal Proposal Assessment",
    description:
      "Expert cost estimate evaluation against industry benchmarks. Compare proposals with confidence using data-driven insights.",
    features: ["Benchmark Analysis", "Cost Validation", "Risk Assessment"],
  },
  {
    icon: ClipboardCheck,
    title: "Project Closure",
    description:
      "Comprehensive project wrap-up with efficiency recommendations and detailed reconciliation reviews.",
    features: ["Performance Review", "Final Reconciliation", "Lessons Learned"],
  },
];

const FUNDING_FEATURES = [
  {
    icon: FileCheck,
    title: "PO-Based Funding",
    description: "Unlock capital based on approved purchase orders",
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

const FUNDING_PROCESS = [
  { title: "Submit PO", description: "Upload approved purchase order" },
  { title: "Platform Review", description: "We verify and approve the project" },
  { title: "Funder Match", description: "Connect with interested financiers" },
  { title: "Get Funded", description: "Receive working capital for your project" },
];

const ROADMAP_PHASES = [
  {
    phase: 1,
    title: "Foundation",
    status: "live",
    features: ["Multi-Supplier RFQs", "Cost Estimation", "Lead Generation"],
  },
  {
    phase: 2,
    title: "Collaboration",
    status: "development",
    features: ["Tender Distribution", "Document Storage", "Communication Hub"],
  },
  {
    phase: 3,
    title: "Intelligence",
    status: "planned",
    features: ["AI Workflows", "Analysis Tools", "Smart Insights"],
  },
  {
    phase: 4,
    title: "Finance",
    status: "future",
    features: ["Funding Marketplace", "Invoice Financing", "Payment Processing"],
  },
];

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Beta Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 relative">
          <div className="container mx-auto flex items-center justify-center gap-4 text-sm md:text-base">
            <Rocket className="h-5 w-5 hidden sm:block" />
            <span className="font-medium">
              We&apos;re in Beta — Join our early access program for exclusive perks
            </span>
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="bg-white text-amber-600 hover:bg-amber-50"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="container mx-auto px-4 py-24">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Now in Beta • Fully Integrated Event Platform
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              The Complete
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                Event Ecosystem
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              From quote to funding, connect cost consultants, agencies, suppliers, and
              financiers on South Africa&apos;s only end-to-end event procurement platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                asChild
                className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link href="/waitlist">
                  <Rocket className="mr-3 h-6 w-6" />
                  Join the Waitlist
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-blue-200"
              >
                <Link href="/agencies">
                  <Building2 className="mr-3 h-6 w-6" />
                  Browse Agencies
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Multi-Supplier RFQs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Streamlined Cost Estimation</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Qualified Lead Generation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/80 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by South African Event Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join successful events across South Africa powered by our platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Event Categories</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Wrench className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">20+</div>
              <div className="text-gray-600 font-medium">SA Verified Suppliers</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">5</div>
              <div className="text-gray-600 font-medium">Top SA Agencies</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600 font-medium">South African</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Services Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Platform Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need,
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                One Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive suite of tools for modern event procurement - from RFQs to
              funding
            </p>
          </div>

          {/* Available Now */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-lg font-semibold text-gray-700">Available Now</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {AVAILABLE_FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
                >
                  <CardContent className="p-10 text-center">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-8`}
                    >
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-lg font-semibold text-gray-500">Coming Soon</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMING_SOON_FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-0 shadow-lg bg-white/50 backdrop-blur-sm opacity-80 hover:opacity-100 transition-all duration-300"
                >
                  <CardContent className="p-8 text-center relative">
                    <Badge className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs">
                      Coming Soon
                    </Badge>
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Workflows Section */}
      <div className="py-24 bg-gradient-to-br from-violet-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Brain className="h-4 w-4" />
              AI-Powered • Coming Soon
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Intelligent Workflows
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Harness the power of AI to streamline your event procurement processes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-purple-200 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Chain Section */}
      <div className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Vertically Integrated Platform
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              One Platform, Complete Value Chain
            </h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Connecting every stakeholder in the event procurement ecosystem
            </p>
          </div>

          {/* Value Chain Flow */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {VALUE_CHAIN.map((stakeholder, index) => (
              <div key={stakeholder.title} className="flex items-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110">
                    <stakeholder.icon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{stakeholder.title}</h3>
                  <p className="text-indigo-200 text-sm">{stakeholder.subtitle}</p>
                </div>
                {index < VALUE_CHAIN.length - 1 && (
                  <div className="hidden md:block w-16 h-0.5 bg-white/30 mx-4">
                    <ArrowRight className="h-4 w-4 text-white/50 -mt-2 ml-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Services Section */}
      <div className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4" />
              Professional Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Expert-Led Project
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                Lifecycle Management
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end consulting services aligned with industry best practices
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500 hidden md:block" />

              {WORKFLOW_STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0"
                >
                  {/* Step number */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg z-10">
                    {index + 1}
                  </div>

                  {/* Step content */}
                  <Card className="flex-1 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <step.icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{step.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {step.features.map((feature) => (
                              <Badge
                                key={feature}
                                variant="secondary"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Funding Marketplace Section */}
      <div className="py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Landmark className="h-4 w-4" />
                Coming Soon
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Funding Marketplace</h2>
              <p className="text-xl text-emerald-100 mb-8">
                Unlock working capital based on approved purchase orders. Connect event
                companies and suppliers with project financiers.
              </p>

              <div className="space-y-4 mb-10">
                {FUNDING_FEATURES.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="text-emerald-100 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl"
              >
                <Link href="/waitlist">
                  <Bell className="mr-2 h-5 w-5" />
                  Get Notified at Launch
                </Link>
              </Button>
            </div>

            {/* Right: Process */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
              <h3 className="text-white font-bold text-xl mb-6 text-center">
                How It Works
              </h3>

              <div className="space-y-6">
                {FUNDING_PROCESS.map((step, index) => (
                  <div key={step.title} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1 bg-white/10 rounded-xl p-4">
                      <h4 className="text-white font-semibold">{step.title}</h4>
                      <p className="text-emerald-100 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Roadmap Section */}
      <div className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              Platform Roadmap
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Journey</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Building the future of event procurement, one phase at a time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROADMAP_PHASES.map((phase) => (
              <Card
                key={phase.phase}
                className={`border-0 ${
                  phase.status === "live"
                    ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50"
                    : phase.status === "development"
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                    : "bg-white/5"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm font-medium">
                      Phase {phase.phase}
                    </span>
                    <Badge
                      className={
                        phase.status === "live"
                          ? "bg-green-500 text-white"
                          : phase.status === "development"
                          ? "bg-amber-500 text-white"
                          : phase.status === "planned"
                          ? "bg-blue-500/50 text-blue-200"
                          : "bg-slate-600 text-slate-300"
                      }
                    >
                      {phase.status === "live" && "✓ Live"}
                      {phase.status === "development" && "In Development"}
                      {phase.status === "planned" && "Planned"}
                      {phase.status === "future" && "Future"}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-slate-300 text-sm"
                      >
                        {phase.status === "live" ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-slate-500" />
                        )}
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* South African Business Focus Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <MapPin className="h-4 w-4" />
              Built for South African Business
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Connecting South African Event Professionals
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We understand the unique needs of South African event businesses. Our
              platform is designed specifically for the local market with Rand pricing,
              local suppliers, and South African business practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Market Focus</h3>
              <p className="text-blue-100">
                Designed specifically for the South African event industry with local
                suppliers, Rand pricing, and SA business practices.
              </p>
            </div>

            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">SA Network</h3>
              <p className="text-blue-100">
                Connect with verified South African agencies and suppliers across all
                major cities and provinces.
              </p>
            </div>

            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Expertise</h3>
              <p className="text-blue-100">
                Built by South Africans, for South Africans. We understand your business
                needs and local market dynamics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Be Part of the Future
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Transform
              <span className="block">Your Event Workflow?</span>
            </h2>

            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join our waitlist today and be among the first to experience South
              Africa&apos;s most comprehensive event procurement platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                asChild
                className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-semibold"
              >
                <Link href="/waitlist">
                  <Rocket className="mr-3 h-6 w-6" />
                  Join the Waitlist
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="text-lg px-10 py-6 bg-white/10 text-white hover:bg-white/20 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-semibold border border-white/30"
              >
                <Link href="/agencies">
                  <Building2 className="mr-3 h-6 w-6" />
                  Explore Platform
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200 mt-16">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span className="font-medium">Early Access Perks</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-300" />
                <span className="font-medium">Shape the Product</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
