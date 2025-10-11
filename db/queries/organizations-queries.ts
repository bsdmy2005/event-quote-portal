"use server";

import { eq, ilike, and, desc, asc } from "drizzle-orm";
import { db } from "../db";
import { agenciesTable, suppliersTable, InsertAgency, SelectAgency, InsertSupplier, SelectSupplier } from "../schema/organizations-schema";
import { imagesTable } from "../schema/image-galleries-schema";

// Agency CRUD operations
export const createAgency = async (data: InsertAgency): Promise<SelectAgency> => {
  try {
    const [newAgency] = await db.insert(agenciesTable).values(data).returning();
    return newAgency as SelectAgency;
  } catch (error) {
    console.error("Error creating agency:", error);
    
    // Check for duplicate email error (Postgres unique constraint violation)
    if (error instanceof Error && 'code' in error) {
      const pgError = error as any;
      if (pgError.code === '23505' && pgError.constraint === 'agencies_email_unique') {
        throw new Error(`An agency with the email "${data.email}" already exists. Please use a different email address.`);
      }
    }
    
    // For other errors, throw with more context
    throw new Error(error instanceof Error ? error.message : "Failed to create agency");
  }
};

export const getAgencyById = async (id: string): Promise<SelectAgency> => {
  try {
    const result = await db
      .select()
      .from(agenciesTable)
      .where(eq(agenciesTable.id, id))
      .limit(1);
    
    if (!result[0]) {
      throw new Error("Agency not found");
    }
    return result[0] as SelectAgency;
  } catch (error) {
    console.error("Error getting agency by ID:", error);
    throw new Error("Failed to get agency");
  }
};

export const getAllAgencies = async (): Promise<SelectAgency[]> => {
  try {
    return await db.select().from(agenciesTable).orderBy(agenciesTable.name);
  } catch (error) {
    console.error("Error getting all agencies:", error);
    throw new Error("Failed to get agencies");
  }
};

export const getPublishedAgencies = async (): Promise<SelectAgency[]> => {
  try {
    return await db
      .select()
      .from(agenciesTable)
      .where(eq(agenciesTable.isPublished, true))
      .orderBy(agenciesTable.name);
  } catch (error) {
    console.error("Error getting published agencies:", error);
    throw new Error("Failed to get published agencies");
  }
};

export const getAllAgenciesWithImages = async () => {
  try {
    const agencies = await db.select().from(agenciesTable).orderBy(agenciesTable.name);
    
    // Get featured images for each agency
    const agenciesWithImages = await Promise.all(
      agencies.map(async (agency) => {
        const featuredImages = await db.query.imagesTable.findMany({
          where: and(
            eq(imagesTable.organizationId, agency.id),
            eq(imagesTable.organizationType, "agency"),
            eq(imagesTable.isFeatured, true)
          ),
          orderBy: [asc(imagesTable.sortOrder), desc(imagesTable.createdAt)],
          limit: 1
        });
        
        return {
          ...agency,
          featuredImage: featuredImages[0] || null
        };
      })
    );
    
    return agenciesWithImages;
  } catch (error) {
    console.error("Error getting agencies with images:", error);
    throw new Error("Failed to get agencies with images");
  }
};

export const getPublishedAgenciesWithImages = async () => {
  try {
    const agencies = await db
      .select()
      .from(agenciesTable)
      .where(eq(agenciesTable.isPublished, true))
      .orderBy(agenciesTable.name);
    
    // Get featured images for each agency
    const agenciesWithImages = await Promise.all(
      agencies.map(async (agency) => {
        const featuredImages = await db.query.imagesTable.findMany({
          where: and(
            eq(imagesTable.organizationId, agency.id),
            eq(imagesTable.organizationType, "agency"),
            eq(imagesTable.isFeatured, true)
          ),
          orderBy: [asc(imagesTable.sortOrder), desc(imagesTable.createdAt)],
          limit: 1
        });
        
        return {
          ...agency,
          featuredImage: featuredImages[0] || null
        };
      })
    );
    
    return agenciesWithImages;
  } catch (error) {
    console.error("Error getting published agencies with images:", error);
    throw new Error("Failed to get published agencies with images");
  }
};

export const getAgencyByEmail = async (email: string): Promise<SelectAgency | null> => {
  try {
    const result = await db
      .select()
      .from(agenciesTable)
      .where(eq(agenciesTable.email, email))
      .limit(1);
    return result[0] as SelectAgency || null;
  } catch (error) {
    console.error("Error getting agency by email:", error);
    throw new Error("Failed to get agency by email");
  }
};

