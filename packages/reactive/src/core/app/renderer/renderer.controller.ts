import { inject, singleton } from "tsyringe";
import { filter, Observable } from "rxjs";

import type { ProxyEvent } from "../../../common/interfaces/proxy-event.interface";
import { SizesController } from "../sizes/sizes.controller";
import { TimerController } from "../timer/timer.controller";
import { RendererService } from "./renderer.service";

@singleton()
export class RendererController {
	public readonly step$: TimerController["step$"];
	public readonly resize$: Observable<UIEvent & ProxyEvent>;

	constructor(
		@inject(RendererService)
		private readonly _service: RendererService,
		@inject(TimerController) private readonly _timerController: TimerController,
		@inject(SizesController) private readonly _sizesController: SizesController
	) {
		this.step$ = this._timerController.step$.pipe(
			filter(() => this._service.enabled)
		);

		this.resize$ = this._sizesController.resize$.pipe(
			filter(() => this._service.enabled)
		);
	}
}
