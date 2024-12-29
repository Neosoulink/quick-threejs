import type { Observable, Subject } from "rxjs";

import type { PROXY_EVENT_LISTENERS } from "../constants/event.constants";

export interface ProxyEvent {
	width: number;
	height: number;
	windowWidth: number;
	windowHeight: number;
}

/** @description  */
export type ProxyEventListenerKeys = (typeof PROXY_EVENT_LISTENERS)[number];

export type ProxyEventHandlersImplementation = {
	[x in ProxyEventListenerKeys]: (event: any) => void;
};

export type ProxyEventSubjectsImplementation = {
	[x in `${ProxyEventListenerKeys}$$`]: Subject<any>;
};

export type ProxyEventObservablesImplementation = {
	[x in `${ProxyEventListenerKeys}$`]: Observable<any>;
};
