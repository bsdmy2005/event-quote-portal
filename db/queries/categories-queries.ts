"use server";

import { eq, ilike } from "drizzle-orm";
import { db } from "../db";
import { categoriesTable, InsertCategory, SelectCategory } from "../schema/categories-schema";

export const createCategory = async (data: InsertCategory): Promise<SelectCategory> => {
  try {
    const [newCategory] = await db.insert(categoriesTable).values(data).returning();
    return newCategory as SelectCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

export const getCategoryById = async (id: string): Promise<SelectCategory> => {
  try {
    const result = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .limit(1);
    
    if (!result[0]) {
      throw new Error("Category not found");
    }
    return result[0] as SelectCategory;
  } catch (error) {
    console.error("Error getting category by ID:", error);
    throw new Error("Failed to get category");
  }
};

export const getAllCategories = async (): Promise<SelectCategory[]> => {
  try {
    return await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  } catch (error) {
    console.error("Error getting all categories:", error);
    throw new Error("Failed to get categories");
  }
};

export const getCategoryByName = async (name: string): Promise<SelectCategory | null> => {
  try {
    const result = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.name, name))
      .limit(1);
    return result[0] as SelectCategory || null;
  } catch (error) {
    console.error("Error getting category by name:", error);
    throw new Error("Failed to get category by name");
  }
};

export const updateCategory = async (id: string, data: Partial<InsertCategory>): Promise<SelectCategory> => {
  try {
    const [updatedCategory] = await db.update(categoriesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categoriesTable.id, id))
      .returning();
    
    if (!updatedCategory) {
      throw new Error("Category not found");
    }
    return updatedCategory as SelectCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};

export const searchCategories = async (query: string): Promise<SelectCategory[]> => {
  try {
    return await db
      .select()
      .from(categoriesTable)
      .where(ilike(categoriesTable.name, `%${query}%`))
      .orderBy(categoriesTable.name);
  } catch (error) {
    console.error("Error searching categories:", error);
    throw new Error("Failed to search categories");
  }
};

