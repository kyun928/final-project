export type BusinessArea = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  anchor: string;
  image: string;
  imageAlt: string;
  emphasis: boolean;
  published: boolean;
  sortOrder: number;
};

export const businessAreaAnchors = [
  "data-analytics",
  "ai-solution",
  "malodahae",
  "platform",
] as const;
