import { Scene } from "three";
import { singleton } from "tsyringe";

@singleton()
export class WorldComponent {
	private readonly _scene = new Scene();

	public get scene() {
		return this._scene;
	}
}
