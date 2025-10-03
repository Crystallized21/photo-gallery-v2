"use client";

import {useEffect, useState} from "react";
import ImageContainer from "@/components/ImageContainer";

export default function Home() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/images")
      .then(res => res.json())
      .then(setImages);
  }, []);

  return (
    <div className="flex h-screen">
      <div className="text-center text-4xl font-bold">
        Crystallized.
      </div>
      <div className="flex flex-wrap gap-4">
        {images.map((img, index) => (
          <ImageContainer
            key={img.id}
            image={img}
            index={index}
            href={img.src}
          />
        ))}
      </div>
    </div>
  );
}
