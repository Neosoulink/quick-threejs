import { inject, singleton } from "tsyringe";

import { Subject } from "rxjs";
import { Vector2 } from "three";

import { EventStatus, KeyEvent } from "../common/interfaces/event.interface";
import { CoreComponent } from "./core.component";

@singleton()
export class CoreController {
	private readonly resizeSubject = new Subject<Vector2>();
	private readonly mouseMoveSubject = new Subject<Vector2>();
	private readonly keySubject = new Subject<KeyEvent>();
	private readonly pointerLockSubject = new Subject<EventStatus>();

	readonly resize$ = this.resizeSubject.pipe();
	readonly mouseMove$ = this.mouseMoveSubject.pipe();
	readonly key$ = this.keySubject.pipe();
	readonly pointerLock$ = this.pointerLockSubject.pipe();

	constructor(
		@inject(CoreComponent) private readonly coreComponent: CoreComponent
	) {}

	public resize(x: number, y: number): void {
		this.coreComponent.resize(x, y);
		this.resizeSubject.next(this.coreComponent.resizeObject);
	}

	public setPointerLock(status: EventStatus): void {
		this.pointerLockSubject.next(status);
	}

	public move(x: number, y: number): void {
		this.coreComponent.move(x, y);
		this.mouseMoveSubject.next(this.coreComponent.moveObject);
	}

	public keyEvent(keyEvent: KeyEvent): void {
		this.keySubject.next(keyEvent);
	}
}
