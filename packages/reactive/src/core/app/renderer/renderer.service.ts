import {
	Camera,
	CineonToneMapping,
	PCFSoftShadowMap,
	SRGBColorSpace,
	WebGLRenderer
} from "three";
import { inject, Lifecycle, scoped } from "tsyringe";

import type { OffscreenCanvasStb } from "@/common";
import { WorldService } from "../world/world.service";
import { CameraService } from "../camera/camera.service";
import { SizesService } from "../sizes/sizes.service";

@scoped(Lifecycle.ContainerScoped)
export class RendererService {
	public enabled = true;
	public enabledAutoResize = true;
	public instance?: WebGLRenderer;

	constructor(
		@inject(WorldService) private readonly _worldService: WorldService,
		@inject(CameraService) private readonly _cameraService: CameraService,
		@inject(SizesService) private readonly _sizes: SizesService
	) {}

	public init(canvas: OffscreenCanvasStb | HTMLCanvasElement) {
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
		this.instance.setPixelRatio(this._sizes.pixelRatio);
		this.instance.setClearColor(0x000000, 0);
		this.instance.shadowMap.enabled = true;
		this.instance.shadowMap.type = PCFSoftShadowMap;
		this.instance.outputColorSpace = SRGBColorSpace;
		this.instance.toneMapping = CineonToneMapping;
		this.instance.toneMappingExposure = 1.75;
	}

	public handleAutoResize() {
		if (!this.enabledAutoResize || !(this.instance instanceof WebGLRenderer))
			return;

		const { width, height } = this._sizes.getViewPortSizes();

		this.instance?.setSize(width, height);
	}

	public render() {
		if (
			!(this._cameraService.instance instanceof Camera) ||
			!(this.instance instanceof WebGLRenderer)
		)
			return;

		const width = this._sizes.fullscreen
			? this._sizes.windowWidth
			: this._sizes.hasCanvasWrapper
				? this._sizes.wrapperWidth
				: this._sizes.width;
		const height = this._sizes.fullscreen
			? this._sizes.windowHeight
			: this._sizes.hasCanvasWrapper
				? this._sizes.wrapperHeight
				: this._sizes.height;

		this.instance.setViewport(0, 0, width, height);
		this.instance.render(
			this._worldService.scene,
			this._cameraService.instance
		);
	}
}
