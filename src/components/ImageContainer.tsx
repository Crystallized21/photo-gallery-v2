import Image, {type ImageProps} from "next/image";

type ImageContainerProps = {
  image: ImageProps;
  index: number;
  href: string;
};

export default function ImageContainer({image, index, href}: ImageContainerProps) {
  const widthHeightRatio = image.width / image.height;
  const galleryHeight = Math.ceil(500 * widthHeightRatio);
  const photoSpans = Math.ceil(galleryHeight / 5) + 3;

  return (
    <div
      className="md:w-[500px] justify-self-center"
      style={{gridRow: `span ${photoSpans}`}}
      key={index}
    >
      <div
        className="relative group group-hover:brightness-150 transition duration-200 group-hover:shadow-lg
        hover:shadow-indigo-500/90 border-2 border-zinc-500/20 hover:border-zinc-500/70 rounded-sm"
      >
        <Image
          style={{transform: "translate3d(0, 0, 0)"}}
          src={image.src}
          alt={image.alt}
          width={720}
          height={480}
          quality={80}
          className="rounded-sm"
          loading={index < 10 ? "eager" : "lazy"}
          sizes="(max-width: 640px) 100vw,
            (max-width: 1280px) 50vw,
            (max-width: 1536px) 33vw,
            25vw"
        />
      </div>
    </div>
  );
}