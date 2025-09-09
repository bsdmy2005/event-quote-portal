"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteCategoryAction } from "@/actions/categories-actions";
import { deleteAgencyAction, deleteSupplierAction } from "@/actions/organizations-actions";
import { useRouter } from "next/navigation";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
}

interface DeleteAgencyButtonProps {
  agencyId: string;
  agencyName: string;
}

interface DeleteSupplierButtonProps {
  supplierId: string;
  supplierName: string;
}

export function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteCategoryAction(categoryId);
      if (result.isSuccess) {
        router.refresh();
      } else {
        alert(`Failed to delete category: ${result.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export function DeleteAgencyButton({ agencyId, agencyName }: DeleteAgencyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${agencyName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAgencyAction(agencyId);
      if (result.isSuccess) {
        router.refresh();
      } else {
        alert(`Failed to delete agency: ${result.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the agency");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export function DeleteSupplierButton({ supplierId, supplierName }: DeleteSupplierButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${supplierName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteSupplierAction(supplierId);
      if (result.isSuccess) {
        router.refresh();
      } else {
        alert(`Failed to delete supplier: ${result.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the supplier");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
