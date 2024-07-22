import { singleton } from "tsyringe";
import { Clock } from "three";

@singleton()
export class TimerComponent {
	public readonly clock = new Clock();
	public readonly frame = 1000 / 60;

	public delta = 0;
	public deltaRatio = 0;
	public enabled = false;
}
