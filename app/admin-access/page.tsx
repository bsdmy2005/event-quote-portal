"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowRight, AlertTriangle } from "lucide-react"
import { promoteToAdminAction } from "@/actions/onboarding-actions"
import { toast } from "sonner"

export default function AdminAccessPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePromoteToAdmin = async () => {
    setIsLoading(true)
    try {
      const result = await promoteToAdminAction()
      if (result.isSuccess) {
        toast.success("You are now an admin!")
        router.push("/admin")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to promote to admin")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Promote your account to admin for development and testing
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Development Only</p>
                <p className="text-yellow-700">
                  This feature is for development and testing purposes only. 
                  In production, admin access should be granted through proper channels.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Admin privileges include:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Create and manage agencies</li>
              <li>• Create and manage suppliers</li>
              <li>• Manage categories</li>
              <li>• Access admin dashboard</li>
              <li>• Full system access</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handlePromoteToAdmin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              {isLoading ? "Promoting..." : "Promote to Admin"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
