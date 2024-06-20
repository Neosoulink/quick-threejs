import { singleton } from "tsyringe";
import { Clock } from "three";

import { EventStatus } from "../../common/enums/event.enum";

@singleton()
export class TimerComponent {
	public readonly clock = new Clock();
	public readonly frame = 1000 / 60;

	public enabled: EventStatus = EventStatus.OFF;
	public delta = 0;
	public deltaRatio = 0;
}
