import HeaderText from "@/components/HeaderText";
import ImageGallery from "@/components/image/ImageGallery";
import VersionCounter from "@/components/VersionCounter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-95% to-blue-950">
      <div className="container mx-auto px-4">
        <HeaderText />
        <ImageGallery />
      </div>
      <VersionCounter />
    </div>
  );
}
