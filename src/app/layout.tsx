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
    metadataBase: new URL("https://prakash144.github.io/Leetcode-Tracker-Demo"),
    title: "Leetcode Tracker",
    description: "Track your Leetcode progress and problems",
    openGraph: {
        title: "Leetcode Tracker",
        description: "Track your Leetcode progress and problems",
        type: "website",
        url: "/",
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
