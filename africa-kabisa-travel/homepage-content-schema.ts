import homepageTemplate from "@/content/homepage.json";

export type HomepageContent = typeof homepageTemplate;

export const defaultHomepageContent: HomepageContent = homepageTemplate;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithTemplate<T>(template: T, value: unknown): T {
  if (typeof template === "string") {
    return (typeof value === "string" && value.trim().length > 0 ? value : template) as T;
  }

  if (Array.isArray(template)) {
    const items = Array.isArray(value) ? value : [];
    return template.map((item, index) => mergeWithTemplate(item, items[index])) as T;
  }

  if (isRecord(template)) {
    const source = isRecord(value) ? value : {};
    const entries = Object.entries(template).map(([key, currentValue]) => [
      key,
      mergeWithTemplate(currentValue, source[key]),
    ]);

    return Object.fromEntries(entries) as T;
  }

  return template;
}

export function normalizeHomepageContent(value: unknown): HomepageContent {
  return mergeWithTemplate(defaultHomepageContent, value);
}
