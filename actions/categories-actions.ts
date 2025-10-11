"use server";

import { 
  createCategory, 
  deleteCategory, 
  getAllCategories, 
  getCategoryById, 
  getCategoryByName,
  updateCategory,
  searchCategories 
} from "@/db/queries/categories-queries";
import { InsertCategory, SelectCategory } from "@/db/schema/categories-schema";
import { ActionResult } from "@/types/actions/action-types";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(data: InsertCategory): Promise<ActionResult<SelectCategory>> {
  try {
    const newCategory = await createCategory(data);
    revalidatePath("/admin/categories");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Category created successfully", data: newCategory };
  } catch (error) {
    return { isSuccess: false, message: "Failed to create category" };
  }
}

export async function getCategoryByIdAction(id: string): Promise<ActionResult<SelectCategory>> {
  try {
    const category = await getCategoryById(id);
    return { isSuccess: true, message: "Category retrieved successfully", data: category };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get category" };
  }
}

export async function getAllCategoriesAction(): Promise<ActionResult<SelectCategory[]>> {
  try {
    const categories = await getAllCategories();
    return { isSuccess: true, message: "Categories retrieved successfully", data: categories };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get categories" };
  }
}

export async function getCategoryByNameAction(name: string): Promise<ActionResult<SelectCategory | null>> {
  try {
    const category = await getCategoryByName(name);
    return { isSuccess: true, message: "Category retrieved successfully", data: category };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get category by name" };
  }
}

export async function updateCategoryAction(id: string, data: Partial<InsertCategory>): Promise<ActionResult<SelectCategory>> {
  try {
    const updatedCategory = await updateCategory(id, data);
    revalidatePath("/admin/categories");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Category updated successfully", data: updatedCategory };
  } catch (error) {
    return { isSuccess: false, message: "Failed to update category" };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult<void>> {
  try {
    await deleteCategory(id);
    revalidatePath("/admin/categories");
    revalidatePath("/organization");
    return { isSuccess: true, message: "Category deleted successfully" };
  } catch (error) {
    return { isSuccess: false, message: "Failed to delete category" };
  }
}

export async function searchCategoriesAction(query: string): Promise<ActionResult<SelectCategory[]>> {
  try {
    const categories = await searchCategories(query);
    return { isSuccess: true, message: "Categories search completed", data: categories };
  } catch (error) {
    return { isSuccess: false, message: "Failed to search categories" };
  }
}