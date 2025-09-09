"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Users, Mail, Plus, X, CheckCircle } from "lucide-react"
import { sendTeamInviteAction } from "@/actions/onboarding-actions"
import { toast } from "sonner"

interface TeamMember {
  email: string
  role: string
}

export default function InvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orgType = searchParams.get("type") as "agency" | "supplier"
  const orgId = searchParams.get("orgId")
  
  const [isLoading, setIsLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [currentMember, setCurrentMember] = useState<TeamMember>({
    email: "",
    role: orgType === "agency" ? "agency_member" : "supplier_member"
  })

  const roleOptions = orgType === "agency" 
    ? [
        { value: "agency_admin", label: "Agency Admin" },
        { value: "agency_member", label: "Agency Member" }
      ]
    : [
        { value: "supplier_admin", label: "Supplier Admin" },
        { value: "supplier_member", label: "Supplier Member" }
      ]

  const addTeamMember = () => {
    if (currentMember.email && currentMember.role) {
      setTeamMembers(prev => [...prev, currentMember])
      setCurrentMember({
        email: "",
        role: orgType === "agency" ? "agency_member" : "supplier_member"
      })
    }
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index))
  }

  const handleSendInvites = async () => {
    if (teamMembers.length === 0) {
      router.push("/onboard/complete")
      return
    }

    setIsLoading(true)
    try {
      const results = await Promise.all(
        teamMembers.map(member => 
          sendTeamInviteAction({
            orgType,
            orgId: orgId!,
            email: member.email,
            role: member.role
          })
        )
      )

      const successCount = results.filter((r: any) => r.isSuccess).length
      if (successCount > 0) {
        toast.success(`${successCount} invitation${successCount > 1 ? 's' : ''} sent successfully!`)
      }
      
      router.push("/onboard/complete")
    } catch (error) {
      toast.error("Failed to send some invitations. You can invite team members later.")
      router.push("/onboard/complete")
    } finally {
      setIsLoading(false)
    }
  }

  const skipInvites = () => {
    router.push("/onboard/complete")
  }

  if (!orgType || !orgId) {
    router.push("/onboard")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite Your Team</h1>
            <p className="text-gray-600">
              Add team members to help manage your {orgType === "agency" ? "agency" : "supplier"} profile
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Invite colleagues to join your organization. You can always add more members later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Team Member Form */}
            <div className="space-y-4 p-4 border-2 border-dashed border-gray-200 rounded-lg">
              <h3 className="font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Team Member
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentMember.email}
                    onChange={(e) => setCurrentMember(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="colleague@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={currentMember.role} 
                    onValueChange={(value) => setCurrentMember(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                type="button"
                onClick={addTeamMember}
                disabled={!currentMember.email || !currentMember.role}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Team Members List */}
            {teamMembers.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Team Members to Invite</h3>
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{member.email}</div>
                        <div className="text-sm text-gray-500">
                          {roleOptions.find(r => r.value === member.role)?.label}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Role Descriptions */}
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Role Permissions</h3>
              <div className="space-y-2 text-sm">
                {orgType === "agency" ? (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Agency Admin:</strong> Full access to manage agency profile, send RFQs, and invite team members
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Agency Member:</strong> Can browse suppliers, create RFQs, and view submissions
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Supplier Admin:</strong> Full access to manage supplier profile, services, and invite team members
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Supplier Member:</strong> Can view RFQs and submit quotations
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                variant="outline" 
                onClick={skipInvites}
                className="flex-1"
              >
                Skip for Now
              </Button>
              <Button 
                onClick={handleSendInvites}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? "Sending..." : "Send Invitations"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
