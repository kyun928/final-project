import type { BusinessArea } from "@/data/business-areas";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type BusinessAreaRow = Tables<"business_areas">;

export function rowToBusinessArea(row: BusinessAreaRow): BusinessArea {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    keywords: row.keywords ?? [],
    anchor: row.anchor,
    image: row.image_url ?? "",
    imageAlt: row.image_alt ?? "",
    emphasis: row.emphasis,
    published: row.published,
    sortOrder: row.sort_order,
  };
}

export function businessAreaToInsert(
  area: Pick<
    BusinessArea,
    "title" | "description" | "keywords" | "anchor" | "image" | "imageAlt" | "emphasis" | "published" | "sortOrder"
  >,
): TablesInsert<"business_areas"> {
  return {
    title: area.title.trim(),
    description: area.description.trim(),
    keywords: area.keywords.map((item) => item.trim()).filter(Boolean),
    anchor: area.anchor.trim(),
    image_url: area.image.trim(),
    image_alt: area.imageAlt.trim(),
    emphasis: area.emphasis,
    published: area.published,
    sort_order: area.sortOrder,
  };
}

export function businessAreaToUpdate(
  area: Pick<
    BusinessArea,
    "title" | "description" | "keywords" | "anchor" | "image" | "imageAlt" | "emphasis" | "published" | "sortOrder"
  >,
): TablesUpdate<"business_areas"> {
  return businessAreaToInsert(area);
}
