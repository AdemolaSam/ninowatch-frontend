import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { ACTIVE_THEME } from "@/lib/theme";

const mono = localFont({
  src: [
    { path: "./fonts/JetBrainsMono-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/JetBrainsMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "NiñoWatch",
  description: "Verified El Niño impact news and advisories in local languages.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme={ACTIVE_THEME} className={mono.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
