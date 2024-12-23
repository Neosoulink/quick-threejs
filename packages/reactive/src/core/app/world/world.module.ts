import { inject, singleton } from "tsyringe";
import { Scene } from "three";

import { WorldService } from "./world.service";

import { Module } from "../../../common/interfaces/module.interface";

@singleton()
export class WorldModule implements Module {
	constructor(@inject(WorldService) private readonly _service: WorldService) {}

	public init() {}

	public dispose() {}

	public scene(value?: Scene) {
		if (value instanceof Scene) this._service.scene = value;
		return this._service.scene;
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this._service.enabled = value;
		return this._service.enabled;
	}
}
