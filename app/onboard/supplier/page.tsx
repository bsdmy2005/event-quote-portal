"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Wrench, MapPin, Globe, Phone, Mail } from "lucide-react"
import { createSupplierOnboardingAction } from "@/actions/onboarding-actions"
import { toast } from "sonner"

export default function SupplierOnboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contactName: user?.fullName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone: "",
    city: "",
    province: "",
    country: "South Africa",
    serviceCategories: [] as string[],
    servicesText: ""
  })

  const categories = [
    "Audio Visual", "Catering", "Decor & Styling", "Entertainment", "Photography",
    "Videography", "Lighting", "Sound", "Staging", "Transportation", "Security",
    "Event Management", "Venue", "Equipment Rental", "Floral Design", "Printing",
    "Signage", "Tents & Structures", "Power & Electrical", "Other"
  ]

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(category)
        ? prev.serviceCategories.filter(c => c !== category)
        : [...prev.serviceCategories, category]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createSupplierOnboardingAction({
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

      if (result.isSuccess) {
        toast.success("Supplier created successfully!")
        router.push("/onboard/invite?type=supplier&orgId=" + result.data.id)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to create supplier. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 p-4">
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Supplier Profile</h1>
            <p className="text-gray-600">Tell us about your services to start receiving RFQs</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
            <CardDescription>
              Fill in your supplier details. You can update these later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your business name"
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
                      placeholder="Your full name"
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
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h3>
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

              {/* Service Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Categories</h3>
                <p className="text-sm text-gray-600">Select the services you provide</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={formData.serviceCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryToggle(category)}
                      className="justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Services Description */}
              <div className="space-y-4">
                <Label htmlFor="servicesText">Services Description</Label>
                <Textarea
                  id="servicesText"
                  value={formData.servicesText}
                  onChange={(e) => setFormData(prev => ({ ...prev, servicesText: e.target.value }))}
                  placeholder="Describe your services in detail. Include your specialties, experience, and what makes you unique..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isLoading ? "Creating..." : "Create Supplier Profile"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
