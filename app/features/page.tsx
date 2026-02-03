"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Wrench,
  Briefcase,
  Landmark,
  ArrowRight,
  CheckCircle,
  Users,
  Calculator,
  FileText,
  Send,
  BarChart3,
  MessageSquare,
  FolderOpen,
  Star,
  Bell,
  Megaphone,
  TrendingUp,
  Shield,
  FileCheck,
  Handshake,
  Brain,
  Mail,
  GitCompare,
  FileSearch,
  Target,
  Clock,
} from "lucide-react";
import Link from "next/link";

// ============== AGENCIES ==============
const AGENCY_FEATURES = [
  {
    icon: Send,
    title: "Multi-Supplier RFQs",
    description: "Send detailed requests to multiple suppliers simultaneously. Include briefs, attachments, deadlines, and specific requirements.",
    status: "live",
  },
  {
    icon: Calculator,
    title: "Cost Estimate Compilation",
    description: "Receive PDF quotations from suppliers, compare pricing side-by-side, and compile comprehensive cost estimates to send to consultants.",
    status: "live",
  },
  {
    icon: BarChart3,
    title: "Quote Comparison & Analysis",
    description: "Compare multiple supplier quotes with powerful analysis tools. Identify the best value and make data-driven decisions.",
    status: "coming",
  },
  {
    icon: FolderOpen,
    title: "Document Management",
    description: "Store all project documents centrally — briefs, quotes, contracts, and deliverables. Access everything in one organized workspace.",
    status: "coming",
  },
  {
    icon: Star,
    title: "Supplier Ratings",
    description: "Rate suppliers after project completion. Build a trusted network based on verified performance and quality.",
    status: "coming",
  },
];

// ============== SUPPLIERS ==============
const SUPPLIER_FEATURES = [
  {
    icon: Bell,
    title: "Receive Targeted RFQs",
    description: "Get RFQ invitations from verified agencies looking for your specific services. No cold calling — only qualified opportunities.",
    status: "live",
  },
  {
    icon: FileText,
    title: "Respond Within Platform",
    description: "Submit structured quotes directly through the platform. Include pricing, timelines, terms, and attachments in a professional format.",
    status: "live",
  },
  {
    icon: Megaphone,
    title: "Advertise Your Services",
    description: "Create a comprehensive supplier profile showcasing your services, past work, certifications, and capabilities.",
    status: "live",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description: "Earn ratings and reviews from completed projects. Build credibility and attract more business through verified performance.",
    status: "coming",
  },
  {
    icon: TrendingUp,
    title: "Access Project Funding",
    description: "Need working capital for a confirmed project? Access PO-based funding through our marketplace of verified financiers.",
    status: "coming",
  },
];

// ============== CONSULTANTS ==============
const CONSULTANT_FEATURES = [
  {
    icon: Send,
    title: "Issue RFQs to Agencies",
    description: "Send RFQs to multiple event agencies for large-scale projects. Compare agency proposals and select the best fit for your client.",
    status: "coming",
  },
  {
    icon: BarChart3,
    title: "Agency Comparison Analysis",
    description: "Compare proposals from multiple agencies side-by-side. Evaluate pricing, capabilities, and track records with detailed analytics.",
    status: "coming",
  },
  {
    icon: Calculator,
    title: "CE Review & Benchmarking",
    description: "Review cost estimates submitted by agencies. Benchmark against industry standards and historical data to ensure value.",
    status: "coming",
  },
  {
    icon: Target,
    title: "Scope & Budget Alignment",
    description: "Work with agencies to align project scope with budgets before procurement begins. Prevent scope creep and budget overruns.",
    status: "coming",
  },
  {
    icon: FileText,
    title: "Project Closure Reports",
    description: "Generate comprehensive closure reports with efficiency recommendations, reconciliation reviews, and lessons learned.",
    status: "coming",
  },
];

// ============== FUNDERS ==============
const FUNDER_FEATURES = [
  {
    icon: FileCheck,
    title: "Browse Verified POs",
    description: "Access a marketplace of platform-verified purchase orders from event companies and suppliers seeking working capital.",
    status: "coming",
  },
  {
    icon: Shield,
    title: "Platform-Vetted Projects",
    description: "All funding opportunities are vetted through our platform. Review project details, agency history, and risk assessments.",
    status: "coming",
  },
  {
    icon: Handshake,
    title: "Direct Connection",
    description: "Connect directly with event companies and suppliers. Negotiate terms and structure financing that works for both parties.",
    status: "coming",
  },
  {
    icon: TrendingUp,
    title: "Portfolio Management",
    description: "Track your funded projects, monitor milestones, and manage your event financing portfolio all in one place.",
    status: "coming",
  },
  {
    icon: BarChart3,
    title: "Risk Analytics",
    description: "Access platform data on agency and supplier performance to make informed funding decisions with confidence.",
    status: "coming",
  },
];

