import { singleton } from "tsyringe";
import {
	fromEvent,
	merge,
	Observable,
	Subject,
	distinctUntilChanged,
	map,
	tap
} from "rxjs";
import { Vector2 } from "three";

import { EventStatus, KeyEvent } from "../common/interfaces/event.interface";

@singleton()
export class MainController {
	private readonly resizeObject: Vector2 = new Vector2();
	private readonly mouseMoveObject: Vector2 = new Vector2();
	private readonly mouseMoveSubject = new Subject<Vector2>();
	private readonly pointerLockSubject = new Subject<EventStatus>();

	public readonly resize$: Observable<Vector2>;
	public readonly key$: Observable<KeyEvent>;
	public readonly mouseMove$ = this.mouseMoveSubject.pipe();
	public readonly pointerLock$ = this.pointerLockSubject.pipe();

	constructor() {
		this.resize$ = fromEvent(window, "resize").pipe(
			tap(() => {
				this.resizeObject.x = window.innerWidth;
				this.resizeObject.y = window.innerHeight;
			}),
			map(() => this.resizeObject)
		);

		this.key$ = merge(
			fromEvent<KeyboardEvent>(window, "keydown").pipe(
				map((event) => ({
					status: EventStatus.ON,
					key: event.code
				}))
			),
			fromEvent<KeyboardEvent>(window, "keyup").pipe(
				map((event) => ({
					status: EventStatus.OFF,
					key: event.code
				}))
			),
			fromEvent<MouseEvent>(window, "mousedown").pipe(
				map((event) => ({
					status: EventStatus.ON,
					key: event.button.toString()
				}))
			),
			fromEvent<MouseEvent>(window, "mouseup").pipe(
				map((event) => ({
					status: EventStatus.OFF,
					key: event.button.toString()
				}))
			)
		).pipe(
			distinctUntilChanged((prev, curr) => {
				return prev.key === curr.key && prev.status === curr.status;
			})
		);
	}

	init(canvas: HTMLCanvasElement): void {
		fromEvent<MouseEvent>(canvas, "mousemove")
			.pipe(
				tap((event) => {
					this.mouseMoveObject.x = event.movementX;
					this.mouseMoveObject.y = event.movementY;
				}),
				map(() => this.mouseMoveObject)
			)
			.subscribe((object) => this.mouseMoveSubject.next(object));

		fromEvent<Event>(document, "pointerlockchange")
			.pipe(
				map(
					() =>
						document.pointerLockElement === canvas ||
						(document as Document & { mozPointerLockElement?: HTMLElement })
							.mozPointerLockElement === canvas
				),
				map((locked) => (locked ? EventStatus.ON : EventStatus.OFF))
			)
			.subscribe((status) => this.pointerLockSubject.next(status));
	}
}
