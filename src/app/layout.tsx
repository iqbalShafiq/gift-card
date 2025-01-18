import type { Metadata } from "next";
import {
	Geist,
	Geist_Mono,
	Great_Vibes,
	Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { Card } from "@/components/ui/card";
import type React from "react";

const playfair = Playfair_Display({
	subsets: ["latin"],
	display: "swap",
});

const greatVibes = Great_Vibes({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Gift Card",
	description: "Generate gift card image with custom text",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiasing flex w-full flex-col items-center justify-center bg-gray-200`}
			>
				<Card
					className={
						"my-0 w-full rounded-none px-8 py-4 md:my-4 md:w-1/2 md:rounded-md"
					}
				>
					{children}
				</Card>
			</body>
		</html>
	);
}
