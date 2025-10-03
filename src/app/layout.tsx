import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { getLocale } from "gt-next/server";
import { GTProvider } from "gt-next";

const pixelOperator = localFont({
  src: "../fonts/PixelOperator.ttf",
  variable: "--font-pixel-operator",
});

const windowsBold = localFont({
  src: "../fonts/windowsBold.ttf",
  variable: "--font-windows-bold",
});

const emojiFont = localFont({
  src: "../fonts/EmojiFont.ttf",
  variable: "--font-emoji",
});

export const metadata: Metadata = {
  title: "crystallized photo gallery.",
  description: "A chill little gallery of my photos.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={await getLocale()}>
      <head>
        <link rel="icon" href="/icon.png" />
      </head>
      <body
        className={`${pixelOperator.variable} ${windowsBold.variable} ${emojiFont.variable} antialiased`}
      >
        <GTProvider>
          {children}
        </GTProvider>
      </body>
    </html>
  );
}
