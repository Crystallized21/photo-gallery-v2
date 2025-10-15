import * as Sentry from "@sentry/nextjs";
import { Storage } from "appwrite";
import { NextResponse } from "next/server";
import { client } from "@/lib/appwrite";

const storage = new Storage(client);
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;

export async function GET() {
  try {
    // list all files in the bucket
    const result = await storage.listFiles({
      bucketId: bucketId,
    });

    const files = result.files.map((file) => {
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
        fullResSrc: fullResUrl
      }
    });

    return NextResponse.json(files);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}
