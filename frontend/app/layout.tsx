// !! Careful if you edit this file as it will modify all other pages in the project that don't have a layout.tsx file

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/header/Header";
import { Providers } from "./store/providers";

export const metadata: Metadata = {
  title: "CosmicClassroom",
  description: "Transform your classroom into a universe of discovery with CosmicClassroom!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={`antialiased flex flex-col min-h-screen text-white`}>
          <Header />
          <div className="px-5 flex items-center justify-center">{children}</div>
        </body>
      </html>
    </Providers>
  );
}
