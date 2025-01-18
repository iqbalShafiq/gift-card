export interface CanvasConfig {
	filStyle: string;
	strokeStyle: string;
	canvasWidth: number;
	canvasHeight: number;
}

export interface Position {
	x: number;
	y: number;
}

export interface TextInCanvas {
	content: string;
	fontFamily: string;
	fontSize: number;
	positions: Position[];
	maxWidth: number;
	maxLines: number;
}

export interface GiftCardData {
	backgroundImage?: File;
}
