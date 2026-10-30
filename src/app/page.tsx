import {Suspense} from "react";
import FooterInfo from "@/components/FooterInfo";
import HeaderText from "@/components/HeaderText";
import ImageGallery from "@/components/image/ImageGallery";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {getGallery} from "@/lib/gallery";

async function GalleryContent() {
  const images = await getGallery();

  return <ImageGallery images={images}/>;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-95% to-blue-950">
      <div className="container mx-auto px-4">
        <HeaderText/>

        <Suspense fallback={<LoadingSpinner/>}>
          <GalleryContent/>
        </Suspense>
      </div>

      <FooterInfo/>
    </div>
  );
}
