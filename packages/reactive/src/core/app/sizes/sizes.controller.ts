import { inject, Lifecycle, scoped } from "tsyringe";
import { filter, Observable } from "rxjs";

import { ProxyEvent } from "common";
import { AppController } from "../app.controller";
import { SizesService } from "./sizes.service";

@scoped(Lifecycle.ContainerScoped)
export class SizesController {
	public readonly resize$: Observable<UIEvent & ProxyEvent>;

	constructor(
		@inject(AppController) private readonly _appController: AppController,
		@inject(SizesService) private readonly _service: SizesService
	) {
		this.resize$ = this._appController.resize$$.pipe(
			filter(() => this._service.enabled)
		);
	}
}
