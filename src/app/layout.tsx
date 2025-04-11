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
    title: "Leetcode Tracker", // App name
    description: "Track your Leetcode progress and problems",
    openGraph: {
        title: "Leetcode Tracker",
        description: "Track your Leetcode progress and problems",
        images: [
            {
                url: "/path/to/your/og-image.png", // You can replace this with your app's image URL
                width: 1200,
                height: 630,
                alt: "Leetcode Tracker",
            },
        ],
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
        <header>
            {/* Optional header component or navigation could be added here */}
        </header>

        <main>{children}</main> {/* Render dynamic content here */}

        <footer>
            {/* Optional footer component */}
        </footer>
        </body>
        </html>
    );
}
