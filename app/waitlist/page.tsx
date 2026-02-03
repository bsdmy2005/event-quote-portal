"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Rocket,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Gift,
  ArrowRight,
  Loader2,
  Building2,
  Wrench,
  Briefcase,
  Landmark,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { joinWaitlistAction } from "@/actions/waitlist-actions";

const INTEREST_OPTIONS = [
  { id: "rfqs", label: "Multi-Supplier RFQs" },
  { id: "cost_estimation", label: "Cost Estimation Tools" },
  { id: "tender_distribution", label: "Tender Distribution" },
  { id: "document_storage", label: "Document Storage" },
  { id: "ai_workflows", label: "AI-Powered Workflows" },
  { id: "funding_marketplace", label: "Funding Marketplace" },
  { id: "communication_hub", label: "Communication Hub" },
];

const BENEFITS = [
  {
    icon: Gift,
    title: "Early Access",
    description: "Be first to try new features before public release",
  },
  {
    icon: Zap,
    title: "Priority Onboarding",
    description: "Skip the queue with dedicated setup support",
  },
  {
    icon: Shield,
    title: "Founding Member Perks",
    description: "Exclusive pricing and benefits for early adopters",
  },
  {
    icon: Users,
    title: "Shape the Product",
    description: "Direct input on features and roadmap priorities",
  },
];

export default function WaitlistPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    role: "",
  });

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setSelectedInterests((prev) =>
      checked ? [...prev, interestId] : prev.filter((id) => id !== interestId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await joinWaitlistAction({
        fullName: formData.fullName,
        email: formData.email,
        companyName: formData.companyName || undefined,
        role: formData.role as "agency" | "supplier" | "cost_consultant" | "financier" | "other",
        interests: selectedInterests.length > 0 ? selectedInterests : undefined,
      });

      if (result.isSuccess) {
        setIsSuccess(true);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You&apos;re on the List!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thanks for joining our waitlist. We&apos;ll be in touch soon with
              exclusive early access to the platform.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Link href="/">
                Back to Home
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              Join the Beta Waitlist
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Be First to Experience
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                The Future of Event Procurement
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Join South Africa&apos;s only fully integrated platform connecting cost
              consultants, agencies, suppliers, and financiers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Benefits Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Why Join Early?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Who It's For */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Perfect For:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    <span>Event Agencies</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Wrench className="h-5 w-5 text-green-500" />
                    <span>Suppliers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="h-5 w-5 text-purple-500" />
                    <span>Cost Consultants</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Landmark className="h-5 w-5 text-emerald-500" />
                    <span>Financiers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signup Form */}
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Reserve Your Spot
                  </h2>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Input
                      placeholder="Your company (optional)"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am a... *
                    </label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agency">Event Agency</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="cost_consultant">
                          Cost Consultant
                        </SelectItem>
                        <SelectItem value="financier">Financier</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      I&apos;m interested in... (select all that apply)
                    </label>
                    <div className="space-y-3">
                      {INTEREST_OPTIONS.map((interest) => (
                        <div
                          key={interest.id}
                          className="flex items-center gap-3"
                        >
                          <Checkbox
                            id={interest.id}
                            checked={selectedInterests.includes(interest.id)}
                            onCheckedChange={(checked) =>
                              handleInterestChange(
                                interest.id,
                                checked as boolean
                              )
                            }
                          />
                          <label
                            htmlFor={interest.id}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {interest.label}
                          </label>
                          {["ai_workflows", "funding_marketplace"].includes(
                            interest.id
                          ) && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-amber-100 text-amber-700"
                            >
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !formData.role}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join the Waitlist
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    No spam, ever. We&apos;ll only contact you about early access
                    and important updates.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
