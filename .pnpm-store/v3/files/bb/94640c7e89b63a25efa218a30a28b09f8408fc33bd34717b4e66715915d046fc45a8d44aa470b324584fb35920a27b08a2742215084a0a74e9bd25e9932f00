import { Scope, ObjectFactory, BuildContext } from './model';
/**
 * Default [[Scope]] that always create a new instace for any dependency resolution request
 */
export declare class LocalScope extends Scope {
    resolve(factory: ObjectFactory, _source: Function, context: BuildContext): Object;
}
/**
 * Scope that create only a single instace to handle all dependency resolution requests.
 */
export declare class SingletonScope extends Scope {
    private static instances;
    resolve(factory: ObjectFactory, source: Function, context: BuildContext): any;
    reset(source: Function): void;
    init(source: Function): void;
    finish(source: Function): void;
}
export declare class RequestScope extends Scope {
    resolve(factory: ObjectFactory, source: Function, context: BuildContext): any;
    private ensureContext;
}
