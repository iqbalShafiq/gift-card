"use client";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function Home() {
	const [imageFile, setImageFile] = React.useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
	const [imageSize, setImageSize] = React.useState<{
		width: number;
		height: number;
	} | null>(null);

	const handleFileSelect = React.useCallback(
		(file: File, preview: string, size: { width: number; height: number }) => {
			console.log("File selected:", { file, preview, size });
			setImageFile(file);
			setPreviewUrl(preview);
			setImageSize(size);
		},
		[],
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Submit triggered with:", { imageFile, previewUrl, imageSize });

		if (!imageFile) {
			console.error("No image file selected");
			return;
		}

		if (!previewUrl) {
			console.error("No preview URL available");
			return;
		}

		if (!imageSize) {
			console.error("No image size information");
			return;
		}

		const formData = new FormData(e.currentTarget);
		const recipient = formData.get("recipient") as string;
		const message = formData.get("message") as string;
		const sender = formData.get("sender") as string;

		if (!recipient || !message || !sender) {
			console.error("Missing form data:", { recipient, message, sender });
			return;
		}

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			console.error("Could not get canvas context");
			return;
		}

		const img = new Image();
		img.onload = () => {
			try {
				// Set canvas size
				canvas.width = imageSize.width;
				canvas.height = imageSize.height;

				// Draw image
				ctx.drawImage(img, 0, 0, imageSize.width, imageSize.height);

				// Calculate base metrics
				const lineSpacing = 50;
				const baseFontSize = Math.floor(imageSize.height / 20);

				// Calculate vertical positions
				const verticalSpacing = {
					firstLine: imageSize.height * 0.35,
					secondLine: imageSize.height * 0.435,
					thirdLine: imageSize.height * 0.515,
					fourthLine: imageSize.height * 0.6,
				};

				// Calculate horizontal positions (as percentage of width)
				const horizontalPositions = {
					dear: 0.45,
					message: 0.3,
					from: 0.4,
				};

				// Text styling configuration
				const textConfig = {
					fillStyle: "#7e674d",
					strokeStyle: "#a88f74",
					lineWidth: Math.max(2, baseFontSize / 12),
					fontFamily: "Great Vibes",
				};

				// Apply text styling
				ctx.fillStyle = textConfig.fillStyle;
				ctx.strokeStyle = textConfig.strokeStyle;
				ctx.lineWidth = textConfig.lineWidth;
				ctx.textAlign = "left";

				// Helper function for measuring text width
				const measureText = (text: string, fontSize: number): number => {
					ctx.font = `${fontSize}px "${textConfig.fontFamily}"`;
					return ctx.measureText(text).width;
				};

				// Helper function for truncating text with ellipsis
				const truncateWithEllipsis = (
					text: string,
					maxWidth: number,
					fontSize: number,
				): string => {
					const ellipsis = "...";

					if (measureText(text, fontSize) <= maxWidth) {
						return text;
					}

					let truncated = text;
					while (
						measureText(truncated + ellipsis, fontSize) > maxWidth &&
						truncated.length > 0
					) {
						truncated = truncated.slice(0, -1);
					}

					return truncated + ellipsis;
				};

				// Helper function for splitting text into lines
				const splitTextIntoLines = (
					text: string,
					maxWidth: number,
					fontSize: number,
				): string[] => {
					const words = text.split(" ");
					const lines: string[] = [];
					let currentLine = words[0];

					for (let i = 1; i < words.length; i++) {
						const word = words[i];
						const width = measureText(`${currentLine} ${word}`, fontSize);

						if (width <= maxWidth) {
							currentLine += ` ${word}`;
						} else {
							lines.push(currentLine);
							if (lines.length === maxLines - 1) {
								const remainingWords = words.slice(i).join(" ");
								const lastLine = truncateWithEllipsis(
									remainingWords,
									maxWidth,
									fontSize,
								);
								lines.push(lastLine);
								return lines;
							}
							currentLine = word;
						}
					}

					lines.push(currentLine);
					return lines;
				};

				// Helper function for drawing text
				const drawText = (
					text: string,
					x: number,
					y: number,
					fontSize: number = baseFontSize,
				) => {
					ctx.font = `${fontSize}px "${textConfig.fontFamily}"`;
					ctx.strokeText(text, x, y);
					ctx.fillText(text, x, y);
				};

				// Draw Dear
				drawText(
					recipient,
					imageSize.width * horizontalPositions.dear,
					verticalSpacing.firstLine,
					baseFontSize * 1.2,
				);

				// Split and draw message
				const maxMessageWidth = imageSize.width * 0.5;
				const maxLines = 2;
				const messageLines = splitTextIntoLines(
					message,
					maxMessageWidth,
					baseFontSize,
				);

				const messageX = imageSize.width * horizontalPositions.message;
				messageLines.forEach((line, index) => {
					const y = verticalSpacing.secondLine + index * lineSpacing;
					drawText(line, messageX, y);
				});

				// Draw From
				drawText(
					sender,
					imageSize.width * horizontalPositions.from,
					verticalSpacing.fourthLine,
				);

				// Convert to blob and download
				canvas.toBlob((blob) => {
					if (!blob) {
						console.error("Failed to create blob");
						return;
					}

					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = "gift-card.png";
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
				}, "image/png");
			} catch (error) {
				console.error("Error processing image:", error);
			}
		};

		img.onerror = (error) => {
			console.error("Failed to load image:", error);
		};

		img.src = previewUrl;
	};

	return (
		<div>
			<form className="flex flex-col space-y-4 py-4" onSubmit={handleSubmit}>
				<header>
					<h1 className="px-2 font-semibold text-2xl">Gift Card</h1>
					<Separator className="-mx-8 relative mt-6 mb-4" />
				</header>

				<main className="flex flex-col space-y-4">
					<div className="flex flex-col space-y-2">
						<FileUploader
							onFileSelectAction={handleFileSelect}
							label="File Upload"
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<Label htmlFor="recipient" className="font-semibold text-slate-900">
							Dear
						</Label>
						<Input
							name="recipient"
							id="recipient"
							placeholder="Recipient Name"
							type="text"
							required
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<Label htmlFor="message" className="font-semibold text-slate-900">
							Message
						</Label>
						<Input
							name="message"
							id="message"
							placeholder="Message"
							type="text"
							required
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<Label htmlFor="sender" className="font-semibold text-slate-900">
							Sender
						</Label>
						<Input
							name="sender"
							id="sender"
							placeholder="Sender Name"
							type="text"
							required
						/>
					</div>
				</main>

				<footer className="flex w-full flex-col">
					<Separator className="-mx-8 my-4" />
					<div className="flex w-full flex-row justify-center">
						<Button
							type="submit"
							className="mt-4 w-fit bg-green-500 px-8 font-semibold text-white"
							disabled={!imageFile || !previewUrl || !imageSize}
						>
							Download
						</Button>
					</div>
				</footer>
			</form>
		</div>
	);
}
