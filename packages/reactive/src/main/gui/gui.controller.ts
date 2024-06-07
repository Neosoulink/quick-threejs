import { inject, singleton } from "tsyringe";
import { fromEvent, Observable, Subject } from "rxjs";

import { MainController } from "../main.controller";
import { EventStatus } from "../../common/interfaces/event.interface";
import { GuiComponent } from "./gui.component";

@singleton()
export class GuiController {
	private readonly mousedownSubject = new Subject<MouseEvent>();

	public readonly pointerLock$: Observable<EventStatus>;
	public readonly mousedown$ = this.mousedownSubject.pipe();

	constructor(
		@inject(MainController)
		private readonly coreThreadController: MainController,
		@inject(GuiComponent) private readonly component: GuiComponent
	) {
		this.pointerLock$ = this.coreThreadController.pointerLock$;
	}

	public init() {
		fromEvent<MouseEvent>(this.component.layer, "mousedown").subscribe((e) => {
			this.mousedownSubject.next(e);
			this.component.canvas?.requestPointerLock();
		});
	}
}
