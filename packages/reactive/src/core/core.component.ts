import { inject, singleton } from "tsyringe";
import { Scene } from "three";

import { TimerComponent } from "./timer/timer.component";
import { WorldComponent } from "./world/world.component";
import { SizesComponent } from "./sizes/sizes.component";
import { RendererComponent } from "./renderer/renderer.component";
import { CameraComponent } from "./camera/camera.component";

@singleton()
export class CoreComponent {
	constructor(
		@inject(TimerComponent) private readonly timerComponent: TimerComponent,
		@inject(WorldComponent) private readonly worldComponent: WorldComponent,
		@inject(SizesComponent) private readonly sizesComponent: SizesComponent,
		@inject(RendererComponent)
		private readonly rendererComponent: RendererComponent,
		@inject(CameraComponent)
		private readonly cameraComponent: CameraComponent
	) {}

	public get scene() {
		return this.worldComponent.scene;
	}

	public set scene(newScene: Scene) {
		this.worldComponent.scene.copy(newScene);
	}
}
