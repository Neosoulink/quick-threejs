import type { Observable, Subject } from "rxjs";

import type { PROXY_EVENT_LISTENERS } from "../constants/event.constants";

/** @description Utility type to exclude properties with the type `never` */
export type NonNever<T extends object> = {
	[K in keyof T as T[K] extends never ? never : K]: T[K];
};

/** @description Utility type to extract only **methods** of an `object` */
export type Methods<T extends object> = NonNever<{
	[K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
}>;

/** @description Utility type to extract only **properties** of an `object` */
export type Properties<T extends object> = NonNever<{
	[K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K];
}>;

/** @description  */
export type ProxyEventListenerKeys = (typeof PROXY_EVENT_LISTENERS)[number];

export type ProxyEventHandlersImplementation = {
	[x in ProxyEventListenerKeys]: (event: Event) => void;
};

export type ProxyEventSubjectsImplementation = {
	[x in `${ProxyEventListenerKeys}$$`]: Subject<Event>;
};

export type ProxyEventObservablesImplementation = {
	[x in `${ProxyEventListenerKeys}$`]: Observable<Event>;
};
