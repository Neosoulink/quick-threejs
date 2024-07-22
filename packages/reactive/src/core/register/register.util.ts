import { container } from "tsyringe";
import { isBoolean, isFunction, isUndefined } from "@quick-threejs/utils";

import { DefaultCameraType } from "../../common/enums/camera.enum";
import { RegisterPropsModel } from "../../common/models/register-props.model";

import { RegisterModule } from "./register.module";

/**
 * @description Register the main logic of the app.
 *
 * @remark __🏁 Should be called on your main thread. Separated from the worker thread implementation__
 *
 * @param props Quick-three register properties.
 */
export const register = (props: RegisterPropsModel) => {
	if (
		typeof props?.location !== "string" &&
		!((props?.location as any) instanceof URL)
	)
		throw new Error(
			"Invalid register props detected. location path is required"
		);

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

	container.register(RegisterPropsModel, { useValue: props });
	return container.resolve<RegisterModule>(RegisterModule);
};
