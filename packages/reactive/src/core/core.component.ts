import { singleton } from "tsyringe";

@singleton()
export class CoreComponent {
	public initialized = false;
}
