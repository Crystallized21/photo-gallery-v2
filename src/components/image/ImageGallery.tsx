"use client";

import { T } from "gt-next";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { Thumbnails, Zoom } from "yet-another-react-lightbox/plugins";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

import ImageContainer from "@/components/image/ImageContainer";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { ImageData } from "@/types";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type ImageGalleryProps = {
  images: ImageData[];
};

const MOBILE_PLUGINS = [Zoom];
const DESKTOP_PLUGINS = [Zoom, Thumbnails];

export default function ImageGallery({ images }: ImageGalleryProps) {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const [openImageIndex, setOpenImageIndex] = useState(-1);

  const lightboxSlides = useMemo(
    () =>
      images.map((image) => ({
        src: image.fullResSrc,
        thumbnail: image.thumbnailSrc,
        alt: image.alt,
        width: image.width,
        height: image.height,
      })),
    [images],
  );

  if (images.length === 0) {
    return (
      <T>
        <p className="py-12 text-center">
          No photographs available.
        </p>
      </T>
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 md:columns-2 lg:columns-3 xl:columns-4">
        {images.map((image, index) => (
          <motion.button
            key={image.id}
            type="button"
            aria-label={`View ${image.alt}`}
            className="group mb-4 block w-full break-inside-avoid cursor-zoom-in text-left"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 16 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: reduceMotion
                ? 0
                : Math.min(index, 8) * 0.04,
            }}
            onClick={() => setOpenImageIndex(index)}
          >
            <ImageContainer image={image} index={index} />
          </motion.button>
        ))}
      </div>

      <T>
        <div className="mt-8 pb-8 text-center text-xl">
          <p>You've reached the end of the gallery.</p>
        </div>
      </T>

      <Lightbox
        plugins={isMobile ? MOBILE_PLUGINS : DESKTOP_PLUGINS}
        slides={lightboxSlides}
        open={openImageIndex >= 0}
        index={openImageIndex}
        close={() => setOpenImageIndex(-1)}
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
          iconZoomOut: () => <ZoomOut />,
        }}
      />
    </>
  );
}
