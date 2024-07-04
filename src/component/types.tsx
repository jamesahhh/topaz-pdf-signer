class Sig {
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		scale: number
	) {
		this.b64 = "";
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.scale = scale;
	}

	b64: string;
	x: number;
	y: number;
	width: number;
	height: number;
	scale: number | undefined;
}

class Note {
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		text: string,
		fontSize: number,
		lineHeight: number
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.text = text;
		this.fontSize = fontSize;
		this.lineHeight = lineHeight;
	}
	x: number;
	y: number;
	width: number;
	height: number;
	text: string;
	fontSize: number;
	lineHeight: number;
}

export { Sig, Note };
