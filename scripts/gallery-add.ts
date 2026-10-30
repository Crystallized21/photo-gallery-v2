import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { z } from "zod";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

config({ path: ".env.local" });

// Config
function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const bucket = required("R2_BUCKET");
const publicBase = required("R2_PUBLIC_URL").replace(/\/+$/, "");

if (new URL(publicBase).protocol !== "https:") {
  throw new Error("R2_PUBLIC_URL must use HTTPS");
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${required("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: required("R2_ACCESS_KEY_ID"),
    secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
  },
});

const MANIFEST_KEY = "__gallery/gallery.json";
const PROCESSING_VERSION = 1;

const publicUrl = (key: string) => `${publicBase}/${key}`;

// schema
const imageSchema = z.object({
  id: z.string(),
  alt: z.string(),
  thumbnailSrc: z.string().url(),
  fullResSrc: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const manifestSchema = z.object({
  version: z.literal(1),
  images: z.array(imageSchema),
});

type Manifest = z.infer<typeof manifestSchema>;

// read current manifest
async function getManifest(): Promise<{
  manifest: Manifest;
  etag?: string;
}> {
  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: MANIFEST_KEY,
      }),
    );

    if (!response.Body) {
      throw new Error("Gallery manifest has no body");
    }

    const json = JSON.parse(
      await response.Body.transformToString(),
    );

    return {
      manifest: manifestSchema.parse(json),
      etag: response.ETag,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "NoSuchKey") {
      return {
        manifest: { version: 1, images: [] },
      };
    }

    throw error;
  }
}

// upload an image variant
async function uploadImage(key: string, data: Buffer) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

async function addImage(filePath: string) {
  const source = await readFile(filePath);

  const id = createHash("sha256")
    .update(`gallery-v${PROCESSING_VERSION}:`)
    .update(source)
    .digest("hex")
    .slice(0, 24);

  const { manifest, etag } = await getManifest();

  if (manifest.images.some((image) => image.id === id)) {
    console.log("Image already exists in gallery:", id);
    return;
  }

  console.log("Processing image...");

  const full = await sharp(source)
    .autoOrient()
    .webp({ quality: 100 })
    .toBuffer({ resolveWithObject: true });

  const thumbnail = await sharp(source)
    .autoOrient()
    .resize({
      width: 960,
      height: 960,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 78 })
    .toBuffer();

  const fullKey = `images/${id}.webp`;
  const thumbKey = `thumbnails/${id}.webp`;

  console.log("Uploading to R2...");

  await Promise.all([
    uploadImage(fullKey, full.data),
    uploadImage(thumbKey, thumbnail),
  ]);

  const image = {
    id,
    alt: basename(filePath),
    thumbnailSrc: publicUrl(thumbKey),
    fullResSrc: publicUrl(fullKey),
    width: full.info.width,
    height: full.info.height,
  };

  const updated = manifestSchema.parse({
    version: 1,
    images: [image, ...manifest.images],
  });

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: MANIFEST_KEY,
      Body: JSON.stringify(updated, null, 2),
      ContentType: "application/json",
      CacheControl: "no-store",
      ...(etag
        ? { IfMatch: etag }
        : { IfNoneMatch: "*" }),
    }),
  );

  console.log("Image added successfully!");
  console.log("Thumbnail:", image.thumbnailSrc);
  console.log("Full image:", image.fullResSrc);
  console.log("Gallery entries:", updated.images.length);
}

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: pnpm gallery:add <image-path>");
  process.exit(1);
}

addImage(filePath).catch((error) => {
  console.error("Upload failed:", error);
  process.exitCode = 1;
});
