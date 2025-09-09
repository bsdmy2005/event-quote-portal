import { getAllCategoriesAction } from "@/actions/categories-actions";

// Cache for categories to avoid repeated API calls
let categoriesCache: { [key: string]: string } | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCategoriesMap(): Promise<{ [key: string]: string }> {
  const now = Date.now();
  
  // Return cached data if it's still valid
  if (categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return categoriesCache;
  }

  try {
    const result = await getAllCategoriesAction();
    if (result.isSuccess && result.data) {
      const map: { [key: string]: string } = {};
      result.data.forEach(category => {
        map[category.id] = category.name;
      });
      
      categoriesCache = map;
      cacheTimestamp = now;
      return map;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return {};
}

export function resolveCategoryNames(
  categoryIds: string[] | undefined,
  categoriesMap: { [key: string]: string }
): string[] {
  if (!categoryIds || !Array.isArray(categoryIds)) {
    return [];
  }

  return categoryIds
    .map(id => {
      // If the ID exists in the map, return the name
      if (categoriesMap[id]) {
        return categoriesMap[id];
      }
      // If it's already a name (not a UUID), return as is
      if (typeof id === 'string' && !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return id;
      }
      // If it's an unknown UUID, return a fallback
      return `Unknown Category (${id.slice(0, 8)}...)`;
    })
    .filter(Boolean);
}
