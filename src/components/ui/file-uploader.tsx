"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef, useState } from "react";

interface FileUploaderProps {
	onFileSelectAction: (
		file: File,
		preview: string,
		size: { width: number; height: number },
	) => void;
	label: string;
}

export function FileUploader({ onFileSelectAction, label }: FileUploaderProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const [imageSize, setImageSize] = useState<{
		width: number;
		height: number;
	} | null>(null);
	const [dragActive, setDragActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		const file = e.dataTransfer.files?.[0];
		if (file?.type.startsWith("image/")) {
			handleFile(file);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file?.type.startsWith("image/")) {
			handleFile(file);
		}
	};

	const handleFile = (file: File) => {
		const url = URL.createObjectURL(file);
		const img = new window.Image();
		img.onload = () => {
			const size = {
				width: img.width,
				height: img.height,
			};
			setImageSize(size);
			setPreview(url);
			onFileSelectAction(file, url, size);
		};
		img.src = url;
	};

	const handleButtonClick = () => {
		inputRef.current?.click();
	};

	return (
		<div className="w-full">
			{preview && (
				<div className="relative mb-6 w-full">
					{preview && imageSize && (
						<div className="flex w-full justify-center">
							<Image
								src={preview}
								alt="Preview"
								width={imageSize.width}
								height={imageSize.height}
								className="h-auto max-w-full rounded-sm"
								priority
							/>
						</div>
					)}
				</div>
			)}
			<Label
				htmlFor={"recipient"}
				className={"mb-2 font-semibold text-slate-900"}
			>
				{label}
			</Label>
			<div
				className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-300 border-dashed px-6 py-8 transition-colors duration-200 ease-in-out hover:border-primary hover:bg-primary/10 ${
					dragActive ? "border-primary bg-primary/10" : ""
				}`}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				onClick={handleButtonClick}
				onKeyDown={handleButtonClick}
			>
				<Input
					id="file-upload"
					type="file"
					ref={inputRef}
					className="hidden"
					accept="image/*"
					onChange={handleChange}
				/>
				<div className="text-center">
					<div className="flex flex-col items-center justify-center">
						<UploadCloud size={32} />
						<div className="mt-3 flex flex-col text-gray-600 text-sm">
							<p className="font-semibold text-sm md:text-lg">Browse File</p>
							<p className="text-xs md:text-sm">Drag and drop file here</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
