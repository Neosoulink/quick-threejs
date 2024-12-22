import { container as parentContainer } from "tsyringe";
import { isBoolean, isFunction, isUndefined } from "@quick-threejs/utils";

import { DefaultCameraType } from "../../common/enums";
import type { ContainerizedApp } from "../../common/interfaces";
import { RegisterPropsModel } from "../../common/models";
import { CONTAINER_TOKEN } from "../../common/tokens";
import { RegisterModule } from "./register.module";

/**
 * @description
 *
 * Register the main logic of the app.
 *
 * **🏁  This helper should be called from the main thread**
 *
 * @param props {@link RegisterPropsModel}.
 */
export const register = (
	props: RegisterPropsModel
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
	container.register(RegisterPropsModel, { useValue: props });

	const module = container.resolve<RegisterModule>(RegisterModule);
	module.initialized = true;

	return {
		container,
		module
	};
};
