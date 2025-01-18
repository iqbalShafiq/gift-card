import { beforeEach, describe, expect, mock, test } from "bun:test";
import { GiftCardCanvas } from "@/app/utils/canvas/GiftCardCanvas";
import type {
	CanvasConfig,
	GiftCardData,
	TextInCanvas,
} from "@/app/utils/canvas/types";

describe("GiftCardCanvas", () => {
	let canvas: GiftCardCanvas;
	let mockConfig: CanvasConfig;
	let mockTexts: TextInCanvas[];

	beforeEach(() => {
		// Mock canvas and context
		Object.defineProperty(global, "document", {
			value: {
				createElement: () => ({
					getContext: () => ({
						measureText: (text: string) => ({ width: text.length * 10 }),
						font: "",
						fillStyle: "",
						strokeStyle: "",
						clearRect: mock(() => {}),
						fillText: mock(() => {}),
						drawImage: mock(() => {}),
					}),
					toBlob: (callback: (blob: Blob | null) => void) => {
						callback(new Blob(["mock-image-data"], { type: "image/png" }));
					},
					width: 1000,
					height: 600,
				}),
			},
			writable: true,
			configurable: true,
		});

		// Mock Image constructor
		global.Image = class {
			onload: () => void = () => {};
			constructor() {
				setTimeout(() => this.onload(), 0);
			}
		} as unknown as typeof Image;

		// Mock URL.createObjectURL
		global.URL.createObjectURL = mock(() => "mock-url");
		global.URL.revokeObjectURL = mock(() => {});

		mockConfig = {
			canvasWidth: 1000,
			canvasHeight: 600,
			filStyle: "#000000",
			strokeStyle: "#FFFFFF",
		};

		mockTexts = [
			{
				content: "Hello",
				fontFamily: "Arial",
				fontSize: 24,
				maxWidth: 800,
				maxLines: 1,
				positions: [{ x: 50, y: 50 }],
			},
			{
				content: "This is a longer text that needs multiple lines",
				fontFamily: "Arial",
				fontSize: 20,
				maxWidth: 300,
				maxLines: 2,
				positions: [
					{ x: 50, y: 100 },
					{ x: 50, y: 130 },
				],
			},
		];

		canvas = new GiftCardCanvas(mockConfig, mockTexts);
	});

	describe("Constructor", () => {
		test("should create canvas instance successfully", () => {
			expect(canvas).toBeInstanceOf(GiftCardCanvas);
		});

		test("should throw error when canvas context is not available", () => {
			// Mock document.createElement to return canvas without context
			global.document.createElement = () =>
				({
					getContext: () => null,
				}) as unknown as HTMLCanvasElement;

			expect(() => new GiftCardCanvas(mockConfig, mockTexts)).toThrow(
				"Could not get canvas context",
			);
		});
	});

	describe("Text Processing", () => {
		test("should handle single line text", async () => {
			const mockData: GiftCardData = {
				backgroundImage: undefined,
			};

			const fillTextMock = mock(() => {});
			const ctx = canvas.ctx;
			ctx.fillText = fillTextMock;

			await canvas.generateGiftCard(mockData);

			// Check if fillText was called for single line text
			expect(fillTextMock).toHaveBeenCalledWith(
				"Hello",
				mockTexts[0].positions[0].x,
				mockTexts[0].positions[0].y,
			);
		});

		test("should handle multi-line text", async () => {
			const mockData: GiftCardData = {
				backgroundImage: undefined,
			};

			const fillTextMock = mock(() => {});
			const ctx = canvas.ctx;
			ctx.fillText = fillTextMock;

			await canvas.generateGiftCard(mockData);

			// Verify multiple fillText calls for multi-line text
			expect(fillTextMock).toHaveBeenCalledTimes(mockTexts.length + 1);
		});

		test("should truncate text with ellipsis when exceeding maxWidth", async () => {
			const longText: TextInCanvas = {
				content:
					"This is a very very very very long text that should be truncated",
				fontFamily: "Arial",
				fontSize: 24,
				maxWidth: 200,
				maxLines: 1,
				positions: [{ x: 50, y: 50 }],
			};

			canvas = new GiftCardCanvas(mockConfig, [longText]);
			const mockData: GiftCardData = {
				backgroundImage: undefined,
			};

			const fillTextMock = mock(() => {});
			const ctx = canvas.ctx;
			ctx.fillText = fillTextMock;

			await canvas.generateGiftCard(mockData);

			// Verify that the text was truncated (contains "...")
			const calls = fillTextMock.mock.calls as unknown as string[][];
			expect(calls[0][0]).toContain("...");
		});
	});

	describe("Background Image", () => {
		test("should handle background image successfully", async () => {
			const mockFile = new File([""], "test.png", { type: "image/png" });
			const mockData: GiftCardData = {
				backgroundImage: mockFile,
			};

			const drawImageMock = mock(() => {});
			const ctx = canvas.ctx;
			ctx.drawImage = drawImageMock;

			await canvas.generateGiftCard(mockData);

			expect(drawImageMock).toHaveBeenCalled();
		});

		test("should handle background image load error", async () => {
			const mockFile = new File([""], "test.png", { type: "image/png" });
			const mockData: GiftCardData = {
				backgroundImage: mockFile,
			};

			// Mock Image to trigger error
			global.Image = class {
				onerror: () => void = () => {};
				constructor() {
					setTimeout(() => this.onerror(), 0);
				}
			} as unknown as typeof Image;

			expect(canvas.generateGiftCard(mockData)).rejects.toThrow();
		});
	});

	describe("Blob Generation", () => {
		test("should generate blob successfully", async () => {
			const mockData: GiftCardData = {
				backgroundImage: undefined,
			};

			const result = await canvas.generateGiftCard(mockData);
			expect(result).toBeInstanceOf(Blob);
			expect(result.type).toBe("image/png");
		});

		test("should handle blob generation failure", async () => {
			const mockData: GiftCardData = {
				backgroundImage: undefined,
			};

			// Mock toBlob to return null
			const canvas = document.createElement("canvas");
			canvas.toBlob = (callback: (blob: Blob | null) => void) => {
				callback(null);
			};

			global.document.createElement = () =>
				canvas as unknown as HTMLCanvasElement;

			const giftCard = new GiftCardCanvas(mockConfig, mockTexts);
			expect(giftCard.generateGiftCard(mockData)).rejects.toThrow(
				"Failed to generate image",
			);
		});
	});
});
