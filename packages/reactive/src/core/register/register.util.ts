import { container as parentContainer } from "tsyringe";
import { isBoolean, isFunction, isUndefined } from "@quick-threejs/utils";

import {
	CONTAINER_TOKEN,
	RegisterPropsBlueprint,
	DefaultCameraType,
	ContainerizedApp
} from "../../common";
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
	if (
		typeof props?.location !== "string" &&
		!((props?.location as any) instanceof URL)
	)
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
	props.withMiniCamera =
		isUndefined(props.withMiniCamera) || !isBoolean(props.withMiniCamera)
			? false
			: props.withMiniCamera;
	props.startTimer =
		isUndefined(props.startTimer) || !isBoolean(props.startTimer)
			? true
			: props.startTimer;
	props.fullScreen =
		isUndefined(props.fullScreen) || !isBoolean(props.fullScreen)
			? true
			: props.fullScreen;
	props.onReady = !isFunction(props.onReady) ? undefined : props.onReady;

	container.register(CONTAINER_TOKEN, { useValue: container });
	container.register(RegisterPropsBlueprint, { useValue: props });

	const module = container.resolve<RegisterModule>(RegisterModule);

	return {
		container,
		module
	};
};
