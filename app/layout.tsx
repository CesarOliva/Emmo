import type { Metadata } from "next";
import { Noto_Serif, Caveat, Geist } from "next/font/google";
import { ConvexClientProvider } from "../providers/convex-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="es-MX" className={cn("h-full", "antialiased", notoSerif.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
