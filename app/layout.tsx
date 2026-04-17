import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eleswooddesigns.com/"),
  title: {
    default: "ElesWoodDesigns — Build It Yourself Woodworking Plans",
    template: "%s | ElesWoodDesigns"
  },
  description: "Bold DIY woodworking plans for furniture, garden, and more. Step-by-step PDF guides, 3D diagrams, and precise cut lists. Download and build today.",
  keywords: ["DIY woodworking plans", "woodworking blueprints", "garden project plans", "furniture building guides", "PDF woodworking plans", "beginner woodworking", "woodcraft designs"],
  authors: [{ name: "ElesWoodDesigns" }],
  creator: "ElesWoodDesigns",
  publisher: "ElesWoodDesigns",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    title: "ElesWoodDesigns — Premium DIY Woodworking Plans",
    description: "Download step-by-step woodworking blueprints. Precise, bold, and beginner-friendly.",
    url: "https://eleswooddesigns.com/",
    siteName: "ElesWoodDesigns",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "ElesWoodDesigns Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElesWoodDesigns — DIY Woodworking Plans",
    description: "Bold DIY woodworking plans for furniture, garden, and more.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ElesWoodDesigns",
              "url": "https://eleswooddesigns.com/",
              "logo": "https://eleswooddesigns.com/logo.png",
              "sameAs": [
                "https://www.pinterest.com/eleswooddesigns/",
                "https://www.etsy.com/shop/ElesWoodDesigns"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "eleswooddesigns@gmail.com",
                "contactType": "customer service"
              }
            })
          }}
        />
        {/* WebSite JSON-LD for Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://eleswooddesigns.com/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://eleswooddesigns.com/products?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="font-sans antialiased text-black bg-[#FFFDF0]">
        {/* Google Tag (gtag.js) */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-144E244HYN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-144E244HYN');
          `}
        </Script>
        <Script id="pinterest-tag" strategy="afterInteractive">
          {`
            !function(e){if(!window.pintrk){window.pintrk=function()
            {window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
            n=window.pintrk;n.queue=[],n.version="3.0";var
            t=document.createElement("script");t.async=!0,t.src=e;var
            r=document.getElementsByTagName("script")[0];
            r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
            pintrk('load', '1133781412349401127');
            pintrk('page');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }} alt=""
            src="https://ct.pinterest.com/v3/?tid=1133781412349401127&event=init&noscript=1" />
        </noscript>
        <div className="flex flex-col min-h-screen border-t-4 border-black">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
