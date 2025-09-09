"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Users, Building2, Wrench } from "lucide-react"
import { acceptTeamInviteAction } from "@/actions/onboarding-actions"
import { toast } from "sonner"

export default function AcceptInvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired" | "already_accepted">("loading")
  const [inviteData, setInviteData] = useState<any>(null)

  const token = searchParams.get("token")

  useEffect(() => {
    const handleInvite = async () => {
      if (!isLoaded) return
      
      if (!token) {
        setStatus("error")
        return
      }

      if (!user) {
        // User needs to sign in first
        router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`)
        return
      }

      setIsLoading(true)
      try {
        const result = await acceptTeamInviteAction(token)
        
        if (result.isSuccess) {
          setStatus("success")
          toast.success("Invitation accepted successfully!")
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        } else {
          if (result.message.includes("expired")) {
            setStatus("expired")
          } else if (result.message.includes("already been accepted")) {
            setStatus("already_accepted")
          } else {
            setStatus("error")
          }
          toast.error(result.message)
        }
      } catch (error) {
        console.error("Error accepting invite:", error)
        setStatus("error")
        toast.error("Failed to accept invitation")
      } finally {
        setIsLoading(false)
      }
    }

    handleInvite()
  }, [isLoaded, user, token, router])

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Invitation</h2>
            <p className="text-gray-600">Please wait while we process your invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "success" && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          )}
          {status === "error" && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          )}
          {status === "expired" && (
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-yellow-600" />
            </div>
          )}
          {status === "already_accepted" && (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          )}
          
          <CardTitle className="text-2xl">
            {status === "success" && "Welcome to the Team!"}
            {status === "error" && "Invitation Error"}
            {status === "expired" && "Invitation Expired"}
            {status === "already_accepted" && "Already Accepted"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {status === "success" && (
            <>
              <CardDescription className="text-lg">
                You've successfully joined the organization!
              </CardDescription>
              <p className="text-gray-600">
                You can now access your dashboard and start collaborating with your team.
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
          
          {status === "error" && (
            <>
              <CardDescription className="text-lg">
                There was an error processing your invitation.
              </CardDescription>
              <p className="text-gray-600">
                The invitation link may be invalid or you may not have permission to accept it.
              </p>
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full"
                >
                  Go to Homepage
                </Button>
                <Button 
                  onClick={() => router.push("/sign-in")}
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            </>
          )}
          
          {status === "expired" && (
            <>
              <CardDescription className="text-lg">
                This invitation has expired.
              </CardDescription>
              <p className="text-gray-600">
                Invitation links are valid for 7 days. Please contact the person who invited you for a new invitation.
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => router.push("/")}
                  className="w-full"
                >
                  Go to Homepage
                </Button>
              </div>
            </>
          )}
          
          {status === "already_accepted" && (
            <>
              <CardDescription className="text-lg">
                This invitation has already been accepted.
              </CardDescription>
              <p className="text-gray-600">
                You may have already accepted this invitation, or someone else has used this link.
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
