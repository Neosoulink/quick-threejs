import { Scene } from "three";
import { Lifecycle, scoped } from "tsyringe";

@scoped(Lifecycle.ContainerScoped)
export class WorldService {
	public scene = new Scene();
	public enabled = true;
}
