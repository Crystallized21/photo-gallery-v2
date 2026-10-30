import { galleryManifestSchema } from "@/types";

export async function getGallery() {
  const base = process.env.R2_PUBLIC_URL;

  if (!base) {
    throw new Error("Missing R2_PUBLIC_URL");
  }

  const url = new URL(`${base.replace(/\/+$/, "")}/__gallery/gallery.json`);

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch gallery: ${response.status}`);
  }

  const data: unknown = await response.json();

  return galleryManifestSchema.parse(data).images;
}
