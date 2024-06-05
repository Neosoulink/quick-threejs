import { expose } from "threads";
import { Singleton } from "typescript-ioc";

@Singleton
export class CoreThread {
	constructor() {
		this.initCanvas();
	}

	private initCanvas(): void {
		onmessage = (event) => {
			const canvas: HTMLCanvasElement | undefined = event?.data?.canvas;
			if (canvas instanceof HTMLCanvasElement) this.init(canvas);
		};
	}

	private init(canvas: HTMLCanvasElement): void {
		console.log("canvas ==>", canvas);
	}
}

expose({});
