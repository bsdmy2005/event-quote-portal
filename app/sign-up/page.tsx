"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Wrench, ArrowRight, Users, Briefcase } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<"agency" | "supplier" | null>(null)

  const handleRoleSelection = (role: "agency" | "supplier") => {
    console.log("Role selected:", role)
    setSelectedRole(role)
    // Store the selected role in localStorage to use after Clerk sign-up
    localStorage.setItem("selectedSignUpRole", role)
    // Redirect to Clerk sign-up
    console.log("Redirecting to:", `/sign-up/${role}`)
    // Use window.location.href instead of router.push for more reliable navigation
    window.location.href = `/sign-up/${role}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Join Quote Portal</CardTitle>
          <CardDescription className="text-lg">
            Choose your role to get started with the right onboarding experience
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Agency Option */}
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === "agency" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleRoleSelection("agency")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">I'm an Agency</h3>
                <p className="text-gray-600 mb-4">
                  I plan events and need to find suppliers for my clients
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Send RFQs to suppliers</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Manage client projects</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  asChild
                >
                  <Link href="/sign-up/agency">
                    Sign Up as Agency
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Supplier Option */}
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === "supplier" ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleRoleSelection("supplier")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">I'm a Supplier</h3>
                <p className="text-gray-600 mb-4">
                  I provide services and want to receive RFQs from agencies
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Receive RFQ requests</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Connect with agencies</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  asChild
                >
                  <Link href="/sign-up/supplier">
                    Sign Up as Supplier
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
