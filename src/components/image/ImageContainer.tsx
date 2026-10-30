import Image from "next/image";
import type { ImageData } from "@/types";

type ImageContainerProps = {
  image: ImageData;
  index: number;
};

export default function ImageContainer({ image, index }: ImageContainerProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-700/30 bg-slate-900/50 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-blue-500/50 group-hover:shadow-xl">
      <Image
        src={image.thumbnailSrc}
        alt={image.alt}
        width={image.width}
        height={image.height}
        unoptimized
        loading={index === 0 ? "eager" : "lazy"}
        className="block h-auto w-full rounded-lg"
      />
    </div>
  );
}
