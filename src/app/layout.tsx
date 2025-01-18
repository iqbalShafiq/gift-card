import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Card } from "@/components/ui/card";
import type React from "react";

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
				<Card className={"my-4 w-1/2 px-8 py-4"}>{children}</Card>
			</body>
		</html>
	);
}
