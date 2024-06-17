import { singleton } from "tsyringe";

import { OffscreenCanvasWithStyle } from "../../common/interfaces/canvas.interface";

@singleton()
export class SizesComponent {
	public width = 0;
	public height = 0;
	public aspect = 0;
	public pixelRatio = 0;
	public frustrum = 5;
	public enabled = true;

	public init(canvas: OffscreenCanvasWithStyle, enabled?: boolean) {
		this.height = Number(canvas.height ?? this.height);
		this.width = Number(canvas.width ?? this.width);
		this.aspect = this.width / this.height;
		this.enabled = enabled === undefined ? true : !!enabled;
	}
}
