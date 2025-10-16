import { OffscreenCanvasStb } from "main";
import { RegisterPropsBlueprint } from "../blueprints/props.blueprint";

export interface AppModulePropsMessageEvent
	extends MessageEvent<
		Omit<
			RegisterPropsBlueprint,
			"canvas" | "location" | "loaderDataSources"
		> & {
			/**
			 * The canvas element based on.
			 *
			 * @default `undefined`
			 */
			canvas?: OffscreenCanvasStb | HTMLCanvasElement;
		}
	> {}
