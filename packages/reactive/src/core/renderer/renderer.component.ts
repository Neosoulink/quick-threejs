import {
	Matrix4,
	PerspectiveCamera,
	Scene,
	SRGBColorSpace,
	WebGLRenderer
} from "three";
import { singleton } from "tsyringe";

@singleton()
export class RendererComponent {
	public static readonly RENDERER_PIXEL_RATIO: number = 1;

	private originalCameraMatrixWorld = new Matrix4();
	private originalCameraProjectionMatrix = new Matrix4();
	private renderer?: WebGLRenderer;
	private tmpScene = new Scene();

	public init(canvas: HTMLCanvasElement) {
		// @ts-ignore
		canvas["style"] = { width: canvas.width + "", height: canvas.height + "" };

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
		this.originalCameraMatrixWorld.copy(camera.matrixWorld);
		this.originalCameraProjectionMatrix.copy(camera.projectionMatrix);

		camera.matrixAutoUpdate = false;
		camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

		this.renderer?.render(this.tmpScene, camera);

		camera.matrixAutoUpdate = true;
		camera.matrixWorld.copy(this.originalCameraMatrixWorld);
		camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
		camera.projectionMatrix.copy(this.originalCameraProjectionMatrix);
	}
}
