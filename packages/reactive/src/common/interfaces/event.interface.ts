export enum EventStatus {
	OFF,
	ON
}

export interface KeyEvent {
	status: EventStatus;
	key: string;
}
