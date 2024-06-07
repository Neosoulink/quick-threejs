import { inject, singleton } from "tsyringe";

import { GuiComponent } from "./gui.component";
import { GuiController } from "./gui.controller";
import { Module } from "../../common/interfaces/module.interface";

@singleton()
export class GuiModule implements Module {
	constructor(
		@inject(GuiComponent) private readonly component: GuiComponent,
		@inject(GuiController) private readonly controller: GuiController
	) {
		this.controller.pointerLock$.subscribe((status) => {
			if (status) this.component.hide();
			else this.component.show();
		});
	}

	public init(canvas: HTMLCanvasElement): void {
		this.component.init(canvas);
		this.controller.init();
	}
}
