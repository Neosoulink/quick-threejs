import { Lifecycle, scoped } from "tsyringe";

import { OffscreenCanvasWithStyle } from "../../../common/interfaces/canvas.interface";

@scoped(Lifecycle.ContainerScoped)
export class SizesService {
	public width = 0;
	public height = 0;
	public aspect = 0;
	public pixelRatio = 0;
	public frustrum = 5;
	public enabled = true;

	public init(
		canvas: OffscreenCanvasWithStyle | HTMLCanvasElement,
		enabled?: boolean
	) {
		this.height = Number(
			(canvas as OffscreenCanvasWithStyle).height ?? this.height
		);
		this.width = Number(
			(canvas as OffscreenCanvasWithStyle).width ?? this.width
		);
		this.aspect = this.width / this.height;
		this.enabled = enabled === undefined ? true : !!enabled;
	}
}
