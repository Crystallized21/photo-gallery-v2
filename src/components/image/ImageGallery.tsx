"use client";

import { T } from "gt-next";
import { motion } from "motion/react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import ImageContainer from "@/components/image/ImageContainer";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Thumbnails, Zoom } from "yet-another-react-lightbox/plugins";
import ErrorMessage from "@/components/ui/ErrorMessage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useImages } from "@/hooks/useImages";
import { useIsMobile } from "@/hooks/useIsMobile";

const DEFAULT_INDEX = -1;

export default function ImageGallery() {
  const isMobile = useIsMobile();
  const { data: images, error, isLoading } = useImages();
  const [openImageIndex, setOpenImageIndex] = useState(DEFAULT_INDEX);

  const lightboxSlides = images?.map((img) => ({
    src: img.fullResSrc,
    thumbnail: img.thumbnailSrc,
  }));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load images." />;
  }

  return (
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
          <p>You've reached the end of the gallery.</p>
        </div>
      </T>

      <Lightbox
        plugins={isMobile ? [Zoom] : [Zoom, Thumbnails]}
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
        open={openImageIndex > DEFAULT_INDEX}
        close={() => setOpenImageIndex(DEFAULT_INDEX)}
        slides={lightboxSlides}
        index={openImageIndex}
      />
    </>
  );
}
