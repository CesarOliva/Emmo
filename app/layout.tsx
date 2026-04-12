import type { Metadata } from "next";
import { Noto_Serif, Caveat } from "next/font/google";
import { ConvexClientProvider } from "../providers/convex-provider";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "EMMO App",
  description: "Track your emotions everyday",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" className={`${notoSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
