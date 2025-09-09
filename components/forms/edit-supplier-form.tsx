"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateSupplierAction } from "@/actions/organizations-actions";
import { Loader2 } from "lucide-react";
import { SelectCategory } from "@/components/ui/select-category";
import { ImageGallery } from "@/components/ui/image-gallery";
import { SelectSupplier } from "@/db/schema/organizations-schema";

const editSupplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
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
  serviceCategories: z.array(z.string()).optional(),
  servicesText: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type EditSupplierFormData = z.infer<typeof editSupplierSchema>;

interface EditSupplierFormProps {
  supplier: SelectSupplier;
  categories: Array<{ id: string; name: string }>;
}

export function EditSupplierForm({ supplier, categories }: EditSupplierFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Safety check for categories
  const safeCategories = categories || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditSupplierFormData>({
    resolver: zodResolver(editSupplierSchema),
  });

  // Initialize form with existing data
  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        contactName: supplier.contactName,
        email: supplier.email,
        phone: supplier.phone || "",
        location: {
          street: supplier.location?.street || "",
          suburb: supplier.location?.suburb || "",
          city: supplier.location?.city || "",
          province: supplier.location?.province || "",
          postalCode: supplier.location?.postalCode || "",
          country: supplier.location?.country || "",
        },
        servicesText: supplier.servicesText || "",
        isPublished: supplier.isPublished,
      });
      setSelectedCategories(supplier.serviceCategories || []);
    }
  }, [supplier, reset]);

  const onSubmit = async (data: EditSupplierFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = {
        ...data,
        serviceCategories: selectedCategories,
      };

      const result = await updateSupplierAction(supplier.id, formData);
      
      if (result.isSuccess) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.message || "Failed to update supplier");
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
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
            Supplier Name
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., Premium Catering Co."
            disabled={isLoading}
            className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
          />
          {errors.name && (
            <p className="text-sm text-red-600 font-medium">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="contactName" className="text-sm font-semibold text-gray-700">
            Contact Name
          </Label>
          <Input
            id="contactName"
            {...register("contactName")}
            placeholder="e.g., Jane Smith"
            disabled={isLoading}
            className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
          />
          {errors.contactName && (
            <p className="text-sm text-red-600 font-medium">{errors.contactName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="contact@supplier.com"
            disabled={isLoading}
            className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
          />
          {errors.email && (
            <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
            Phone (Optional)
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+27 11 123 4567 or 011 123 4567"
            disabled={isLoading}
            className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
          />
          {errors.phone && (
            <p className="text-sm text-red-600 font-medium">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="website" className="text-sm font-semibold text-gray-700">
          Website (Optional)
        </Label>
        <Input
          id="website"
          {...register("website")}
          placeholder="example.com"
          disabled={isLoading}
          className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
        />
        {errors.website && (
          <p className="text-sm text-red-600 font-medium">{errors.website.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="street" className="text-sm font-semibold text-gray-700">
            Street Address
          </Label>
          <Input
            id="street"
            {...register("location.street")}
            placeholder="123 Main Street"
            disabled={isLoading}
            className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
          />
          {errors.location?.street && (
            <p className="text-sm text-red-600 font-medium">{errors.location.street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="suburb" className="text-sm font-semibold text-gray-700">
              Suburb
            </Label>
            <Input
              id="suburb"
              {...register("location.suburb")}
              placeholder="Sandton"
              disabled={isLoading}
              className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
            />
            {errors.location?.suburb && (
              <p className="text-sm text-red-600 font-medium">{errors.location.suburb.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
              City
            </Label>
            <Input
              id="city"
              {...register("location.city")}
              placeholder="Johannesburg"
              disabled={isLoading}
              className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
            />
            {errors.location?.city && (
              <p className="text-sm text-red-600 font-medium">{errors.location.city.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="province" className="text-sm font-semibold text-gray-700">
              Province
            </Label>
            <Input
              id="province"
              {...register("location.province")}
              placeholder="Gauteng"
              disabled={isLoading}
              className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
            />
            {errors.location?.province && (
              <p className="text-sm text-red-600 font-medium">{errors.location.province.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="postalCode" className="text-sm font-semibold text-gray-700">
              Postal Code
            </Label>
            <Input
              id="postalCode"
              {...register("location.postalCode")}
              placeholder="2196"
              disabled={isLoading}
              className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
            />
            {errors.location?.postalCode && (
              <p className="text-sm text-red-600 font-medium">{errors.location.postalCode.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
              Country
            </Label>
            <Input
              id="country"
              {...register("location.country")}
              placeholder="South Africa"
              disabled={isLoading}
              className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
            />
            {errors.location?.country && (
              <p className="text-sm text-red-600 font-medium">{errors.location.country.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          Service Categories
        </Label>
        {safeCategories.length === 0 ? (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
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

      <div className="space-y-3">
        <Label htmlFor="servicesText" className="text-sm font-semibold text-gray-700">
          Services Description
        </Label>
        <Textarea
          id="servicesText"
          {...register("servicesText")}
          placeholder="Describe your services..."
          rows={4}
          disabled={isLoading}
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
        />
        {errors.servicesText && (
          <p className="text-sm text-red-600 font-medium">{errors.servicesText.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          Images
        </Label>
        <ImageGallery
          organizationId={supplier.id}
          organizationType="supplier"
          maxFiles={10}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm rounded-lg px-6 py-3 font-semibold transition-all duration-200 h-12"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Supplier
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
          disabled={isLoading}
          className="border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 rounded-lg px-6 py-3 font-semibold transition-all duration-200 h-12"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
