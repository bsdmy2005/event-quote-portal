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
import { ArrowLeft, ArrowRight, Building2, MapPin, Globe, Phone, Mail } from "lucide-react"
import { createAgencyOnboardingAction } from "@/actions/onboarding-actions"
import { createImageAction } from "@/actions/image-galleries-actions"
import { ImageUpload } from "@/components/ui/image-upload"
import { uploadImage } from "@/lib/r2-storage"
import { toast } from "sonner"

export default function AgencyOnboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: "",
    contactName: user?.fullName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone: "",
    website: "",
    city: "",
    province: "",
    country: "South Africa",
    interestCategories: [] as string[],
    about: "",
    isPublished: true
  })

  const categories = [
    "Corporate Events", "Weddings", "Conferences", "Trade Shows", "Product Launches",
    "Awards Ceremonies", "Team Building", "Gala Dinners", "Exhibitions", "Festivals",
    "Charity Events", "Networking Events", "Training Sessions", "Seminars", "Other"
  ]

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      interestCategories: prev.interestCategories.includes(category)
        ? prev.interestCategories.filter(c => c !== category)
        : [...prev.interestCategories, category]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createAgencyOnboardingAction({
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
        about: formData.about,
        isPublished: formData.isPublished
      })

      if (result.isSuccess) {
        // Upload images if any were selected
        if (selectedImages.length > 0) {
          try {
            const uploadPromises = selectedImages.map(async (file) => {
              // Upload to storage
              const uploadResult = await uploadImage(file, "agency", result.data.id);
              if (!uploadResult.success || !uploadResult.data) {
                throw new Error(`Failed to upload ${file.name}`);
              }
              
              // Create image record in database
              const imageResult = await createImageAction({
                organizationId: result.data.id,
                organizationType: "agency",
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
            toast.error("Agency created successfully, but some images failed to upload. You can add them later.");
          }
        }
        
        toast.success("Agency created successfully!")
        router.push("/onboard/invite?type=agency&orgId=" + result.data.id)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to create agency. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Agency</h1>
            <p className="text-gray-600">Tell us about your agency to get started</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agency Information</CardTitle>
            <CardDescription>
              Fill in your agency details. You can update these later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Agency Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your agency name"
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

              {/* Interest Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Event Categories</h3>
                <p className="text-sm text-gray-600">Select the types of events you typically organize</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={formData.interestCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryToggle(category)}
                      className="justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* About */}
              <div className="space-y-4">
                <Label htmlFor="about">About Your Agency</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                  placeholder="Tell us about your agency, your experience, and what makes you unique..."
                  rows={4}
                />
              </div>

              {/* Publication Visibility */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublished">Make Agency Public</Label>
                    <p className="text-sm text-gray-600">
                      Allow your agency to be visible on the public agencies page
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
                <p className="text-sm text-gray-600">Upload images showcasing your work and events (optional)</p>
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
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isLoading ? "Creating..." : "Create Agency"}
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
