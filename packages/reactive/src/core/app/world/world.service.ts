import { Scene } from "three";
import { singleton } from "tsyringe";

@singleton()
export class WorldService {
	public scene = new Scene();
	public enabled = true;
}
