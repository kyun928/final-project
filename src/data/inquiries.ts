export type Inquiry = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  category: string;
  budget: string;
  schedule: string;
  message: string;
  consent: boolean;
  replied: boolean;
  repliedAt: string | null;
  adminNote: string;
  createdAt: string;
};

export function formatInquiryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}
