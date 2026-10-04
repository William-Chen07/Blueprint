import type { Metadata } from "next";
import { Geist_Mono, DM_Sans, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import FlashlightBoard from "@/components/flashlight-board";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blueprint",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FlashlightBoard>
          <Navbar />
          {children}
        </FlashlightBoard>
      </body>
    </html>
  );
}
