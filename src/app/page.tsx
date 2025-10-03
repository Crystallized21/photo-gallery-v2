"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import ImageContainer from "@/components/ImageContainer";
import styles from "./page.module.css";

type ImageData = {
  id: string;
  src: string;
  alt: string;
};

export default function Home() {
  // TODO: add a photo lightbox

  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/images")
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-95% to-blue-950">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className={`${styles.titleLogo} ${styles.textContent}`}>
            crystallized.
          </h1>
          <p className="text-xl">
            If you came from my main website, welcome. This is me when I have time and go outside to do something else,
            taking a break from the screens.
            <br/>
            If you find this website by any other means e.g. email, social media, or
            word of person, welcome to my gallery.
            <br/>
            <br/>
            Hope you enjoy viewing my photos.
            <br/>
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div
              className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 shadow-[0px_0px_50px_1px_#2c5282]"/>
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