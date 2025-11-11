import * as Sentry from "@sentry/nextjs";
import { Storage } from "appwrite";
import { NextResponse } from "next/server";
import { client } from "@/lib/appwrite";

const storage = new Storage(client);
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;

/**
 * GET handler that retrieves all images from the Appwrite storage bucket.
 *
 * @returns {Promise<NextResponse>} JSON response containing an array of image objects or an error
 *
 * @description
 * Fetches all files from the configured Appwrite storage bucket and transforms them into
 * a structured format with thumbnail and full-resolution URLs.
 *
 * @example
 * // Success response (200)
 * [
 *   {
 *     id: "64a1b2c3d4e5f6g7h8i9",
 *     alt: "sunset-photo.jpg",
 *     thumbnailSrc: "https://cloud.appwrite.io/.../preview?quality=30",
 *     fullResSrc: "https://cloud.appwrite.io/.../view?project=..."
 *   }
 * ]
 *
 * @example
 * // Error response (500)
 * {
 *   error: "Failed to fetch images"
 * }
 *
 * @throws {Error} Captures exceptions to Sentry and returns a 500 status code
 */
export async function GET() {
  try {
    // list all files in the bucket
    const result = await storage.listFiles({
      bucketId: bucketId,
    });

    const files = await Promise.all(
      result.files.map(async (file) => {
        // generate thumbnail url
        const thumbnailUrl = storage.getFilePreview({
          bucketId: bucketId,
          fileId: file.$id,
          quality: 30,
        });

        // get full resolution url
        const fullResUrl = `${endpoint}/storage/buckets/${bucketId}/files/${file.$id}/view?project=${projectId}`;

        // return the file json body data
        return {
          id: file.$id,
          alt: file.name,
          thumbnailSrc: thumbnailUrl,
          fullResSrc: fullResUrl,
        };
      }),
    );

    return NextResponse.json(files);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}
