"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Wrench, ArrowRight, CheckCircle, Users, Zap } from "lucide-react"

export default function OnboardPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<"agency" | "supplier" | null>(null)

  // Check for selected role from sign-up flow
  useEffect(() => {
    const selectedRole = localStorage.getItem("selectedSignUpRole")
    if (selectedRole === "agency" || selectedRole === "supplier") {
      setSelectedType(selectedRole)
      // Clear the stored role and auto-redirect
      localStorage.removeItem("selectedSignUpRole")
      router.push(`/onboard/${selectedRole}`)
    }
  }, [router])

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/onboard/${selectedType}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to Quote Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let's get your organization set up. Choose your role to get started with the onboarding process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Agency Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedType === "agency" 
                ? "ring-2 ring-blue-500 shadow-xl" 
                : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedType("agency")}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">I'm an Agency</CardTitle>
              <CardDescription className="text-base">
                I plan events and need to find suppliers for my projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Send RFQs to multiple suppliers</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Browse supplier directory</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Manage cost estimates</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Invite team members</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedType === "supplier" 
                ? "ring-2 ring-green-500 shadow-xl" 
                : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedType("supplier")}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">I'm a Supplier</CardTitle>
              <CardDescription className="text-base">
                I provide services and want to receive RFQs from agencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Receive qualified RFQ invitations</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Submit PDF quotations</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Manage your service profile</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Invite team members</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleContinue}
            disabled={!selectedType}
            className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Continue to Setup
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Team Collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Quick Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Secure Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
