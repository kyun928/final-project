import type { Inquiry } from "@/data/inquiries";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type InquiryRow = Tables<"inquiries">;

export function rowToInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    category: row.category,
    budget: row.budget ?? "",
    schedule: row.schedule ?? "",
    message: row.message,
    consent: row.consent,
    replied: row.replied,
    repliedAt: row.replied_at,
    adminNote: row.admin_note ?? "",
    createdAt: row.created_at,
  };
}

export function inquiryToInsert(input: {
  name: string;
  company: string;
  phone: string;
  email: string;
  category: string;
  budget?: string;
  schedule?: string;
  message: string;
  consent: boolean;
}): TablesInsert<"inquiries"> {
  return {
    name: input.name.trim(),
    company: input.company.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    category: input.category.trim(),
    budget: input.budget?.trim() ?? "",
    schedule: input.schedule?.trim() ?? "",
    message: input.message.trim(),
    consent: input.consent,
    replied: false,
    admin_note: "",
  };
}
