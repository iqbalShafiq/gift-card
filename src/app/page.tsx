"use client";

import { GiftCardCanvas } from "@/app/utils/canvas/GiftCardCanvas";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function Home() {
	const [imageFile, setImageFile] = React.useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
	const [imageSize, setImageSize] = React.useState<{
		width: number;
		height: number;
	} | null>(null);

	const { toast } = useToast();

	const handleFileSelect = React.useCallback(
		(file: File, preview: string, size: { width: number; height: number }) => {
			setImageFile(file);
			setPreviewUrl(preview);
			setImageSize(size);
		},
		[],
	);

	const isValidForms = (recipient: string, message: string, sender: string) => {
		if (!recipient.trim()) {
			console.log("Recipient name is required");
			return false;
		}

		if (!message.trim()) {
			console.log("Message is required");
			return false;
		}

		if (!sender.trim()) {
			console.log("Sender name is required");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!imageFile || !previewUrl || !imageSize) {
			toast({
				variant: "destructive",
				title: "Invalid Image",
				description: "Please try again with a valid image",
			});
			return;
		}

		const formData = new FormData(e.currentTarget);
		const recipient = formData.get("recipient") as string;
		const message = formData.get("message") as string;
		const sender = formData.get("sender") as string;

		if (!isValidForms(recipient, message, sender)) {
			toast({
				variant: "destructive",
				title: "Invalid Form",
				description: "Please fill all the required fields",
			});
			return;
		}

		const giftCardCanvas = new GiftCardCanvas(
			{
				filStyle: "#7e674d",
				strokeStyle: "#a88f74",
				canvasWidth: imageSize.width || 0,
				canvasHeight: imageSize.height || 0,
			},
			[
				{
					content: recipient,
					fontFamily: "Great Vibes",
					fontSize: Math.floor(imageSize.height / 20),
					positions: [
						{ x: imageSize.width * 0.45, y: imageSize.height * 0.35 },
					],
					maxWidth: imageSize.width * 0.3,
					maxLines: 1,
				},
				{
					content: message,
					fontFamily: "Great Vibes",
					fontSize: Math.floor(imageSize.height / 20),
					positions: [
						{ x: imageSize.width * 0.3, y: imageSize.height * 0.435 },
						{ x: imageSize.width * 0.3, y: imageSize.height * 0.515 },
					],
					maxWidth: imageSize.width * 0.5,
					maxLines: 2,
				},
				{
					content: sender,
					fontFamily: "Great Vibes",
					fontSize: Math.floor(imageSize.height / 20),
					positions: [{ x: imageSize.width * 0.4, y: imageSize.height * 0.6 }],
					maxWidth: imageSize.width * 0.3,
					maxLines: 1,
				},
			],
		);

		try {
			const blob = await giftCardCanvas.generateGiftCard({
				backgroundImage: imageFile ? imageFile : undefined,
			});

			// Create download link
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "gift-card.png";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Failed to generate gift card",
				description: "Please try again",
			});
			console.log("Failed to generate gift card:", error);
		}
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
