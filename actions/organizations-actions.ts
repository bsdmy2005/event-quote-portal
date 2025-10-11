"use server";

import { 
  // Agency actions
  createAgency,
  deleteAgency,
  getAllAgencies,
  getAllAgenciesWithImages,
  getAgencyById,
  getAgencyByIdWithImages,
  getAgencyByEmail,
  updateAgency,
  searchAgencies,
  // Supplier actions
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  getSupplierByIdWithImages,
  getSupplierByEmail,
  updateSupplier,
  getPublishedSuppliers,
  getPublishedSuppliersWithImages,
  searchSuppliers,
  publishSupplier,
  unpublishSupplier
} from "@/db/queries/organizations-queries";
import { InsertAgency, SelectAgency, InsertSupplier, SelectSupplier } from "@/db/schema/organizations-schema";
import { ActionResult } from "@/types/actions/action-types";
import { revalidatePath } from "next/cache";

// Agency Actions
export async function createAgencyAction(data: InsertAgency): Promise<ActionResult<SelectAgency>> {
  try {
    const newAgency = await createAgency(data);
    revalidatePath("/admin/agencies");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Agency created successfully", data: newAgency };
  } catch (error) {
    console.error("Error creating agency:", error);
    // Return user-friendly error message
    const errorMessage = error instanceof Error ? error.message : "Failed to create agency. Please try again.";
    return { isSuccess: false, message: errorMessage };
  }
}

export async function getAgencyByIdAction(id: string): Promise<ActionResult<SelectAgency>> {
  try {
    const agency = await getAgencyById(id);
    return { isSuccess: true, message: "Agency retrieved successfully", data: agency };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get agency" };
  }
}

export async function getAgencyByIdWithImagesAction(id: string): Promise<ActionResult<any>> {
  try {
    const agency = await getAgencyByIdWithImages(id);
    if (!agency) {
      return { isSuccess: false, message: "Agency not found" };
    }
    return { isSuccess: true, message: "Agency retrieved successfully", data: agency };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get agency" };
  }
}

export async function getAllAgenciesAction(): Promise<ActionResult<SelectAgency[]>> {
  try {
    const agencies = await getAllAgencies();
    return { isSuccess: true, message: "Agencies retrieved successfully", data: agencies };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get agencies" };
  }
}

export async function getAgencyByEmailAction(email: string): Promise<ActionResult<SelectAgency | null>> {
  try {
    const agency = await getAgencyByEmail(email);
    return { isSuccess: true, message: "Agency retrieved successfully", data: agency };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get agency by email" };
  }
}

export async function updateAgencyAction(id: string, data: Partial<InsertAgency>): Promise<ActionResult<SelectAgency>> {
  try {
    const updatedAgency = await updateAgency(id, data);
    revalidatePath("/admin/agencies");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Agency updated successfully", data: updatedAgency };
  } catch (error) {
    return { isSuccess: false, message: "Failed to update agency" };
  }
}

export async function deleteAgencyAction(id: string): Promise<ActionResult<void>> {
  try {
    await deleteAgency(id);
    revalidatePath("/admin/agencies");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Agency deleted successfully" };
  } catch (error) {
    return { isSuccess: false, message: "Failed to delete agency" };
  }
}

export async function searchAgenciesAction(query: string): Promise<ActionResult<SelectAgency[]>> {
  try {
    const agencies = await searchAgencies(query);
    return { isSuccess: true, message: "Agencies search completed", data: agencies };
  } catch (error) {
    return { isSuccess: false, message: "Failed to search agencies" };
  }
}

// Supplier Actions
export async function createSupplierAction(data: InsertSupplier): Promise<ActionResult<SelectSupplier>> {
  try {
    const newSupplier = await createSupplier(data);
    revalidatePath("/admin/suppliers");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Supplier created successfully", data: newSupplier };
  } catch (error) {
    console.error("Error creating supplier:", error);
    // Return user-friendly error message
    const errorMessage = error instanceof Error ? error.message : "Failed to create supplier. Please try again.";
    return { isSuccess: false, message: errorMessage };
  }
}

