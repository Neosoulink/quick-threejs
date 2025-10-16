import { Clock } from "three";
import { Lifecycle, scoped } from "tsyringe";

@scoped(Lifecycle.ContainerScoped)
export class TimerService {
	public readonly fps = 60;
	public readonly frame = 1000 / this.fps;
	public readonly clock = new Clock();
	public readonly initialTime = Date.now();

	public elapsed = 0;
	public previousDelta = 0;
	public delta = 0;
	public deltaRatio = 0;
	public enabled = false;

	public step() {
		this.elapsed = this.clock.getElapsedTime();
		this.delta = this.elapsed - this.previousDelta;
		this.previousDelta = this.elapsed;
		this.deltaRatio = this.delta / this.frame;
	}
}
