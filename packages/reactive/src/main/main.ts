import { Container, InjectValue, Singleton } from "typescript-ioc";
import { MainDto } from "./dto/main.dto";

@Singleton
class Main {
	private canvas!: HTMLCanvasElement;

	constructor(@InjectValue(MainDto.name) private readonly props: MainDto) {
		this.initCanvas();
	}

	private initCanvas(): void {
		try {
			this.canvas = document.createElement("canvas");

			if (this.props.canvas instanceof HTMLCanvasElement)
				this.canvas = this.props.canvas;

			if (typeof this.props.canvas === "string") {
				const canvas_ = document.querySelector(this.props.canvas as string);

				if (canvas_ instanceof HTMLCanvasElement) this.canvas = canvas_;
			}

			if (!this.canvas.parentElement) document.body.appendChild(this.canvas);
		} catch (err: any) {
			console.error(
				`🛑 Unable to initialize the canvas:\n${err?.message ?? "Something went wrong"}`
			);
		}
	}
}

export const QuickThree = (props?: MainDto) => {
	const mainProps = new MainDto();
	mainProps.canvas = props?.canvas;

	Container.bindName(MainDto.name).to(mainProps);
	Container.get(Main);
};

if (process.env.NODE_ENV !== "production") QuickThree();
