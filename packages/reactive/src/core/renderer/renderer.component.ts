import { PerspectiveCamera, Scene, SRGBColorSpace, WebGLRenderer } from "three";
import { singleton } from "tsyringe";

import { OffscreenCanvasWithStyle } from "../../common/interfaces/canvas.interface";

@singleton()
export class RendererComponent {
	public static readonly RENDERER_PIXEL_RATIO: number = 1;

	private renderer?: WebGLRenderer;
	public tmpScene = new Scene();

	public init(canvas: OffscreenCanvasWithStyle) {
		this.renderer = new WebGLRenderer({
			canvas,
			context: canvas.getContext("webgl2", {
				stencil: true,
				powerPreference: "high-performance" as WebGLPowerPreference
			} as WebGLContextAttributes) as WebGL2RenderingContext,
			powerPreference: "high-performance",
			depth: true,
			antialias: true
		});
		this.renderer.autoClear = false;
		this.renderer.setPixelRatio(RendererComponent.RENDERER_PIXEL_RATIO);
		this.renderer.setClearColor(0x000000, 0);
		this.renderer.shadowMap.enabled = false;
		this.renderer.outputColorSpace = SRGBColorSpace;
	}

	public setSize(width: number, height: number) {
		this.renderer?.setSize(width, height);
	}

	public render(camera: PerspectiveCamera) {
		this.renderer?.clear();
		this.renderer?.render(this.tmpScene, camera);
	}
}
