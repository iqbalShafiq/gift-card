import type { CanvasConfig, GiftCardData, TextInCanvas } from "./types";

export class GiftCardCanvas {
	private ctx: CanvasRenderingContext2D;
	private canvas: HTMLCanvasElement;
	private readonly texts: TextInCanvas[];

	constructor(canvasConfig: CanvasConfig, texts: TextInCanvas[]) {
		// Create canvas
		this.canvas = document.createElement("canvas");
		this.canvas.width = canvasConfig.canvasWidth;
		this.canvas.height = canvasConfig.canvasHeight;
		this.texts = texts;

		// Get canvas context
		const context = this.canvas.getContext("2d");
		if (!context) {
			throw new Error("Could not get canvas context");
		}

		this.ctx = context as CanvasRenderingContext2D;
		this.ctx.fillStyle = canvasConfig.filStyle;
		this.ctx.strokeStyle = canvasConfig.strokeStyle;
	}

	/**
	 * Measure text width
	 * @param text
	 * @private
	 */
	private measureText(text: TextInCanvas): number {
		this.ctx.font = `${text.fontSize}px "${text.fontFamily}"`;
		return this.ctx.measureText(text.content).width;
	}

	/**
	 * Truncate text with ellipsis
	 * @param text
	 * @private
	 */
	private truncateWithEllipsis(text: TextInCanvas): string {
		const ellipsis = "...";

		if (this.measureText(text) <= text.maxWidth) {
			return text.content;
		}

		let truncated = text.content;
		while (
			this.measureText({ ...text, content: truncated + ellipsis }) >
				text.maxWidth &&
			truncated.length > 0
		) {
			truncated = truncated.slice(0, -1);
		}

		return truncated + ellipsis;
	}

	/**
	 * Split text into lines
	 * @param text
	 * @private
	 */
	private splitTextIntoLines(text: TextInCanvas): string[] {
		const words = text.content.split(" ");
		const lines: string[] = [];
		let currentLine = words[0];

		for (let i = 1; i < words.length; i++) {
			const word = words[i];
			const width = this.measureText({
				...text,
				content: `${currentLine} ${word}`,
			});

			if (width <= text.maxWidth) {
				currentLine += ` ${word}`;
			} else {
				lines.push(currentLine);
				if (lines.length === text.maxLines - 1) {
					const remainingWords = words.slice(i).join(" ");
					const lastLine = this.truncateWithEllipsis({
						...text,
						content: remainingWords,
					});
					lines.push(lastLine);
					return lines;
				}
				currentLine = word;
			}
		}

		lines.push(currentLine);
		return lines;
	}

	/**
	 * Generate gift card image
	 * @param data
	 */
	async generateGiftCard(data: GiftCardData): Promise<Blob> {
		// Clear canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw background if provided
		if (data.backgroundImage) {
			await this.drawBackground(data.backgroundImage);
		}

		// Draw text
		this.drawTexts();

		// Convert canvas to blob
		return new Promise((resolve, reject) => {
			this.canvas.toBlob((blob) => {
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error("Failed to generate image"));
				}
			}, "image/png");
		});
	}

	/**
	 * Draw background image on canvas
	 * @param file
	 * @private
	 */
	private async drawBackground(file: File): Promise<void> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
				resolve();
			};
			img.onerror = reject;
			img.src = URL.createObjectURL(file);
		});
	}

	/**
	 * Draw texts on canvas
	 * @private
	 */
	private drawTexts(): void {
		for (const text of this.texts) {
			if (text.maxLines === 1) {
				const startX = text.positions[0]?.x;
				const startY = text.positions[0]?.y;
				this.ctx.fillText(this.truncateWithEllipsis(text), startX, startY);
			} else {
				const lines = this.splitTextIntoLines(text);
				lines.forEach((line, index) => {
					const startX = text.positions[index]?.x;
					const startY = text.positions[index]?.y;
					this.ctx.fillText(line, startX, startY);
				});
			}
		}
	}
}
