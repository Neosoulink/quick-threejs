import "reflect-metadata";

import { container } from "tsyringe";

import { AppModule } from "./app/app.module";
import { RegisterDto } from "./common/dtos/register.dto";

/**
 * @description Register the main logic of the app.
 *
 * @important __🏁 Should be called on your main thread. Separated from the core implementation__
 *
 * @param props Quick-three register properties.
 */
export const register = (props: RegisterDto) => {
	if (!props?.location)
		throw new Error(
			"Invalid register props detected. location path is required"
		);

	const registerProps = new RegisterDto();
	registerProps.canvas = props.canvas;
	registerProps.location = props.location;
	registerProps.useDefaultCamera =
		props.useDefaultCamera === undefined ? true : props.useDefaultCamera;
	registerProps.withMiniCamera = !!props.withMiniCamera;
	registerProps.startTimer =
		props.startTimer === undefined ? true : props.startTimer;
	registerProps.fullScreen =
		props.fullScreen === undefined ? true : props.fullScreen;

	container.register(RegisterDto, { useValue: registerProps });
	return container.resolve(AppModule);
};

if (process.env.NODE_ENV === "development") {
	const canvas = document.createElement("canvas");

	register({
		canvas,
		location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
	});
}
