import EventEmitter from "events";

export interface SceneSizesType {
	height: number;
	width: number;
}

export interface SizesProps {
	height?: SceneSizesType["height"];
	width?: SceneSizesType["width"];
	listenResize?: boolean;
}

export default class Sizes extends EventEmitter {
	width: SceneSizesType["width"] = window.innerWidth;
	height: SceneSizesType["height"] = window.innerHeight;
	aspect: number;
	pixelRatio = Math.min(window.devicePixelRatio, 2);
	listenResize: boolean;
	frustrum = 5;

	constructor({ height, width, listenResize = true }: SizesProps) {
		super();

		// SETUP
		this.height = Number(height ?? this.height);
		this.width = Number(width ?? this.width);
		this.aspect = this.width / this.height;
		this.listenResize = !!listenResize;

		if (this.listenResize) {
			window.addEventListener("resize", () => {
				this.height = window.innerHeight;
				this.width = window.innerWidth;
				this.pixelRatio = this.pixelRatio = Math.min(
					window.devicePixelRatio,
					2
				);

				this.emit("resize", { width: this.width, height: this.height });
			});
		}
	}
}
