import { inject, singleton } from "tsyringe";
import { filter, Observable, Subject } from "rxjs";
import { Vector2 } from "three";

import { CoreController } from "../core.controller";
import { SizesComponent } from "./sizes.component";

@singleton()
export class SizesController {
	private readonly widthSubject = new Subject<number>();
	private readonly heightSubject = new Subject<number>();
	private readonly aspectSubject = new Subject<number>();
	private readonly pixelRatioSubject = new Subject<number>();
	private readonly watchResizesSubject = new Subject<boolean>();
	private readonly frustrumSubject = new Subject<number>();

	public readonly resize$: Observable<Vector2>;
	public readonly width$ = this.widthSubject.pipe();
	public readonly height$ = this.heightSubject.pipe();
	public readonly aspect$ = this.aspectSubject.pipe();
	public readonly pixelRatio$ = this.pixelRatioSubject.pipe();
	public readonly watchResizes$ = this.watchResizesSubject.pipe();
	public readonly frustrum$ = this.frustrumSubject.pipe();

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
		this.widthSubject.next(this.component.width);
	}

	public setHeight(value = 0) {
		this.component.height = Number(value);
		this.heightSubject.next(this.component.height);
	}

	public setAspect(value = 0) {
		this.component.aspect = Number(value);
		this.aspectSubject.next(this.component.aspect);
	}

	public setPixelRatio(value = 0) {
		this.component.pixelRatio = Number(value);
		this.pixelRatioSubject.next(this.component.pixelRatio);
	}

	public setWatchResizes(value = true) {
		this.component.watchResizes = !!value;
		this.watchResizesSubject.next(this.component.watchResizes);
	}

	public setFrustrum(value = 5) {
		this.component.frustrum = Number(value);
		this.frustrumSubject.next(this.component.frustrum);
	}
}
