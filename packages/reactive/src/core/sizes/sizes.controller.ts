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
	private readonly watchResizes$$ = new Subject<boolean>();
	private readonly frustrum$$ = new Subject<number>();

	public readonly resize$: Observable<Vector2Like>;
	public readonly width$ = this.width$$.pipe();
	public readonly height$ = this.height$$.pipe();
	public readonly aspect$ = this.aspect$$.pipe();
	public readonly pixelRatio$ = this.pixelRatio$$.pipe();
	public readonly watchResizes$ = this.watchResizes$$.pipe();
	public readonly frustrum$ = this.frustrum$$.pipe();

	constructor(
		@inject(CoreController) private readonly coreController: CoreController,
		@inject(SizesComponent) private readonly component: SizesComponent
	) {
		this.resize$ = this.coreController.resize$.pipe(
			filter(() => this.component.watchResizes)
		);
	}

	public setWidth(value = 0) {
		this.component.width = Number(value);
		this.width$$.next(this.component.width);
	}

	public setHeight(value = 0) {
		this.component.height = Number(value);
		this.height$$.next(this.component.height);
	}

	public setAspect(value = 0) {
		this.component.aspect = Number(value);
		this.aspect$$.next(this.component.aspect);
	}

	public setPixelRatio(value = 0) {
		this.component.pixelRatio = Number(value);
		this.pixelRatio$$.next(this.component.pixelRatio);
	}

	public setWatchResizes(value = true) {
		this.component.watchResizes = !!value;
		this.watchResizes$$.next(this.component.watchResizes);
	}

	public setFrustrum(value = 5) {
		this.component.frustrum = Number(value);
		this.frustrum$$.next(this.component.frustrum);
	}
}
