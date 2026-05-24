import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import travelerProofsTemplate from "@/content/traveler-proofs.json";

export type TravelerProof = (typeof travelerProofsTemplate)[number];

const travelerProofsFilePath = path.join(process.cwd(), "content", "traveler-proofs.json");

export async function readTravelerProofs() {
  try {
    const file = await fs.readFile(travelerProofsFilePath, "utf8");
    const parsed = JSON.parse(file);

    if (!Array.isArray(parsed)) {
      return travelerProofsTemplate;
    }

    return parsed as TravelerProof[];
  } catch {
    return travelerProofsTemplate;
  }
}

export function getPublishedTravelerProofs(proofs: TravelerProof[]) {
  return proofs.filter((proof) => proof.isPublished);
}

export { travelerProofsFilePath };
