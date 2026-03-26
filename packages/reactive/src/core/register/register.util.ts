import { container as parentContainer } from "tsyringe";
import {
	isBoolean,
	isFunction,
	isNumber,
	isUndefined
} from "@quick-threejs/utils";

import {
	CONTAINER_TOKEN,
	RegisterPropsBlueprint,
	DefaultCameraType,
	ContainerizedApp
} from "@/common";
import { RegisterModule } from "./register.module";

/**
 * @description
 *
 * Register the main logic of the app.
 *
 * **🏁  This helper should be called from the main thread**
 *
 * @param props {@link RegisterPropsBlueprint}.
 */
export const register = (
	props: RegisterPropsBlueprint
): ContainerizedApp<RegisterModule> => {
	if (!props?.location || !URL.canParse(props.location))
		throw new Error(
			"Invalid register props detected. location path is required"
		);

	const container = parentContainer.createChildContainer();

	props.initOnConstruct =
		isUndefined(props.initOnConstruct) || !isBoolean(props.initOnConstruct)
			? true
			: props.initOnConstruct;
	props.defaultCamera = !(
		props?.defaultCamera && props.defaultCamera in DefaultCameraType
	)
		? DefaultCameraType.PERSPECTIVE
		: props.defaultCamera;
	props.fullScreen =
		isUndefined(props.fullScreen) || !isBoolean(props.fullScreen)
			? true
			: props.fullScreen;
	props.autoRenderResize =
		isUndefined(props.autoRenderResize) || !isBoolean(props.autoRenderResize)
			? true
			: props.autoRenderResize;
	props.startTimer =
		isUndefined(props.startTimer) || !isBoolean(props.startTimer)
			? true
			: props.startTimer;
	props.onReady = !isFunction(props.onReady) ? undefined : props.onReady;

	if (props.debug) {
		props.debug.withMiniCamera =
			isUndefined(props.debug?.withMiniCamera) ||
			!isBoolean(props.debug.withMiniCamera)
				? false
				: props.debug.withMiniCamera;
		props.debug.enableControls =
			isUndefined(props.debug.enableControls) ||
			!isBoolean(props.debug.enableControls)
				? false
				: props.debug.enableControls;
		props.debug.axesSizes =
			isUndefined(props.debug.axesSizes) || !isNumber(props.debug.axesSizes)
				? undefined
				: props.debug.axesSizes;
	}

	container.register(CONTAINER_TOKEN, { useValue: container });
	container.register(RegisterPropsBlueprint, { useValue: props });

	const module = container.resolve<RegisterModule>(RegisterModule);

	return {
		container,
		module
	};
};
