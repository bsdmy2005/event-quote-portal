"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateCategoryAction } from "@/actions/categories-actions";
import { Loader2 } from "lucide-react";
import { SelectCategory } from "@/db/schema/categories-schema";

const editCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type EditCategoryFormData = z.infer<typeof editCategorySchema>;

interface EditCategoryFormProps {
  category: SelectCategory;
}

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategorySchema),
  });

  // Initialize form with existing data
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: EditCategoryFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateCategoryAction(category.id, data);
      
      if (result.isSuccess) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.message || "Failed to update category");
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

      <div className="space-y-3">
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
          Category Name
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g., Catering Services"
          disabled={isLoading}
          className="h-11 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-blue-200"
        />
        {errors.name && (
          <p className="text-sm text-red-600 font-medium">{errors.name.message}</p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm rounded-lg px-6 py-3 font-semibold transition-all duration-200 h-12"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Category
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
