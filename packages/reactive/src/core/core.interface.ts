export interface CoreModuleMessageEvent
	extends MessageEvent<{
		canvas?: OffscreenCanvas;
		startTimer?: boolean;
		useDefaultCamera?: boolean;
		withMiniCamera?: boolean;
	}> {}
