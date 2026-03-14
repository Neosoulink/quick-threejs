import type { ProxyReceiver } from "@quick-threejs/utils";
import { Timer } from "three";
import { Lifecycle, scoped } from "tsyringe";

@scoped(Lifecycle.ContainerScoped)
export class TimerService {
	public readonly fps = 60;
	public readonly frame = 1000 / this.fps;
	public readonly timer = new Timer();
	public readonly initialTime = Date.now();

	public elapsed = 0;
	public previousDelta = 0;
	public delta = 0;
	public deltaRatio = 0;
	public enabled = false;

	init(proxy: ProxyReceiver<Record<string, unknown>>) {
		this.timer.connect(proxy as unknown as Document);
	}

	public step() {
		this.timer.update();

		this.elapsed = this.timer.getElapsed();
		this.delta = this.elapsed - this.previousDelta;
		this.previousDelta = this.elapsed;
		this.deltaRatio = this.delta / this.frame;
	}
}
