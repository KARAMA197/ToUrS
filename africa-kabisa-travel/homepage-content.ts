import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  defaultHomepageContent,
  normalizeHomepageContent,
  type HomepageContent,
} from "@/homepage-content-schema";

const contentDirectory = path.join(process.cwd(), "content");

export const homepageContentFilePath = path.join(contentDirectory, "homepage.json");

export function isContentStudioEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.CONTENT_STUDIO_ENABLED === "true";
}

export async function readHomepageContent(): Promise<HomepageContent> {
  try {
    const file = await fs.readFile(homepageContentFilePath, "utf8");
    return normalizeHomepageContent(JSON.parse(file));
  } catch {
    return defaultHomepageContent;
  }
}

export async function writeHomepageContent(content: unknown): Promise<HomepageContent> {
  const normalized = normalizeHomepageContent(content);

  await fs.mkdir(contentDirectory, { recursive: true });
  await fs.writeFile(
    homepageContentFilePath,
    `${JSON.stringify(normalized, null, 2)}\n`,
    "utf8"
  );

  return normalized;
}
