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
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ArrowRight, Wrench, MapPin, Globe, Phone, Mail } from "lucide-react"
import { createSupplierOnboardingAction } from "@/actions/onboarding-actions"
import { createImageAction } from "@/actions/image-galleries-actions"
import { ImageUpload } from "@/components/ui/image-upload"
import { uploadImage } from "@/lib/supabase-storage"
import { toast } from "sonner"

export default function SupplierOnboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    contactName: user?.fullName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone: "",
    city: "",
    province: "",
    country: "South Africa",
    serviceCategories: [] as string[],
    servicesText: "",
    isPublished: true
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
    setValidationErrors({})

    // Validate all required fields
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "Business name is required"
    }
    if (!formData.contactName.trim()) {
      errors.contactName = "Contact name is required"
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    }
    if (!formData.city.trim()) {
      errors.city = "City is required"
    }
    if (!formData.province.trim()) {
      errors.province = "Province is required"
    }
    if (formData.serviceCategories.length === 0) {
      errors.serviceCategories = "Please select at least one service category"
    }

    // If there are validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setIsLoading(false)
      
      // Show a general error message
      const errorFields = Object.keys(errors)
      toast.error(`Please complete the following fields: ${errorFields.join(", ")}`)
      return
    }

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
        servicesText: formData.servicesText,
        isPublished: formData.isPublished
      })

      console.log("Supplier creation result:", result)

      if (result.isSuccess) {
        // Upload images if any were selected
        if (selectedImages.length > 0) {
          try {
            const uploadPromises = selectedImages.map(async (file) => {
              // Upload to storage
              const uploadResult = await uploadImage(file, "supplier", result.data.id);
              if (!uploadResult.success || !uploadResult.data) {
                throw new Error(`Failed to upload ${file.name}`);
              }
              
              // Create image record in database
              const imageResult = await createImageAction({
                organizationId: result.data.id,
                organizationType: "supplier",
                fileName: file.name,
                filePath: uploadResult.data.path,
                fileUrl: uploadResult.data.url,
                mimeType: uploadResult.data.type,
                altText: file.name,
                isFeatured: false
              });
              
              if (!imageResult.isSuccess) {
                throw new Error(`Failed to save image record for ${file.name}`);
              }
            });
            
            await Promise.all(uploadPromises);
          } catch (imageError) {
            console.error("Error uploading images:", imageError);
            // Don't fail the entire operation if image upload fails
            toast.error("Supplier created successfully, but some images failed to upload. You can add them later.");
          }
        }
        
        toast.success("Supplier created successfully!")
        router.push("/onboard/invite?type=supplier&orgId=" + result.data.id)
      } else {
        console.error("Supplier creation failed:", result.message)
        toast.error(result.message || "Failed to create supplier")
      }
    } catch (error) {
      console.error("Unexpected error creating supplier:", error)
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
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }))
                      if (validationErrors.name) {
                        setValidationErrors(prev => ({ ...prev, name: "" }))
                      }
                    }}
                    placeholder="Enter your business name"
                    className={validationErrors.name ? "border-red-500 focus:border-red-500" : ""}
                    required
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, contactName: e.target.value }))
                        if (validationErrors.contactName) {
                          setValidationErrors(prev => ({ ...prev, contactName: "" }))
                        }
                      }}
                      placeholder="Your full name"
                      className={validationErrors.contactName ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    {validationErrors.contactName && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.contactName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }))
                        if (validationErrors.email) {
                          setValidationErrors(prev => ({ ...prev, email: "" }))
                        }
                      }}
                      placeholder="your@email.com"
                      className={validationErrors.email ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
                    )}
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
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, city: e.target.value }))
                        if (validationErrors.city) {
                          setValidationErrors(prev => ({ ...prev, city: "" }))
                        }
                      }}
                      placeholder="Cape Town"
                      className={validationErrors.city ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    {validationErrors.city && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Select 
                      value={formData.province} 
                      onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, province: value }))
                        if (validationErrors.province) {
                          setValidationErrors(prev => ({ ...prev, province: "" }))
                        }
                      }}
                    >
                      <SelectTrigger className={validationErrors.province ? "border-red-500 focus:border-red-500" : ""}>
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
                    {validationErrors.province && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.province}</p>
                    )}
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
                <h3 className="text-lg font-semibold">Service Categories *</h3>
                <p className="text-sm text-gray-600">Select the services you provide (at least one required)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={formData.serviceCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        handleCategoryToggle(category)
                        if (validationErrors.serviceCategories) {
                          setValidationErrors(prev => ({ ...prev, serviceCategories: "" }))
                        }
                      }}
                      className="justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                {validationErrors.serviceCategories && (
                  <p className="text-sm text-red-600">{validationErrors.serviceCategories}</p>
                )}
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

              {/* Publication Visibility */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublished">Make Supplier Public</Label>
                    <p className="text-sm text-gray-600">
                      Allow your supplier profile to be visible on the public suppliers page
                    </p>
                  </div>
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <Label>Portfolio Images</Label>
                <p className="text-sm text-gray-600">Upload images showcasing your work and services (optional)</p>
                <ImageUpload
                  selectedFiles={selectedImages}
                  onFilesChange={setSelectedImages}
                  disabled={isLoading}
                  maxFiles={10}
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
