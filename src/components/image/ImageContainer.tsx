import Image from "next/image";
import type { ImageData } from "@/types";

type ImageContainerProps = {
  image: ImageData;
  index: number;
};

export default function ImageContainer({ image, index }: ImageContainerProps) {
  return (
    <div className="break-inside-avoid mb-4">
      <div className="relative overflow-hidden rounded-lg bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-indigo-500/20">
        <Image
          src={image.thumbnailSrc}
          alt={image.alt}
          width={500}
          height={500}
          className="rounded-lg w-full h-auto"
          loading={index < 10 ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzIwIiBoZWlnaHQ9IjQ4MCIgZmlsbD0iIzFhMjAyYyIvPjwvc3ZnPg=="
          sizes="(max-width: 640px) 100vw,
              (max-width: 1280px) 50vw,
              (max-width: 1536px) 33vw,
              25vw"
        />
      </div>
    </div>
  );
}
