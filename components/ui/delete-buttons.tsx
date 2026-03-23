"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteCategoryAction } from "@/actions/categories-actions";
import { deleteAgencyAction, deleteSupplierAction } from "@/actions/organizations-actions";
import { useRouter } from "next/navigation";
import { notifyActionResult, notifyUnexpectedError } from "@/lib/client-action-feedback";

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
      if (notifyActionResult(result, {
        successMessage: `Category "${categoryName}" deleted`,
        errorMessage: `Failed to delete category`,
      })) {
        router.refresh();
      }
    } catch {
      notifyUnexpectedError("delete category");
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
      className="h-8 w-8 p-0 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
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
      if (notifyActionResult(result, {
        successMessage: `Agency "${agencyName}" deleted`,
        errorMessage: `Failed to delete agency`,
      })) {
        router.refresh();
      }
    } catch {
      notifyUnexpectedError("delete agency");
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
      className="h-8 w-8 p-0 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
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
      if (notifyActionResult(result, {
        successMessage: `Supplier "${supplierName}" deleted`,
        errorMessage: `Failed to delete supplier`,
      })) {
        router.refresh();
      }
    } catch {
      notifyUnexpectedError("delete supplier");
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
      className="h-8 w-8 p-0 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
