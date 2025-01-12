import {
	Camera,
	CineonToneMapping,
	PCFSoftShadowMap,
	SRGBColorSpace,
	WebGLRenderer
} from "three";
import { inject, singleton } from "tsyringe";

import type { OffscreenCanvasWithStyle } from "../../../common/interfaces";
import { WorldService } from "../world/world.service";
import { CameraService } from "../camera/camera.service";
import { SizesService } from "../sizes/sizes.service";

@singleton()
export class RendererService {
	public static readonly RENDERER_PIXEL_RATIO: number = 1;

	public enabled = true;
	public instance?: WebGLRenderer;

	constructor(
		@inject(WorldService) private readonly _worldService: WorldService,
		@inject(CameraService) private readonly _cameraService: CameraService,
		@inject(SizesService) private readonly _sizesService: SizesService
	) {}

	public setWebGLRenderer(canvas: OffscreenCanvasWithStyle) {
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
		this.instance.setPixelRatio(RendererService.RENDERER_PIXEL_RATIO);
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
				this._cameraService.instance instanceof Camera &&
				this.instance instanceof WebGLRenderer
			)
		)
			return;

		this.instance.setViewport(
			0,
			0,
			this._sizesService.width,
			this._sizesService.height
		);
		this.instance.render(
			this._worldService.scene,
			this._cameraService.instance
		);
	}
}
