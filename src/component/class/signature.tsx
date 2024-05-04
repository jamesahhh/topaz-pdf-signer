class SignatureObject {
	private base_64: string;
	private x: number;
	private y: number;

	constructor() {
		this.base_64 = "";
		this.x = 0;
		this.y = 0;
	}

	/**
	 * Returns the base64 string of the signature
	 * @returns {string} The base64 string of the signature
	 */
	getBase64(): string {
		return this.base_64;
	}

	/**
	 * Sets the base64 string of the signature
	 * @param base_64 The base64 string of the signature
	 */
	setBase64(base_64: string): void {
		this.base_64 = base_64;
	}

	getLocation(): object {
		return { x: this.x, y: this.y };
	}

	setLocation(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
