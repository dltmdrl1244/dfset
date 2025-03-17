import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import { Noto_Sans_KR } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9624261648784529"
          crossOrigin="anonymous"></script>
      </head>
      <body className={notoSansKr.className}>
        <Analytics />
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