export async function getSupplierByIdAction(id: string): Promise<ActionResult<SelectSupplier>> {
  try {
    const supplier = await getSupplierById(id);
    return { isSuccess: true, message: "Supplier retrieved successfully", data: supplier };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get supplier" };
  }
}

export async function getSupplierByIdWithImagesAction(id: string): Promise<ActionResult<any>> {
  try {
    const supplier = await getSupplierByIdWithImages(id);
    if (!supplier) {
      return { isSuccess: false, message: "Supplier not found" };
    }
    return { isSuccess: true, message: "Supplier retrieved successfully", data: supplier };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get supplier" };
  }
}

export async function getAllSuppliersAction(): Promise<ActionResult<SelectSupplier[]>> {
  try {
    const suppliers = await getAllSuppliers();
    return { isSuccess: true, message: "Suppliers retrieved successfully", data: suppliers };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get suppliers" };
  }
}

export async function getSupplierByEmailAction(email: string): Promise<ActionResult<SelectSupplier | null>> {
  try {
    const supplier = await getSupplierByEmail(email);
    return { isSuccess: true, message: "Supplier retrieved successfully", data: supplier };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get supplier by email" };
  }
}

export async function updateSupplierAction(id: string, data: Partial<InsertSupplier>): Promise<ActionResult<SelectSupplier>> {
  try {
    const updatedSupplier = await updateSupplier(id, data);
    revalidatePath("/admin/suppliers");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Supplier updated successfully", data: updatedSupplier };
  } catch (error) {
    return { isSuccess: false, message: "Failed to update supplier" };
  }
}

export async function deleteSupplierAction(id: string): Promise<ActionResult<void>> {
  try {
    await deleteSupplier(id);
    revalidatePath("/admin/suppliers");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Supplier deleted successfully" };
  } catch (error) {
    return { isSuccess: false, message: "Failed to delete supplier" };
  }
}

export async function getPublishedSuppliersAction(): Promise<ActionResult<SelectSupplier[]>> {
  try {
    const suppliers = await getPublishedSuppliers();
    return { isSuccess: true, message: "Published suppliers retrieved successfully", data: suppliers };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get published suppliers" };
  }
}

export async function searchSuppliersAction(params: {
  category?: string;
  location?: string;
  query?: string;
}): Promise<ActionResult<SelectSupplier[]>> {
  try {
    const suppliers = await searchSuppliers(params);
    return { isSuccess: true, message: "Suppliers search completed", data: suppliers };
  } catch (error) {
    return { isSuccess: false, message: "Failed to search suppliers" };
  }
}

export async function publishSupplierAction(id: string): Promise<ActionResult<SelectSupplier>> {
  try {
    const publishedSupplier = await publishSupplier(id);
    revalidatePath("/admin/suppliers");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Supplier published successfully", data: publishedSupplier };
  } catch (error) {
    return { isSuccess: false, message: "Failed to publish supplier" };
  }
}

export async function unpublishSupplierAction(id: string): Promise<ActionResult<SelectSupplier>> {
  try {
    const unpublishedSupplier = await unpublishSupplier(id);
    revalidatePath("/admin/suppliers");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Supplier unpublished successfully", data: unpublishedSupplier };
  } catch (error) {
    return { isSuccess: false, message: "Failed to unpublish supplier" };
  }
}

// Public-facing actions for agencies and suppliers
export async function getAgenciesAction(): Promise<ActionResult<any[]>> {
  try {
    const agencies = await getAllAgenciesWithImages();
    return { isSuccess: true, message: "Agencies retrieved successfully", data: agencies };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get agencies" };
  }
}

export async function getSuppliersAction(): Promise<ActionResult<any[]>> {
  try {
    const suppliers = await getPublishedSuppliersWithImages();
    return { isSuccess: true, message: "Suppliers retrieved successfully", data: suppliers };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get suppliers" };
  }
}
