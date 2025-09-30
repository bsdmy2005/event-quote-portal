"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, Building2, Wrench, ImageIcon } from "lucide-react"
import { getUserOrganizationAction, updateAgencyAction, updateSupplierAction } from "@/actions/onboarding-actions"
import { publishSupplierAction, unpublishSupplierAction } from "@/actions/organizations-actions"
import { OrganizationSidebar } from "@/components/ui/organization-sidebar"
import ImageManager from "@/components/ui/image-manager"
import { toast } from "sonner"

export default function EditOrganizationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [organization, setOrganization] = useState<any>(null)
  const [orgType, setOrgType] = useState<"agency" | "supplier" | null>(null)
  const [isPublished, setIsPublished] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    province: "",
    country: "South Africa",
    interestCategories: [] as string[],
    serviceCategories: [] as string[],
    about: "",
    servicesText: ""
  })

  const categories = {
    agency: [
      "Corporate Events", "Weddings", "Conferences", "Trade Shows", "Product Launches",
      "Awards Ceremonies", "Team Building", "Gala Dinners", "Exhibitions", "Festivals",
      "Charity Events", "Networking Events", "Training Sessions", "Seminars", "Other"
    ],
    supplier: [
      "Audio Visual", "Catering", "Decor & Styling", "Entertainment", "Photography",
      "Videography", "Lighting", "Sound", "Staging", "Transportation", "Security",
      "Event Management", "Venue", "Equipment Rental", "Floral Design", "Printing",
      "Signage", "Tents & Structures", "Power & Electrical", "Other"
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
          setIsPublished(org.isPublished || false)
          
          setFormData({
            name: org.name || "",
            contactName: org.contactName || "",
            email: org.email || "",
            phone: org.phone || "",
            website: org.website || "",
            city: org.location?.city || "",
            province: org.location?.province || "",
            country: org.location?.country || "South Africa",
            interestCategories: org.interestCategories || [],
            serviceCategories: org.serviceCategories || [],
            about: org.about || "",
            servicesText: org.servicesText || ""
          })
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

  const handleCategoryToggle = (category: string, type: "interest" | "service") => {
    if (type === "interest") {
      setFormData(prev => ({
        ...prev,
        interestCategories: prev.interestCategories.includes(category)
          ? prev.interestCategories.filter(c => c !== category)
          : [...prev.interestCategories, category]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        serviceCategories: prev.serviceCategories.includes(category)
          ? prev.serviceCategories.filter(c => c !== category)
          : [...prev.serviceCategories, category]
      }))
    }
  }

  const handlePublishToggle = async (published: boolean) => {
    if (orgType !== "supplier") return

    try {
      let result
      if (published) {
        result = await publishSupplierAction(organization.id)
      } else {
        result = await unpublishSupplierAction(organization.id)
      }

      if (result.isSuccess) {
        setIsPublished(published)
        toast.success(published ? "Supplier published successfully!" : "Supplier unpublished successfully!")
        // Update the organization state
        setOrganization((prev: any) => ({ ...prev, isPublished: published }))
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to update publication status")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let result
      
      if (orgType === "agency") {
        result = await updateAgencyAction(organization.id, {
          name: formData.name,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          location: {
            city: formData.city,
            province: formData.province,
            country: formData.country
          },
          interestCategories: formData.interestCategories,
          about: formData.about
        })
      } else {
        result = await updateSupplierAction(organization.id, {
          name: formData.name,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          location: {
            city: formData.city,
            province: formData.province,
            country: formData.country
          },
          serviceCategories: formData.serviceCategories,
          servicesText: formData.servicesText
        })
      }

      if (result.isSuccess) {
        toast.success("Organization updated successfully!")
        router.push("/organization")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to update organization. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading organization data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!organization || !orgType) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <p>Organization not found. Please complete onboarding first.</p>
          <Button onClick={() => router.push("/onboard")} className="mt-4">
            Go to Onboarding
          </Button>
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
        activeSection="edit"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Organization</h2>
              <p className="text-gray-600 text-lg">Update your {orgType === "agency" ? "agency" : "supplier"} profile and settings</p>
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
          <div className="space-y-8">
            {/* Organization Information */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Update your organization details. Changes will be reflected immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Organization Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter organization name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactName">Contact Name *</Label>
                        <Input
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                          placeholder="Contact person name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="organization@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+27 XX XXX XXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Cape Town"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">Province *</Label>
                        <Select 
                          value={formData.province} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Western Cape">Western Cape</SelectItem>
                            <SelectItem value="Gauteng">Gauteng</SelectItem>
                            <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                            <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                            <SelectItem value="Free State">Free State</SelectItem>
                            <SelectItem value="Limpopo">Limpopo</SelectItem>
                            <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                            <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                            <SelectItem value="North West">North West</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {orgType === "agency" ? "Interest Categories" : "Service Categories"}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categories[orgType].map((category) => (
                        <Button
                          key={category}
                          type="button"
                          variant={
                            (orgType === "agency" 
                              ? formData.interestCategories.includes(category)
                              : formData.serviceCategories.includes(category)
                            ) ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleCategoryToggle(category, orgType === "agency" ? "interest" : "service")}
                          className="justify-start"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <Label htmlFor={orgType === "agency" ? "about" : "servicesText"}>
                      {orgType === "agency" ? "About Your Agency" : "Services Description"}
                    </Label>
                    <Textarea
                      id={orgType === "agency" ? "about" : "servicesText"}
                      value={orgType === "agency" ? formData.about : formData.servicesText}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        [orgType === "agency" ? "about" : "servicesText"]: e.target.value 
                      }))}
                      placeholder={
                        orgType === "agency" 
                          ? "Tell us about your agency, your experience, and what makes you unique..."
                          : "Describe your services in detail. Include your specialties, experience, and what makes you unique..."
                      }
                      rows={4}
                    />
                  </div>

                  {/* Publication Status (for suppliers only) */}
                  {orgType === "supplier" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div>
                          <Label className="text-base font-medium">Public Visibility</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {isPublished 
                              ? "Your supplier profile is visible to agencies on the public directory"
                              : "Your supplier profile is hidden from the public directory"
                            }
                          </p>
                        </div>
                        <Switch
                          checked={isPublished}
                          onCheckedChange={handlePublishToggle}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-6">
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Portfolio Images */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Portfolio Images
                </CardTitle>
                <CardDescription>
                  {orgType === "agency" 
                    ? "Manage your event portfolio images" 
                    : "Manage your service portfolio images"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageManager 
                  organizationId={organization.id}
                  organizationType={orgType}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
