import { singleton } from "tsyringe";

import { Subject } from "rxjs";
import { Vector2 } from "three";

import { EventStatus, KeyEvent } from "../common/interfaces/event.interface";

@singleton()
export class CoreController {
	private readonly resizeObject = new Vector2();
	private readonly mouseMoveObject = new Vector2();
	private readonly resizeSubject = new Subject<Vector2>();
	private readonly mouseMoveSubject = new Subject<Vector2>();
	private readonly keySubject = new Subject<KeyEvent>();
	private readonly pointerLockSubject = new Subject<EventStatus>();

	readonly resize$ = this.resizeSubject.pipe();
	readonly mouseMove$ = this.mouseMoveSubject.pipe();
	readonly key$ = this.keySubject.pipe();
	readonly pointerLock$ = this.pointerLockSubject.pipe();

	resize(x: number, y: number): void {
		this.resizeObject.x = x;
		this.resizeObject.y = y;
		this.resizeSubject.next(this.resizeObject);
	}

	setPointerLock(status: EventStatus): void {
		this.pointerLockSubject.next(status);
	}

	move(x: number, y: number): void {
		this.mouseMoveObject.x = x;
		this.mouseMoveObject.y = y;
		this.mouseMoveSubject.next(this.mouseMoveObject);
	}

	keyEvent(keyEvent: KeyEvent): void {
		this.keySubject.next(keyEvent);
	}
}
