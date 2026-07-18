import type { BusinessArea } from "@/data/business-areas";
import { businessAreas as staticBusinessAreas } from "@/data/site";
import {
  businessAreaToInsert,
  businessAreaToUpdate,
  rowToBusinessArea,
} from "@/lib/business-area-mapper";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const BUSINESS_AREAS_BUCKET = "business-areas";

type BusinessAreaInput = Omit<BusinessArea, "id">;

function isMissingTable(error: { message: string }) {
  const message = error.message.toLowerCase();
  return (
    message.includes("could not find the table") ||
    message.includes("schema cache") ||
    message.includes("does not exist")
  );
}

function sortAreas(areas: BusinessArea[]) {
  return [...areas].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title, "ko");
  });
}

function staticFallbackAreas(): BusinessArea[] {
  return staticBusinessAreas.map((area, index) => ({
    id: `static-${area.anchor}`,
    title: area.title,
    description: area.description,
    keywords: [...area.keywords],
    anchor: area.anchor,
    image: area.image,
    imageAlt: area.imageAlt,
    emphasis: area.emphasis ?? false,
    published: area.published ?? true,
    sortOrder: area.sortOrder ?? index,
  }));
}

async function ensureBusinessAreasBucket() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    throw new Error(`사업영역 저장소를 확인하지 못했습니다: ${listError.message}`);
  }

  if (buckets?.some((bucket) => bucket.name === BUSINESS_AREAS_BUCKET)) {
    return;
  }

  const { error } = await supabaseAdmin.storage.createBucket(BUSINESS_AREAS_BUCKET, {
    public: false,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ["application/json"],
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw new Error(`사업영역 저장소 생성에 실패했습니다: ${error.message}`);
  }
}

function areaFilePath(id: string) {
  return `entries/${id}.json`;
}

async function saveAreaToStorage(area: BusinessArea) {
  await ensureBusinessAreasBucket();
  const supabaseAdmin = getSupabaseAdmin();
  const bytes = new TextEncoder().encode(JSON.stringify(area, null, 2));

  const { error } = await supabaseAdmin.storage
    .from(BUSINESS_AREAS_BUCKET)
    .upload(areaFilePath(area.id), bytes, {
      contentType: "application/json",
      upsert: true,
      cacheControl: "0",
    });

  if (error) {
    throw new Error(`사업영역 저장에 실패했습니다: ${error.message}`);
  }

  return area;
}

async function listAreasFromStorage(): Promise<BusinessArea[]> {
  await ensureBusinessAreasBucket();
  const supabaseAdmin = getSupabaseAdmin();

  const { data: files, error } = await supabaseAdmin.storage
    .from(BUSINESS_AREAS_BUCKET)
    .list("entries", { limit: 1000, sortBy: { column: "name", order: "asc" } });

  if (error) {
    throw new Error(`사업영역 목록을 불러오지 못했습니다: ${error.message}`);
  }

  const areas: BusinessArea[] = [];

  for (const file of files ?? []) {
    if (!file.name.endsWith(".json")) continue;

    const { data, error: downloadError } = await supabaseAdmin.storage
      .from(BUSINESS_AREAS_BUCKET)
      .download(`entries/${file.name}`);

    if (downloadError || !data) continue;

    try {
      areas.push(JSON.parse(await data.text()) as BusinessArea);
    } catch {
      // skip invalid files
    }
  }

  return sortAreas(areas);
}

async function getAreaFromStorage(id: string): Promise<BusinessArea | null> {
  await ensureBusinessAreasBucket();
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.storage
    .from(BUSINESS_AREAS_BUCKET)
    .download(areaFilePath(id));

  if (error || !data) return null;
  return JSON.parse(await data.text()) as BusinessArea;
}

async function deleteAreaFromStorage(id: string) {
  await ensureBusinessAreasBucket();
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.storage
    .from(BUSINESS_AREAS_BUCKET)
    .remove([areaFilePath(id)]);

  if (error) {
    throw new Error(`사업영역 삭제에 실패했습니다: ${error.message}`);
  }
}

