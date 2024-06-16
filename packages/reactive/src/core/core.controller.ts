import { inject, singleton } from "tsyringe";

import { Subject } from "rxjs";
import { Vector2 } from "three";

import { EventStatus, KeyEvent } from "../common/interfaces/event.interface";
import { CoreComponent } from "./core.component";

@singleton()
export class CoreController {
	private readonly lifecycle$$ = new Subject();
	private readonly resize$$ = new Subject<Vector2>();
	private readonly mouseMoveSubject = new Subject<Vector2>();
	private readonly keySubject = new Subject<KeyEvent>();
	private readonly pointerLockSubject = new Subject<EventStatus>();

	constructor(
		@inject(CoreComponent) private readonly coreComponent: CoreComponent
	) {}

	public get lifecycle$() {
		return this.lifecycle$$.pipe();
	}

	public get resize$() {
		return this.resize$$.pipe();
	}

	public get mouseMove$() {
		return this.mouseMoveSubject.pipe();
	}

	public get key$() {
		return this.keySubject.pipe();
	}

	public get pointerLock$() {
		return this.pointerLockSubject.pipe();
	}

	public resize(x: number, y: number): void {
		this.coreComponent.resize(x, y);
		this.resize$$.next(this.coreComponent.resizeObject);
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
