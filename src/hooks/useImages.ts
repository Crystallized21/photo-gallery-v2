import * as Sentry from "@sentry/nextjs";
import useSWR from "swr";
import type { ImageData } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    Sentry.captureException(new Error(`Request failed: ${res.status}`));
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
};

export function useImages() {
  return useSWR<ImageData[]>("/api/images", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
  });
}
