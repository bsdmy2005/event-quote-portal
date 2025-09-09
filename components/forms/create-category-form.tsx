"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createCategoryAction } from "@/actions/categories-actions";
import { Loader2 } from "lucide-react";

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

export function CreateCategoryForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
  });

  const onSubmit = async (data: CreateCategoryFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createCategoryAction(data);
      
      if (result.isSuccess) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        setError(result.message || "Failed to create category");
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

      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g., Catering, AV, Décor"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Category
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
