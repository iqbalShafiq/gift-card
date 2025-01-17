"use client";

import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef, useState } from "react";

interface FileUploaderProps {
	onFileSelectAction: (file: File) => void;
}

export function FileUploader({ onFileSelectAction }: FileUploaderProps) {
	const [preview, setPreview] = useState<string | null>(null);
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
		setPreview(url);
		onFileSelectAction(file);
	};

	const handleButtonClick = () => {
		inputRef.current?.click();
	};

	return (
		<div className="w-full">
			<div
				className={`mt-2 flex flex-col items-center justify-center rounded-lg border border-gray-300 border-dashed px-6 py-8 transition-colors duration-200 ease-in-out ${
					dragActive ? "border-primary bg-primary/10" : ""
				}`}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
			>
				<Input
					id="file-upload"
					type="file"
					ref={inputRef}
					className="hidden"
					accept="image/*"
					onChange={handleChange}
				/>

				{preview ? (
					<div className="relative h-48 w-48">
						<Image
							src={preview}
							alt="Preview"
							className="rounded-lg object-cover"
							fill
						/>
					</div>
				) : (
					<div className="text-center">
						<div className="flex flex-col items-center justify-center">
							<UploadCloud size={32} />
							<div className="mt-3 flex flex-col text-gray-600 text-sm">
								<p className="font-semibold text-lg">Browse File</p>
								<p className="text-sm">Drag and drop file here</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
