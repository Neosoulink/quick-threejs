import { inject, singleton } from "tsyringe";
import { Observable, Subject } from "rxjs";
import { Vector2 } from "three";

import { TimerController } from "../timer/timer.controller";
import { CoreController } from "../core.controller";

@singleton()
export class RendererController {
	private readonly initSubject = new Subject<void>();

	public readonly step$: Observable<number>;
	public readonly resize$: Observable<Vector2>;
	public readonly init$ = this.initSubject.pipe();

	constructor(
		@inject(CoreController) private readonly coreController: CoreController,
		@inject(TimerController) private readonly timerController: TimerController
	) {
		this.step$ = this.timerController.step$;
		this.resize$ = this.coreController.resize$;
	}

	public init() {
		this.initSubject.next();
	}
}
