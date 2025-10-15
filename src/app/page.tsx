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
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Thumbnails, Zoom } from "yet-another-react-lightbox/plugins";
import type { ImageData } from "@/types";

// todo: future task, add a version counter on the page for some coolness i guess.

// fetcher function for SWR. i don't know how it works, but ok.
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    Sentry.captureException(new Error(`Request failed: ${res.status}`));
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
};

// stop using magic numbers lol.
const DEFAULT_INDEX = -1;

export default function Home() {
  // swr function itself
  const {
    data: images,
    error,
    isLoading,
  } = useSWR<ImageData[]>("/api/images", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
  });

  // lightbox stuff
  const [openImageIndex, setOpenImageIndex] = useState(DEFAULT_INDEX);
  const lightboxSlides = images?.map((img) => ({
    src: img.fullResSrc,
  }))

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
                  className="group cursor-pointer"
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

            {/* note to self: please do not think about implementing next/image with lightbox. it's not worth it, and you will end up with a lot of bugs. '*/}
            <Lightbox
              plugins={[Zoom, Thumbnails]}

              zoom={{
                doubleClickDelay: 200,
                doubleClickMaxStops: 1,
              }}

              thumbnails={{
                width: 100,
                height: 100,
                border: 0,
                gap: 12,
              }}

              render={{
                iconPrev: () => <ChevronLeft />,
                iconNext: () => <ChevronRight />,
                iconClose: () => <X />,
                iconLoading: () => <LoadingSpinner />,

                iconZoomIn: () => <ZoomIn />,
                iconZoomOut: () => <ZoomOut/>,
              }}

              open={openImageIndex > -1}
              close={() => setOpenImageIndex(DEFAULT_INDEX)}
              slides={lightboxSlides}
              index={openImageIndex}
            />
          </>
        )}
      </div>
    </div>
  );
}
