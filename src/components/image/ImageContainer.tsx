import Image from "next/image";

type ImageData = {
  id: string;
  src: string;
  alt: string;
};

type ImageContainerProps = {
  image: ImageData;
  index: number;
  href: string;
};

export default function ImageContainer({image, index, href}: ImageContainerProps) {
  return (
    <div className="break-inside-avoid mb-4">
      <a href={href} className="block group">
        <div
          className="relative overflow-hidden rounded-lg bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-indigo-500/20">

          <Image
            src={image.src}
            alt={image.alt}
            width={720}
            height={480}
            quality={80}
            className="rounded-lg"
            loading={index < 10 ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzIwIiBoZWlnaHQ9IjQ4MCIgZmlsbD0iIzFhMjAyYyIvPjwvc3ZnPg=="
            sizes="(max-width: 640px) 100vw,
              (max-width: 1280px) 50vw,
              (max-width: 1536px) 33vw,
              25vw"
          />
        </div>
      </a>
    </div>
  );
}