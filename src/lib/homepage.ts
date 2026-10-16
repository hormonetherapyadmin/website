import { NotFoundError } from "@prismicio/client";
import { createClient } from "@/prismicio";
import type { HomepageDocument } from "../../prismicio-types";

/** The published Homepage document, or null when it does not exist yet. */
export async function loadHomepage(): Promise<HomepageDocument | null> {
  try {
    return await createClient().getSingle("homepage");
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}
