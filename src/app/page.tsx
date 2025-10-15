"use client";

import * as Sentry from "@sentry/nextjs";
import { T } from "gt-next";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Lightbox from "yet-another-react-lightbox";
import HeaderText from "@/components/HeaderText";
import ImageContainer from "@/components/image/ImageContainer";
import ErrorMessage from "@/components/ui/ErrorMessage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import "yet-another-react-lightbox/styles.css";

type ImageData = {
  id: string;
  src: string;
  alt: string;
};

// fetcher function for SWR. i don't know how it works, but ok.
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    Sentry.captureException(new Error(`Request failed: ${res.status}`));
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
};

export default function Home() {
  // TODO: add a photo lightbox

  const {
    data: images,
    error,
    isLoading,
  } = useSWR<ImageData[]>("/api/images", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
  });

  const [openImageIndex, setOpenImageIndex] = useState(-1);

  useEffect(() => {
    if (error) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-95% to-blue-950">
      <div className="container mx-auto px-4">
        <HeaderText />

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {(images ?? []).map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  onClick={() => setOpenImageIndex(index)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setOpenImageIndex(index)}
                >
                  <ImageContainer image={img} index={index} />
                </motion.div>
              ))}
            </div>

            <T>
              <div className="text-center text-xl mt-8 pb-8">
                <p>You've reached the end of the gallery</p>
              </div>
            </T>

            <Lightbox
              open={openImageIndex > -1}
              close={() => setOpenImageIndex(-1)}
              slides={images}
              index={openImageIndex}
            />
          </>
        )}
      </div>
    </div>
  );
}
