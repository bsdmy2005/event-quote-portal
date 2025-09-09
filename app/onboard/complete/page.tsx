"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Building2, Wrench, Users, Mail, Calendar } from "lucide-react"

export default function OnboardCompletePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="text-center">
          <CardHeader className="pb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Quote Portal!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Your organization has been successfully created and you're all set to start using the platform.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Success Steps */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">What's Next?</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Organization Created</div>
                    <div className="text-sm text-gray-600">Your profile is ready and active</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Team Invitations</div>
                    <div className="text-sm text-gray-600">Invite team members to collaborate</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Start Using the Platform</div>
                    <div className="text-sm text-gray-600">Browse suppliers, send RFQs, or manage your profile</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => router.push("/dashboard")}
                >
                  <Building2 className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Go to Dashboard</div>
                    <div className="text-xs text-gray-500">Manage your organization</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => router.push("/agencies")}
                >
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Browse Directory</div>
                    <div className="text-xs text-gray-500">Find agencies or suppliers</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Auto Redirect Notice */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">
                  You'll be automatically redirected to your dashboard in a few seconds...
                </span>
              </div>
            </div>

            {/* Manual Redirect Button */}
            <Button 
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
