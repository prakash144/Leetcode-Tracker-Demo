import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Global CSS import

const geistSans = Geist({
    variable: "--font-geist-sans", // Define font as CSS variable
    subsets: ["latin"], // Define font subset (Latin characters)
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono", // Define font as CSS variable
    subsets: ["latin"], // Define font subset (Latin characters)
});

// Metadata with updated app name
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

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#22c55e" />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Apply custom fonts globally
        >
        {children}
        </body>
        </html>
    );
}
