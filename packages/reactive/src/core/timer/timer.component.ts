import { singleton } from "tsyringe";
import { Clock } from "three";

import { EventStatus } from "../../common/enums/event.enum";

@singleton()
export class TimerComponent {
	private readonly _clock = new Clock();

	private _enabled: EventStatus = EventStatus.OFF;
	private _delta = 0;
	private _deltaRatio = 0;

	public get clock() {
		return this._clock;
	}

	public get frame() {
		return 1000 / 60;
	}

	public get enabled() {
		return this._enabled;
	}

	public get delta() {
		return this._delta;
	}

	public get deltaRatio() {
		return this._deltaRatio;
	}

	public set enabled(status: EventStatus) {
		this._enabled = status in EventStatus ? status : EventStatus.OFF;
	}

	public set delta(val: number) {
		this._delta = Number(val);
	}

	public set deltaRatio(val: number) {
		this._deltaRatio = Number(val);
	}
}
