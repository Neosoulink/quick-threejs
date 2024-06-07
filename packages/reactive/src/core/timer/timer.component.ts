import { singleton } from "tsyringe";
import { Subject } from "rxjs";
import { Clock } from "three";

@singleton()
export class TimerComponent {
	private readonly _stepSubject = new Subject<number>();
	private readonly _clock = new Clock();
	private readonly _frame = 1000 / 60;
	private readonly _bindStep: FrameRequestCallback;

	private _delta = 0;
	private _enabled = false;

	public readonly step$ = this._stepSubject.pipe();

	constructor() {
		this._bindStep = this.step.bind(this);
		this.step();
	}

	private step(): void {
		this._delta = this._clock.getDelta() ?? this._frame;

		if (this._enabled) {
			console.log(this._delta);
			const deltaRatio = (this._delta * 1000) / this._frame;
			this._stepSubject.next(deltaRatio);
		}

		requestAnimationFrame(this._bindStep);
	}

	public enable(): void {
		this._enabled = true;
	}

	public disable(): void {
		this._enabled = false;
	}
}
