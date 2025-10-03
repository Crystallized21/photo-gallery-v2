import * as Sentry from "@sentry/nextjs";
import {Storage} from "appwrite";
import {NextResponse} from "next/server";
import {client} from "@/lib/appwrite";

const storage = new Storage(client);

export async function GET() {
  try {
    const result = await storage.listFiles({
      bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
    })

    const files = result.files.map(file => ({
      id: file.$id,
      name: file.name,
      src: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      alt: file.name,
    }))

    return NextResponse.json(files);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Failed to fetch images"}, {status: 500})
  }
}