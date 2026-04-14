import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eleswooddesigns.com/"),
  title: "ElesWoodDesigns — Build It Yourself",
  description: "Bold DIY woodworking plans for furniture, garden, and more. Download and build today.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    other: {
      "p:domain_verify": "d4e7e5496616f25c319df35abbbdb4b1",
    },
    google: "-D6vWp2aorp2dn1-jvYaYitpms2RNEaBOAp3f0QgyZk",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} scroll-smooth`}>
      <head>
        <meta name="p:domain_verify" content="d4e7e5496616f25c319df35abbbdb4b1"/>
      </head>
      <body className="font-sans antialiased text-black bg-[#FFFDF0]">
        <div className="flex flex-col min-h-screen border-t-4 border-black">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
