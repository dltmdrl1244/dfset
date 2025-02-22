import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import ContextProvider from "./context/ContextProvider";
import { Noto_Sans_KR } from "next/font/google";

export const metadata: Metadata = {
  title: "DFset - 던전앤파이터 아이템 기록 검색",
  description: "DFset",
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
      <body className={notoSansKr.className}>
        <ChakraProvider>
          <ContextProvider>{children}</ContextProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
