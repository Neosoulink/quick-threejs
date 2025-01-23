import { inject, Lifecycle, scoped } from "tsyringe";
import { WorldService } from "./world.service";
import { share, Subject } from "rxjs";

@scoped(Lifecycle.ContainerScoped)
export class WorldController {
	private readonly _beforeRender$$ = new Subject<{}>();
	private readonly _afterRender$$ = new Subject<{}>();

	public readonly beforeRender$ = this._beforeRender$$.pipe(share());
	public readonly afterRender$ = this._afterRender$$.pipe(share());

	constructor(
		@inject(WorldService) private readonly _worldService: WorldService
	) {
		this._worldService.scene.onBeforeRender = () =>
			this._beforeRender$$.next({});
		this._worldService.scene.onAfterRender = () => this._afterRender$$.next({});
	}
}
