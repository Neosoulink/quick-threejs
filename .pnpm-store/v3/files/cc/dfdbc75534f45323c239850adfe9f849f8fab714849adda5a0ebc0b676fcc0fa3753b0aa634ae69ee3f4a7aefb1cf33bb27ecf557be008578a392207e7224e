import { Snapshot, BuildContext, Namespace } from '../model';
import { IoCBindConfig, IoCBindValueConfig } from './container-binding-config';
/**
 * Internal implementation of IoC Container.
 */
export declare class IoCContainer {
    static bind(source: Function, readOnly?: boolean): IoCBindConfig;
    static bindName(name: string, readOnly?: boolean): IoCBindValueConfig;
    static get(source: Function, context: BuildContext): any;
    static getValue(name: string): any;
    static getType(source: Function): Function;
    static namespace(name: string): Namespace;
    static selectedNamespace(): string;
    static injectProperty(target: Function, key: string, propertyType: Function): void;
    static injectValueProperty(target: Function, key: string, name: string): void;
    /**
     * Create a temporary namespace. Useful for testing.
     */
    static snapshot(): Snapshot;
    private static namespaces;
    private static snapshotsCount;
}