export const updateAgency = async (id: string, data: Partial<InsertAgency>): Promise<SelectAgency> => {
  try {
    const [updatedAgency] = await db.update(agenciesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(agenciesTable.id, id))
      .returning();
    
    if (!updatedAgency) {
      throw new Error("Agency not found");
    }
    return updatedAgency as SelectAgency;
  } catch (error) {
    console.error("Error updating agency:", error);
    throw new Error("Failed to update agency");
  }
};

export const deleteAgency = async (id: string): Promise<void> => {
  try {
    await db.delete(agenciesTable).where(eq(agenciesTable.id, id));
  } catch (error) {
    console.error("Error deleting agency:", error);
    throw new Error("Failed to delete agency");
  }
};

export const searchAgencies = async (query: string): Promise<SelectAgency[]> => {
  try {
    return await db
      .select()
      .from(agenciesTable)
      .where(ilike(agenciesTable.name, `%${query}%`))
      .orderBy(agenciesTable.name);
  } catch (error) {
    console.error("Error searching agencies:", error);
    throw new Error("Failed to search agencies");
  }
};

export const publishAgency = async (id: string): Promise<SelectAgency> => {
  try {
    const [publishedAgency] = await db.update(agenciesTable)
      .set({ isPublished: true, updatedAt: new Date() })
      .where(eq(agenciesTable.id, id))
      .returning();
    
    if (!publishedAgency) {
      throw new Error("Agency not found");
    }
    return publishedAgency as SelectAgency;
  } catch (error) {
    console.error("Error publishing agency:", error);
    throw new Error("Failed to publish agency");
  }
};

export const unpublishAgency = async (id: string): Promise<SelectAgency> => {
  try {
    const [unpublishedAgency] = await db.update(agenciesTable)
      .set({ isPublished: false, updatedAt: new Date() })
      .where(eq(agenciesTable.id, id))
      .returning();
    
    if (!unpublishedAgency) {
      throw new Error("Agency not found");
    }
    return unpublishedAgency as SelectAgency;
  } catch (error) {
    console.error("Error unpublishing agency:", error);
    throw new Error("Failed to unpublish agency");
  }
};

// Supplier CRUD operations
export const createSupplier = async (data: InsertSupplier): Promise<SelectSupplier> => {
  try {
    const [newSupplier] = await db.insert(suppliersTable).values(data).returning();
    return newSupplier as SelectSupplier;
  } catch (error) {
    console.error("Error creating supplier:", error);
    
    // Check for duplicate email error (Postgres unique constraint violation)
    if (error instanceof Error && 'code' in error) {
      const pgError = error as any;
      if (pgError.code === '23505' && pgError.constraint === 'suppliers_email_unique') {
        throw new Error(`A supplier with the email "${data.email}" already exists. Please use a different email address.`);
      }
    }
    
    // For other errors, throw with more context
    throw new Error(error instanceof Error ? error.message : "Failed to create supplier");
  }
};

export const getSupplierById = async (id: string): Promise<SelectSupplier> => {
  try {
    const result = await db
      .select()
      .from(suppliersTable)
      .where(eq(suppliersTable.id, id))
      .limit(1);
    
    if (!result[0]) {
      throw new Error("Supplier not found");
    }
    return result[0] as SelectSupplier;
  } catch (error) {
    console.error("Error getting supplier by ID:", error);
    throw new Error("Failed to get supplier");
  }
};

export const getAllSuppliers = async (): Promise<SelectSupplier[]> => {
  try {
    return await db.select().from(suppliersTable).orderBy(suppliersTable.name);
  } catch (error) {
    console.error("Error getting all suppliers:", error);
    throw new Error("Failed to get suppliers");
  }
};

export const getSupplierByEmail = async (email: string): Promise<SelectSupplier | null> => {
  try {
    const result = await db
      .select()
      .from(suppliersTable)
      .where(eq(suppliersTable.email, email))
      .limit(1);
    return result[0] as SelectSupplier || null;
  } catch (error) {
    console.error("Error getting supplier by email:", error);
    throw new Error("Failed to get supplier by email");
  }
};

export const updateSupplier = async (id: string, data: Partial<InsertSupplier>): Promise<SelectSupplier> => {
  try {
    const [updatedSupplier] = await db.update(suppliersTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(suppliersTable.id, id))
      .returning();
    
    if (!updatedSupplier) {
      throw new Error("Supplier not found");
    }
    return updatedSupplier as SelectSupplier;
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw new Error("Failed to update supplier");
  }
};

export const deleteSupplier = async (id: string): Promise<void> => {
  try {
    await db.delete(suppliersTable).where(eq(suppliersTable.id, id));
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw new Error("Failed to delete supplier");
  }
};

