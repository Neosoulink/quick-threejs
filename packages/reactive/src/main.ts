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

	props.useDefaultCamera =
		props.useDefaultCamera === undefined ? true : props.useDefaultCamera;
	props.withMiniCamera = !!props.withMiniCamera;
	props.startTimer = props.startTimer === undefined ? true : props.startTimer;
	props.fullScreen = props.fullScreen === undefined ? true : props.fullScreen;

	container.register(RegisterDto, { useValue: props });
	return container.resolve(AppModule);
};

if (process.env.NODE_ENV === "development") {
	const app = register({
		location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
		enableDebug: true,
		axesSizes: 5,
		gridSizes: 10,
		withMiniCamera: true
	});

	app.lifecycle$().subscribe(() => {
		app
			.gui()
			?.add({ props: 0 }, "props")
			.onChange((value) => {
				app.core().worker?.postMessage({ type: "gui-event", value });
			});
	});
}
