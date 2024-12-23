import { singleton } from "tsyringe";

@singleton()
export class TimerService {
	public readonly frame = 1000 / 60;
	public readonly initialTime = Date.now();

	public currentTime = 0;
	public deltaTime = 0;
	public deltaRatio = 0;
	public elapsedTime = 0;
	public enabled = false;

	public step() {
		const now = Date.now();

		this.deltaTime = now - this.currentTime;
		this.currentTime = now;
		this.elapsedTime = now - this.initialTime;
		this.deltaRatio = this.deltaTime / this.frame;
	}
}