export const getPublishedSuppliers = async (): Promise<SelectSupplier[]> => {
  try {
    return await db
      .select()
      .from(suppliersTable)
      .where(eq(suppliersTable.isPublished, true))
      .orderBy(suppliersTable.name);
  } catch (error) {
    console.error("Error getting published suppliers:", error);
    throw new Error("Failed to get published suppliers");
  }
};

export const getPublishedSuppliersWithImages = async () => {
  try {
    const suppliers = await db
      .select()
      .from(suppliersTable)
      .where(eq(suppliersTable.isPublished, true))
      .orderBy(suppliersTable.name);
    
    // Get featured images for each supplier
    const suppliersWithImages = await Promise.all(
      suppliers.map(async (supplier) => {
        const featuredImages = await db.query.imagesTable.findMany({
          where: and(
            eq(imagesTable.organizationId, supplier.id),
            eq(imagesTable.organizationType, "supplier"),
            eq(imagesTable.isFeatured, true)
          ),
          orderBy: [asc(imagesTable.sortOrder), desc(imagesTable.createdAt)],
          limit: 1
        });
        
        return {
          ...supplier,
          featuredImage: featuredImages[0] || null
        };
      })
    );
    
    return suppliersWithImages;
  } catch (error) {
    console.error("Error getting suppliers with images:", error);
    throw new Error("Failed to get suppliers with images");
  }
};

export const searchSuppliers = async (params: {
  category?: string;
  location?: string;
  query?: string;
}): Promise<SelectSupplier[]> => {
  try {
    let conditions = [eq(suppliersTable.isPublished, true)];

    if (params.category) {
      conditions.push(eq(suppliersTable.serviceCategories, [params.category]));
    }

    if (params.location) {
      conditions.push(ilike(suppliersTable.location, `%${params.location}%`));
    }

    if (params.query) {
      conditions.push(
        ilike(suppliersTable.servicesText, `%${params.query}%`)
      );
    }

    return await db
      .select()
      .from(suppliersTable)
      .where(and(...conditions))
      .orderBy(suppliersTable.name);
  } catch (error) {
    console.error("Error searching suppliers:", error);
    throw new Error("Failed to search suppliers");
  }
};

export const publishSupplier = async (id: string): Promise<SelectSupplier> => {
  try {
    const [publishedSupplier] = await db.update(suppliersTable)
      .set({ isPublished: true, updatedAt: new Date() })
      .where(eq(suppliersTable.id, id))
      .returning();
    
    if (!publishedSupplier) {
      throw new Error("Supplier not found");
    }
    return publishedSupplier as SelectSupplier;
  } catch (error) {
    console.error("Error publishing supplier:", error);
    throw new Error("Failed to publish supplier");
  }
};

export const unpublishSupplier = async (id: string): Promise<SelectSupplier> => {
  try {
    const [unpublishedSupplier] = await db.update(suppliersTable)
      .set({ isPublished: false, updatedAt: new Date() })
      .where(eq(suppliersTable.id, id))
      .returning();
    
    if (!unpublishedSupplier) {
      throw new Error("Supplier not found");
    }
    return unpublishedSupplier as SelectSupplier;
  } catch (error) {
    console.error("Error unpublishing supplier:", error);
    throw new Error("Failed to unpublish supplier");
  }
};

export const getAgencyByIdWithImages = async (id: string) => {
  try {
    const agency = await db.query.agenciesTable.findFirst({
      where: eq(agenciesTable.id, id)
    });

    if (!agency) {
      return null;
    }

    const featuredImages = await db.query.imagesTable.findMany({
      where: and(
        eq(imagesTable.organizationId, agency.id),
        eq(imagesTable.organizationType, "agency"),
        eq(imagesTable.isFeatured, true)
      ),
      orderBy: [asc(imagesTable.sortOrder), desc(imagesTable.createdAt)],
      limit: 1
    });

    return {
      ...agency,
      featuredImage: featuredImages[0] || null
    };
  } catch (error) {
    console.error("Error getting agency with images:", error);
    throw new Error("Failed to get agency with images");
  }
};

export const getSupplierByIdWithImages = async (id: string) => {
  try {
    const supplier = await db.query.suppliersTable.findFirst({
      where: eq(suppliersTable.id, id)
    });

    if (!supplier) {
      return null;
    }

    const featuredImages = await db.query.imagesTable.findMany({
      where: and(
        eq(imagesTable.organizationId, supplier.id),
        eq(imagesTable.organizationType, "supplier"),
        eq(imagesTable.isFeatured, true)
      ),
      orderBy: [asc(imagesTable.sortOrder), desc(imagesTable.createdAt)],
      limit: 1
    });

    return {
      ...supplier,
      featuredImage: featuredImages[0] || null
    };
  } catch (error) {
    console.error("Error getting supplier with images:", error);
    throw new Error("Failed to get supplier with images");
  }
};

