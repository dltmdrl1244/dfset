import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import { Noto_Sans_KR } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAdSense } from "./components/googleAdSense";
import { CharacterProvider } from "./context/characterContext";

export const metadata: Metadata = {
  title: "DFset 던파셋 - 던전앤파이터 아이템 기록 검색",
  description: "DFset",
  other: {
    "google-adsense-account": "ca-pub-9624261648784529",
  },
};

const notoSansKr = Noto_Sans_KR({
  weight: ["400"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <GoogleAdSense />
      <body className={notoSansKr.className}>
        <Analytics />
        <ChakraProvider>
          <CharacterProvider>{children}</CharacterProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
