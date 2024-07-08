import {
	Camera,
	CineonToneMapping,
	PCFSoftShadowMap,
	SRGBColorSpace,
	WebGLRenderer
} from "three";
import { inject, singleton } from "tsyringe";

import { WorldComponent } from "../world/world.component";
import { CameraComponent } from "../camera/camera.component";
import type { OffscreenCanvasWithStyle } from "../../../common/interfaces/canvas.interface";
import { SizesComponent } from "../sizes/sizes.component";
import { DebugComponent } from "../debug/debug.component";

@singleton()
export class RendererComponent {
	public static readonly RENDERER_PIXEL_RATIO: number = 1;

	public enabled = true;
	public instance?: WebGLRenderer;

	constructor(
		@inject(WorldComponent) private readonly worldComponent: WorldComponent,
		@inject(CameraComponent) private readonly cameraComponent: CameraComponent,
		@inject(SizesComponent) private readonly sizesComponent: SizesComponent,
		@inject(DebugComponent) private readonly debugComponent: DebugComponent
	) {}

	public init(canvas: OffscreenCanvasWithStyle) {
		this.instance = new WebGLRenderer({
			canvas,
			context: canvas.getContext("webgl2", {
				stencil: true,
				powerPreference: "high-performance"
			}) as WebGL2RenderingContext,
			powerPreference: "high-performance",
			depth: true,
			antialias: true
		});
		this.instance.autoClear = false;
		this.instance.setPixelRatio(RendererComponent.RENDERER_PIXEL_RATIO);
		this.instance.setClearColor(0x000000, 0);
		this.instance.shadowMap.enabled = true;
		this.instance.shadowMap.type = PCFSoftShadowMap;
		this.instance.outputColorSpace = SRGBColorSpace;
		this.instance.toneMapping = CineonToneMapping;
		this.instance.toneMappingExposure = 1.75;
	}

	public setSize(width: number, height: number) {
		this.instance?.setSize(width, height);
	}

	public render() {
		if (
			!(
				this.enabled &&
				this.cameraComponent.instance instanceof Camera &&
				this.instance instanceof WebGLRenderer
			)
		)
			return;

		this.instance.setViewport(
			0,
			0,
			this.sizesComponent.width,
			this.sizesComponent.height
		);
		this.instance.render(
			this.worldComponent.scene,
			this.cameraComponent.instance
		);

		if (this.debugComponent.enabled && this.cameraComponent.miniCamera) {
			this.instance.setScissorTest(true);
			this.instance.setViewport(
				this.sizesComponent.width - this.sizesComponent.width / 3,
				this.sizesComponent.height - this.sizesComponent.height / 3,
				this.sizesComponent.width / 3,
				this.sizesComponent.height / 3
			);
			this.instance.setScissor(
				this.sizesComponent.width - this.sizesComponent.width / 3,
				this.sizesComponent.height - this.sizesComponent.height / 3,
				this.sizesComponent.width / 3,
				this.sizesComponent.height / 3
			);
			this.instance.render(
				this.worldComponent.scene,
				this.cameraComponent.miniCamera
			);
			this.instance.setScissorTest(false);
		}
	}
}
