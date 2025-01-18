import type { Metadata } from "next";
import { Geist, Geist_Mono, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import type React from "react";

const greatVibes = Great_Vibes({
	variable: "--font-great-vibes",
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
				className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} antialiasing flex w-full flex-col items-center justify-center bg-gray-200`}
			>
				<Card
					className={
						"my-0 w-full rounded-none px-8 py-4 md:my-4 md:w-5/6 md:rounded-md xl:w-1/2"
					}
				>
					{children}
				</Card>
				<Toaster />
			</body>
		</html>
	);
}
