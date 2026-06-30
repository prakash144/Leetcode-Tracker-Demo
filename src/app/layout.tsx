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
            {/* Removed default Next.js icons and meta */}
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Apply custom fonts globally
        >
        {children}
        </body>
        </html>
    );
}
