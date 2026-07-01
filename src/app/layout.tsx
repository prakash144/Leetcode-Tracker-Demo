import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://prakash144.github.io/Interview-Tracly"),
    title: "Interview Tracly",
    description: "Track your journey. Crack your dream company. 🚀",
    icons: {
        icon: "/icon.svg",
    },
    openGraph: {
        title: "Interview Tracly",
        description: "Track your journey. Crack your dream company. 🚀",
        type: "website",
        url: "/",
        siteName: "Interview Tracly",
        images: [
            {
                url: "/icon.svg",
                width: 100,
                height: 100,
                alt: "Interview Tracly",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Interview Tracly",
        description: "Track your journey. Crack your dream company. 🚀",
        images: ["/icon.svg"],
    },
};

const FLASH_SCRIPT = `(function(){try{var m=localStorage.getItem("interview-tracly-theme");if(!m||(m!=="dark"&&m!=="light"&&m!=="system"))m="system";var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){document.documentElement.classList.add("dark")}})()`;

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#22c55e" />
            <script dangerouslySetInnerHTML={{ __html: FLASH_SCRIPT }} />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        </body>
        </html>
    );
}
