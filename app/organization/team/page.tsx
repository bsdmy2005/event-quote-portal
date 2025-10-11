"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Wrench, UserPlus, Mail, Users, Trash2, Plus, RefreshCw } from "lucide-react"
import { getUserOrganizationAction, sendTeamInviteAction, getTeamMembersAction, getPendingInvitationsAction } from "@/actions/onboarding-actions"
import { OrganizationSidebar } from "@/components/ui/organization-sidebar"
import { toast } from "sonner"

export default function TeamManagementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [organization, setOrganization] = useState<any>(null)
  const [orgType, setOrgType] = useState<"agency" | "supplier" | null>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [pendingInvites, setPendingInvites] = useState<any[]>([])
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: ""
  })

  const roles = {
    agency: [
      { value: "agency_member", label: "Agency Member" },
      { value: "agency_admin", label: "Agency Admin" }
    ],
    supplier: [
      { value: "supplier_member", label: "Supplier Member" },
      { value: "supplier_admin", label: "Supplier Admin" }
    ]
  }

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const result = await getUserOrganizationAction()
        if (result.isSuccess && result.data) {
          const { organization: org, orgType: type } = result.data
          setOrganization(org)
          setOrgType(type)
          
          // Load team members and pending invitations
          const [teamResult, invitesResult] = await Promise.all([
            getTeamMembersAction(type, org.id),
            getPendingInvitationsAction(type, org.id)
          ])
          
          if (teamResult.isSuccess && teamResult.data) {
            setTeamMembers(teamResult.data)
          }
          
          if (invitesResult.isSuccess && invitesResult.data) {
            setPendingInvites(invitesResult.data)
          }
        } else {
          router.push("/onboard")
        }
      } catch (error) {
        console.error("Error loading organization:", error)
        toast.error("Failed to load organization data")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadOrganization()
  }, [router])

  const refreshData = async () => {
    if (!organization || !orgType) return
    
    setIsRefreshing(true)
    try {
      const [teamResult, invitesResult] = await Promise.all([
        getTeamMembersAction(orgType, organization.id),
        getPendingInvitationsAction(orgType, organization.id)
      ])
      
      if (teamResult.isSuccess && teamResult.data) {
        setTeamMembers(teamResult.data)
      }
      
      if (invitesResult.isSuccess && invitesResult.data) {
        setPendingInvites(invitesResult.data)
      }
    } catch (error) {
      console.error("Error refreshing data:", error)
      toast.error("Failed to refresh data")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await sendTeamInviteAction({
        orgType: orgType!,
        orgId: organization.id,
        email: inviteForm.email,
        role: inviteForm.role
      })

      if (result.isSuccess) {
        toast.success("Team invitation sent successfully!")
        setInviteForm({ email: "", role: "" })
        
        // Refresh pending invitations after sending new invitation
        const invitesResult = await getPendingInvitationsAction(orgType!, organization.id)
        if (invitesResult.isSuccess && invitesResult.data) {
          setPendingInvites(invitesResult.data)
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading team data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!organization || !orgType) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p>Organization not found. Please complete onboarding first.</p>
            <Button onClick={() => router.push("/onboard")} className="mt-4">
              Go to Onboarding
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <OrganizationSidebar 
        orgType={orgType}
        organizationName={organization.name}
        activeSection="team"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h2>
              <p className="text-gray-600 text-lg">Manage your {orgType === "agency" ? "agency" : "supplier"} team members</p>
            </div>
            <div className="flex items-center gap-3">
              {orgType === "agency" ? (
                <Building2 className="h-8 w-8 text-blue-600" />
              ) : (
                <Wrench className="h-8 w-8 text-green-600" />
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invite Team Member */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Invite Team Member
                </CardTitle>
                <CardDescription>
                  Send an invitation to add a new team member to your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="team.member@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Select 
                      value={inviteForm.role} 
                      onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles[orgType].map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {isLoading ? "Sending..." : "Send Invitation"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Current Team Members
                    </CardTitle>
                    <CardDescription>
                      Manage existing team members and their roles
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    disabled={isRefreshing}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member, index) => (
                      <div key={member.userId || index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">
                                {member.firstName?.charAt(0) || member.email?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.firstName && member.lastName 
                                  ? `${member.firstName} ${member.lastName}` 
                                  : member.email}
                              </p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {member.role?.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No team members yet</p>
                      <p className="text-sm">Invite team members to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Invitations */}
          <Card className="border-0 shadow-sm bg-white rounded-xl mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Invitations</CardTitle>
                  <CardDescription>
                    Team members who have been invited but haven't joined yet
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pendingInvites.length > 0 ? (
                <div className="space-y-4">
                  {pendingInvites
                    .filter(invite => !invite.acceptedAt && invite.expiresAt > new Date())
                    .map((invite, index) => (
                      <div key={invite.id || index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                              <Mail className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{invite.email}</p>
                              <p className="text-sm text-gray-500">
                                Invited as {invite.role?.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Pending
                            </span>
                            <span className="text-xs text-gray-500">
                              Expires {new Date(invite.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending invitations</p>
                  <p className="text-sm">Invitations will appear here until they're accepted</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
