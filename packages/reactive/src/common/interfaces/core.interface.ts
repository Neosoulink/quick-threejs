import { OffscreenCanvasStb } from "main";
import { RegisterPropsBlueprint } from "../blueprints/props.blueprint";

export interface AppModulePropsMessageEvent
	extends MessageEvent<
		Omit<
			RegisterPropsBlueprint,
			"canvas" | "canvasWrapper" | "location" | "loaderDataSources"
		> & {
			/**
			 * The canvas element based on.
			 *
			 * @default `undefined`
			 */
			canvas?: OffscreenCanvasStb | HTMLCanvasElement;

			/**
			 * Whether the canvas has a wrapper element.
			 *
			 * @default `undefined`
			 */
			hasCanvasWrapper?: boolean;

			/**
			 * The app is initialized.
			 *
			 * @default `true`
			 */
			initApp: true;
		}
	> {}
