import { inject, singleton } from "tsyringe";
import { filter, Observable, Subject } from "rxjs";
import { Vector2Like } from "three";

import { CoreController } from "../core.controller";
import { SizesComponent } from "./sizes.component";

@singleton()
export class SizesController {
	private readonly width$$ = new Subject<number>();
	private readonly height$$ = new Subject<number>();
	private readonly aspect$$ = new Subject<number>();
	private readonly pixelRatio$$ = new Subject<number>();
	private readonly enabled$$ = new Subject<boolean>();
	private readonly frustrum$$ = new Subject<number>();

	public readonly resize$: Observable<Vector2Like>;
	public readonly width$ = this.width$$.pipe();
	public readonly height$ = this.height$$.pipe();
	public readonly aspect$ = this.aspect$$.pipe();
	public readonly pixelRatio$ = this.pixelRatio$$.pipe();
	public readonly enabled$ = this.enabled$$.pipe();
	public readonly frustrum$ = this.frustrum$$.pipe();

	constructor(
		@inject(CoreController) private readonly coreController: CoreController,
		@inject(SizesComponent) private readonly component: SizesComponent
	) {
		this.resize$ = this.coreController.resize$.pipe(
			filter(() => this.component.enabled)
		);
	}

	public setWidth(value = 0) {
		this.width$$.next(value);
	}

	public setHeight(value = 0) {
		this.height$$.next(value);
	}

	public setAspect(value = 0) {
		this.aspect$$.next(value);
	}

	public setPixelRatio(value = 0) {
		this.pixelRatio$$.next(value);
	}

	public setEnabled(value = true) {
		this.enabled$$.next(value);
	}

	public setFrustrum(value = 5) {
		this.frustrum$$.next(value);
	}
}
