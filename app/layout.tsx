import type { Metadata } from "next";
import { Noto_Serif, Caveat, Geist } from "next/font/google";
import { ConvexClientProvider } from "../components/providers/convex-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
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
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="es-MX" className={cn("h-full", "antialiased", notoSerif.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col w-full items-center">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey='emmo-theme'
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
