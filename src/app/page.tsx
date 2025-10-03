"use client";

import * as Sentry from "@sentry/nextjs";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import ImageContainer from "@/components/image/ImageContainer";
import HeaderText from "@/components/HeaderText";

type ImageData = {
  id: string;
  src: string;
  alt: string;
};

export default function Home() {
  // TODO: add a photo lightbox
  // TODO: optimise bandwidth usage, prob limit api fetches?

  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/images")
      .then(res => res.json())
      .then(data => {
        setImages(data);
      })
      .catch(err => {
        setError("Failed to load images. Please refresh.");
        Sentry.captureException(err);
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-95% to-blue-950">
      <div className="container mx-auto px-4">
        <HeaderText/>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div
              className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 shadow-[0px_0px_50px_1px_#2c5282]"/>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-20">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {images.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{scale: 0, opacity: 0}}
                  animate={{scale: 1, opacity: 1}}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <ImageContainer
                    image={img}
                    index={index}
                    href={img.src}
                  />
                </motion.div>
              ))}
            </div>
            <div className="text-center text-xl mt-8 pb-8">
              <p>You've reached the end of the gallery</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}