export async function loadPublishedBusinessAreas(): Promise<BusinessArea[]> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("business_areas")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (!error) {
    const rows = (data ?? []).map(rowToBusinessArea);
    return rows.length > 0 ? rows : staticFallbackAreas().filter((item) => item.published);
  }

  if (!isMissingTable(error)) {
    throw new Error(`사업영역 불러오기에 실패했습니다: ${error.message}`);
  }

  const stored = await listAreasFromStorage();
  if (stored.length > 0) {
    return stored.filter((item) => item.published);
  }

  return staticFallbackAreas().filter((item) => item.published);
}

export async function loadAdminBusinessAreas(): Promise<BusinessArea[]> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("business_areas")
    .select("*")
    .order("sort_order", { ascending: true });

  if (!error) {
    return (data ?? []).map(rowToBusinessArea);
  }

  if (!isMissingTable(error)) {
    throw new Error(`사업영역 불러오기에 실패했습니다: ${error.message}`);
  }

  const stored = await listAreasFromStorage();
  return stored.length > 0 ? stored : staticFallbackAreas();
}

export async function persistBusinessArea(
  input: BusinessAreaInput & { id?: string },
): Promise<BusinessArea> {
  const supabaseAdmin = getSupabaseAdmin();
  const payload = {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    anchor: input.anchor,
    image: input.image,
    imageAlt: input.imageAlt,
    emphasis: input.emphasis,
    published: input.published,
    sortOrder: input.sortOrder,
  };

  if (input.id && !input.id.startsWith("static-")) {
    const { data, error } = await supabaseAdmin
      .from("business_areas")
      .update(businessAreaToUpdate(payload))
      .eq("id", input.id)
      .select("*")
      .single();

    if (!error && data) {
      return rowToBusinessArea(data);
    }

    if (error && !isMissingTable(error)) {
      throw new Error(`사업영역 수정에 실패했습니다: ${error.message}`);
    }

    const existing = await getAreaFromStorage(input.id);
    const updated: BusinessArea = {
      id: input.id,
      ...payload,
      keywords: payload.keywords.map((item) => item.trim()).filter(Boolean),
    };
    if (!existing && input.id.startsWith("static-")) {
      // fallthrough to create
    } else {
      return saveAreaToStorage(updated);
    }
  }

  const { data, error } = await supabaseAdmin
    .from("business_areas")
    .insert(businessAreaToInsert(payload))
    .select("*")
    .single();

  if (!error && data) {
    return rowToBusinessArea(data);
  }

  if (error && !isMissingTable(error)) {
    throw new Error(`사업영역 등록에 실패했습니다: ${error.message}`);
  }

  const area: BusinessArea = {
    id: crypto.randomUUID(),
    ...payload,
    keywords: payload.keywords.map((item) => item.trim()).filter(Boolean),
  };

  return saveAreaToStorage(area);
}

export async function removeBusinessArea(id: string): Promise<void> {
  if (id.startsWith("static-")) {
    throw new Error("기본 샘플 항목은 삭제할 수 없습니다. 수정 후 저장하면 별도 항목으로 관리됩니다.");
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.from("business_areas").delete().eq("id", id);

  if (!error) return;

  if (!isMissingTable(error)) {
    throw new Error(`사업영역 삭제에 실패했습니다: ${error.message}`);
  }

  await deleteAreaFromStorage(id);
}

export async function seedBusinessAreasIfEmpty(): Promise<BusinessArea[]> {
  const existing = await loadAdminBusinessAreas();
  const onlyStatic = existing.every((item) => item.id.startsWith("static-"));
  if (!onlyStatic && existing.length > 0) {
    return existing;
  }

  const seeded: BusinessArea[] = [];
  for (const area of staticBusinessAreas) {
    seeded.push(
      await persistBusinessArea({
        title: area.title,
        description: area.description,
        keywords: [...area.keywords],
        anchor: area.anchor,
        image: area.image,
        imageAlt: area.imageAlt,
        emphasis: area.emphasis ?? false,
        published: area.published ?? true,
        sortOrder: area.sortOrder,
      }),
    );
  }
  return seeded;
}
