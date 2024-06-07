import { singleton } from "tsyringe";
import { Vector2 } from "three";

@singleton()
export class CoreComponent {
	public readonly resizeObject = new Vector2();
	public readonly moveObject = new Vector2();

	public resize(x: number, y: number): void {
		this.resizeObject.x = x;
		this.resizeObject.y = y;
	}
	public move(x: number, y: number): void {
		this.moveObject.x = x;
		this.moveObject.y = y;
	}
}
