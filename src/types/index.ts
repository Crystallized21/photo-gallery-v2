import { z } from "zod";

export const imageSchema = z.object({
  id: z.string().min(1),
  alt: z.string(),
  thumbnailSrc: z.url(),
  fullResSrc: z.url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const galleryManifestSchema = z.object({
  version: z.literal(1),
  images: z.array(imageSchema),
});

export type ImageData = z.infer<typeof imageSchema>;