// ============== PLATFORM-WIDE FEATURES ==============
const PLATFORM_FEATURES = [
  {
    icon: MessageSquare,
    title: "Unified Communication Hub",
    description: "All stakeholder communication in one place. Threads organized by project, RFQ, and topic. No more scattered emails.",
    status: "coming",
  },
  {
    icon: Mail,
    title: "AI Email Drafting",
    description: "Generate professional RFQ emails, follow-ups, and responses with AI assistance. Save time on routine communication.",
    status: "coming",
  },
  {
    icon: GitCompare,
    title: "AI Workflow Comparison",
    description: "Intelligent analysis of proposals and workflows. Compare multiple quotes side-by-side with AI-powered insights.",
    status: "coming",
  },
  {
    icon: Calculator,
    title: "AI Cost Estimation",
    description: "AI-powered cost estimate generation and validation. Get instant benchmarks against industry standards.",
    status: "coming",
  },
  {
    icon: FileSearch,
    title: "AI Document Analysis",
    description: "Automated extraction and analysis of quotes, proposals, and contracts. Save hours on manual review.",
    status: "coming",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description: "Build trust across the ecosystem. Rate agencies, suppliers, consultants after each project. Verified performance data.",
    status: "coming",
  },
];

const STAKEHOLDERS = [
  {
    id: "agencies",
    icon: Building2,
    title: "Event Agencies",
    subtitle: "Streamline procurement, compare quotes, compile cost estimates",
    color: "blue",
    features: AGENCY_FEATURES,
  },
  {
    id: "suppliers",
    icon: Wrench,
    title: "Suppliers",
    subtitle: "Receive qualified leads, respond to RFQs, build reputation",
    color: "green",
    features: SUPPLIER_FEATURES,
  },
  {
    id: "consultants",
    icon: Briefcase,
    title: "Cost Consultants",
    subtitle: "Issue RFQs to agencies, compare proposals, benchmark costs",
    color: "purple",
    features: CONSULTANT_FEATURES,
  },
  {
    id: "funders",
    icon: Landmark,
    title: "Funders",
    subtitle: "Access verified POs, fund event projects, manage portfolio",
    color: "emerald",
    features: FUNDER_FEATURES,
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    bgDark: "bg-blue-600",
    text: "text-blue-600",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  green: {
    bg: "bg-green-50",
    bgDark: "bg-green-600",
    text: "text-green-600",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  purple: {
    bg: "bg-purple-50",
    bgDark: "bg-purple-600",
    text: "text-purple-600",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    bgDark: "bg-emerald-600",
    text: "text-emerald-600",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">
              Platform Features
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Features & Functionality
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              A comprehensive look at what each stakeholder can do on our platform — from agencies and suppliers to consultants and funders.
            </p>

            {/* Quick nav */}
            <div className="flex flex-wrap justify-center gap-3">
              {STAKEHOLDERS.map((s) => (
                <Button
                  key={s.id}
                  variant="outline"
                  asChild
                  className="border-slate-200"
                >
                  <a href={`#${s.id}`}>
                    <s.icon className="h-4 w-4 mr-2" />
                    {s.title}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Sections */}
      {STAKEHOLDERS.map((stakeholder, idx) => {
        const colors = colorClasses[stakeholder.color as keyof typeof colorClasses];
        return (
          <section
            key={stakeholder.id}
            id={stakeholder.id}
            className={`py-20 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
          >
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-12">
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <stakeholder.icon className={`h-7 w-7 ${colors.text}`} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {stakeholder.title}
                  </h2>
                  <p className="text-slate-600">{stakeholder.subtitle}</p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stakeholder.features.map((feature) => (
                  <Card
                    key={feature.title}
                    className={`border ${colors.border} hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                          <feature.icon className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <Badge
                          className={
                            feature.status === "live"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs"
                          }
                        >
                          {feature.status === "live" ? "Live" : "Coming Soon"}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Platform-Wide Features */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 mb-4">
              <Brain className="h-3.5 w-3.5 mr-1.5" />
              Platform-Wide
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Shared Platform Features
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Features available to all stakeholders on the platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLATFORM_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <Badge className="bg-slate-700 text-slate-300 hover:bg-slate-700 text-xs">
                    Coming Soon
                  </Badge>
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

      {/* How They Connect */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How Stakeholders Connect
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A vertically integrated platform where each stakeholder plays a vital role
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Flow 1 */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Consultant → Agencies
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Cost consultants issue RFQs to multiple event agencies for large projects. They compare agency proposals, review capabilities, and select the best fit.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Briefcase className="h-4 w-4" />
                  <ArrowRight className="h-3 w-3" />
                  <Building2 className="h-4 w-4" />
                </div>
              </div>

              {/* Flow 2 */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Agency → Suppliers
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Event agencies send RFQs to multiple suppliers. They receive quotes, compare pricing, and compile cost estimates for the consultant review.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building2 className="h-4 w-4" />
                  <ArrowRight className="h-3 w-3" />
                  <Wrench className="h-4 w-4" />
                </div>
              </div>

              {/* Flow 3 */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Agency → Consultant (CE Review)
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Agencies compile cost estimates and submit to consultants. Consultants benchmark against industry standards and verify value for money.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building2 className="h-4 w-4" />
                  <ArrowRight className="h-3 w-3" />
                  <Briefcase className="h-4 w-4" />
                </div>
              </div>

              {/* Flow 4 */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                  Agency/Supplier → Funders
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Event companies and suppliers with approved POs can access working capital from verified funders through the funding marketplace.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building2 className="h-4 w-4" />
                  <Wrench className="h-4 w-4" />
                  <ArrowRight className="h-3 w-3" />
                  <Landmark className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join our waitlist and be among the first to access the platform.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 h-12"
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
