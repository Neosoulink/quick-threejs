import { Scene } from "three";
import { singleton } from "tsyringe";

@singleton()
export class WorldComponent {
	public scene = new Scene();

	public enabled = true;
}
