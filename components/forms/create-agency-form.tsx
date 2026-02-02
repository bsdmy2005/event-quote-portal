"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createAgencyAction } from "@/actions/organizations-actions";
import { createImageAction } from "@/actions/image-galleries-actions";
import { Loader2 } from "lucide-react";
import { SelectCategory } from "@/components/ui/select-category";
import { ImageUpload } from "@/components/ui/image-upload";
import { uploadImage } from "@/lib/r2-storage";
import type { NewImage } from "@/db/schema";

const createAgencySchema = z.object({
  name: z.string().min(1, "Agency name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    // South African phone number validation (supports various formats)
    const saPhoneRegex = /^(\+27|0)[0-9]{9}$|^(\+27|0)[0-9]{2}\s[0-9]{3}\s[0-9]{4}$|^(\+27|0)[0-9]{2}-[0-9]{3}-[0-9]{4}$/;
    return saPhoneRegex.test(val.replace(/\s/g, ''));
  }, "Please enter a valid South African phone number (e.g., +27 11 123 4567 or 011 123 4567)"),
  website: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    // Simple domain validation - just check if it looks like a domain
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/;
    return domainRegex.test(val);
  }, "Please enter a valid domain name (e.g., example.com)"),
  location: z.object({
    street: z.string().min(1, "Street address is required"),
    suburb: z.string().min(1, "Suburb is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  interestCategories: z.array(z.string()).optional(),
  about: z.string().optional(),
});

type CreateAgencyFormData = z.infer<typeof createAgencySchema>;

interface CreateAgencyFormProps {
  categories: Array<{ id: string; name: string }>;
}

export function CreateAgencyForm({ categories }: CreateAgencyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Safety check for categories
  const safeCategories = categories || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAgencyFormData>({
    resolver: zodResolver(createAgencySchema),
  });

  const onSubmit = async (data: CreateAgencyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = {
        ...data,
        interestCategories: selectedCategories,
      };

      const result = await createAgencyAction(formData);
      
      if (result.isSuccess && result.data) {
        // Upload images if any were selected
        if (selectedImages.length > 0) {
          try {
            const uploadPromises = selectedImages.map(async (file) => {
              // Upload to storage
              const uploadResult = await uploadImage(file, "agency", result.data!.id);
              if (!uploadResult.success || !uploadResult.data) {
                throw new Error(uploadResult.error || "Upload failed");
              }

              // Create image record in database
              const imageData: NewImage = {
                organizationId: result.data!.id,
                organizationType: "agency",
                fileName: file.name,
                filePath: uploadResult.data.path,
                fileUrl: uploadResult.data.url,
                fileSize: uploadResult.data.size,
                mimeType: uploadResult.data.type,
                altText: file.name,
                sortOrder: 0,
              };

              return await createImageAction(imageData);
            });

            await Promise.all(uploadPromises);
          } catch (imageError) {
            console.error("Error uploading images:", imageError);
            // Don't fail the entire operation if image upload fails
            setError("Agency created successfully, but some images failed to upload. You can add them later.");
          }
        }

        router.push("/admin");
        router.refresh();
      } else {
        setError(result.message || "Failed to create agency");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Agency Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., EventPro Agency"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName">Contact Name</Label>
          <Input
            id="contactName"
            {...register("contactName")}
            placeholder="e.g., John Doe"
            disabled={isLoading}
          />
          {errors.contactName && (
            <p className="text-sm text-red-600">{errors.contactName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="contact@agency.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+27 11 123 4567 or 011 123 4567"
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          {...register("website")}
          placeholder="example.com"
          disabled={isLoading}
        />
        {errors.website && (
          <p className="text-sm text-red-600">{errors.website.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            {...register("location.street")}
            placeholder="123 Main Street"
            disabled={isLoading}
          />
          {errors.location?.street && (
            <p className="text-sm text-red-600">{errors.location.street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="suburb">Suburb</Label>
            <Input
              id="suburb"
              {...register("location.suburb")}
              placeholder="Sandton"
              disabled={isLoading}
            />
            {errors.location?.suburb && (
              <p className="text-sm text-red-600">{errors.location.suburb.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register("location.city")}
              placeholder="Johannesburg"
              disabled={isLoading}
            />
            {errors.location?.city && (
              <p className="text-sm text-red-600">{errors.location.city.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Input
              id="province"
              {...register("location.province")}
              placeholder="Gauteng"
              disabled={isLoading}
            />
            {errors.location?.province && (
              <p className="text-sm text-red-600">{errors.location.province.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              {...register("location.postalCode")}
              placeholder="2196"
              disabled={isLoading}
            />
            {errors.location?.postalCode && (
              <p className="text-sm text-red-600">{errors.location.postalCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              {...register("location.country")}
              placeholder="South Africa"
              disabled={isLoading}
            />
            {errors.location?.country && (
              <p className="text-sm text-red-600">{errors.location.country.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Areas of Interest</Label>
        {safeCategories.length === 0 ? (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded border">
            ⚠️ No categories available. Please create some categories first in the admin dashboard.
          </div>
        ) : (
          <SelectCategory
            categories={safeCategories}
            selectedCategories={selectedCategories}
            onSelectionChange={setSelectedCategories}
            disabled={isLoading}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <Textarea
          id="about"
          {...register("about")}
          placeholder="Tell us about your agency..."
          rows={4}
          disabled={isLoading}
        />
        {errors.about && (
          <p className="text-sm text-red-600">{errors.about.message}</p>
        )}
      </div>

      <ImageUpload
        selectedFiles={selectedImages}
        onFilesChange={setSelectedImages}
        disabled={isLoading}
        maxFiles={10}
      />

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Agency
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
