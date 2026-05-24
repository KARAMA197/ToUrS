import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import brandPagesTemplate from "@/content/brand-pages.json";
import journeysTemplate from "@/content/journeys.json";
import travelerProofsTemplate from "@/content/traveler-proofs.json";
import travelGuidesTemplate from "@/content/travel-guides.json";
import {
  homepageContentFilePath,
  isContentStudioEnabled,
  readHomepageContent,
  writeHomepageContent,
} from "@/homepage-content";

export type ContentStudioSectionKey =
  | "homepage"
  | "journeys"
  | "travel-guides"
  | "brand-pages"
  | "traveler-proofs";

type ContentStudioSection = {
  key: ContentStudioSectionKey;
  label: string;
  title: string;
  description: string;
  filePath: string;
  previewHref: string;
  previewLabel: string;
  read: () => Promise<unknown>;
  write: (content: unknown) => Promise<unknown>;
};

const contentDirectory = path.join(process.cwd(), "content");
const brandPagesFilePath = path.join(contentDirectory, "brand-pages.json");
const journeysFilePath = path.join(contentDirectory, "journeys.json");
const travelerProofsFilePath = path.join(contentDirectory, "traveler-proofs.json");
const travelGuidesFilePath = path.join(contentDirectory, "travel-guides.json");

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonArrayFile(filePath: string, content: unknown) {
  if (!Array.isArray(content)) {
    throw new Error("Expected an array of content items.");
  }

  await fs.mkdir(contentDirectory, { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");

  return content;
}

async function writeJsonObjectFile(filePath: string, content: unknown) {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    throw new Error("Expected a content object.");
  }

  await fs.mkdir(contentDirectory, { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");

  return content;
}

const sectionMap: Record<ContentStudioSectionKey, ContentStudioSection> = {
  homepage: {
    key: "homepage",
    label: "Homepage",
    title: "Homepage messaging",
    description:
      "Edit the main homepage copy, trust content, testimonials, and the final call to action.",
    filePath: homepageContentFilePath,
    previewHref: "/",
    previewLabel: "Open homepage",
    read: readHomepageContent,
    write: writeHomepageContent,
  },
  journeys: {
    key: "journeys",
    label: "Journeys",
    title: "Journey pages",
    description:
      "Update the sample journey content used on the homepage cards, journeys list, detail pages, and inquiry flow.",
    filePath: journeysFilePath,
    previewHref: "/journeys",
    previewLabel: "Open journeys",
    read: () => readJsonFile(journeysFilePath, journeysTemplate),
    write: (content) => writeJsonArrayFile(journeysFilePath, content),
  },
  "travel-guides": {
    key: "travel-guides",
    label: "Travel guides",
    title: "Guide pages",
    description:
      "Manage the travel-guide content used for the guide hub, the individual guide pages, and related SEO content.",
    filePath: travelGuidesFilePath,
    previewHref: "/travel-guides",
    previewLabel: "Open guides",
    read: () => readJsonFile(travelGuidesFilePath, travelGuidesTemplate),
    write: (content) => writeJsonArrayFile(travelGuidesFilePath, content),
  },
  "brand-pages": {
    key: "brand-pages",
    label: "Brand pages",
    title: "About, contact, and booking pages",
    description:
      "Manage the public brand copy used on the About page, How We Plan page, Know Before You Go page, Responsible Travel page, Contact page, Before You Book page, and shared footer messaging.",
    filePath: brandPagesFilePath,
    previewHref: "/about",
    previewLabel: "Open brand pages",
    read: () => readJsonFile(brandPagesFilePath, brandPagesTemplate),
    write: (content) => writeJsonObjectFile(brandPagesFilePath, content),
  },
  "traveler-proofs": {
    key: "traveler-proofs",
    label: "Traveler proofs",
    title: "Traveler proof library",
    description:
      "Manage the real traveler-proof entries that can later appear on the traveler-proof page once they are ready to publish.",
    filePath: travelerProofsFilePath,
    previewHref: "/traveler-proof",
    previewLabel: "Open traveler proof",
    read: () => readJsonFile(travelerProofsFilePath, travelerProofsTemplate),
    write: (content) => writeJsonArrayFile(travelerProofsFilePath, content),
  },
};

export const contentStudioSections = Object.values(sectionMap).map((section) => ({
  key: section.key,
  label: section.label,
  title: section.title,
  description: section.description,
  href: `/admin/${section.key}`,
  legacyHref: `/content-studio/${section.key}`,
  previewHref: section.previewHref,
  previewLabel: section.previewLabel,
}));

export function isContentStudioSectionKey(value: string): value is ContentStudioSectionKey {
  return value in sectionMap;
}

export function getContentStudioSection(key: ContentStudioSectionKey) {
  return sectionMap[key];
}

export { isContentStudioEnabled };
