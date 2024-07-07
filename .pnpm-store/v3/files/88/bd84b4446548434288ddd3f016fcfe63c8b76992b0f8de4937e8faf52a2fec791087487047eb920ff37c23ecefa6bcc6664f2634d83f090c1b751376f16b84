import { InstanceFactory, ValueFactory } from './container-types';
import { BuildContext } from '../model';
/**
 * Utility class to handle injection behavior on class decorations.
 */
export declare class InjectorHandler {
    static constructorNameRegEx: RegExp;
    private static instantiationsBlocked;
    static instrumentConstructor(source: Function): any;
    static blockInstantiation(blocked: boolean): void;
    static unblockInstantiation(): boolean;
    static getConstructorFromType(target: Function): FunctionConstructor;
    static checkType(source: Object): void;
    static checkName(source: string): void;
    static injectContext(target: any, context: BuildContext): void;
    static removeContext(target: any): void;
    static injectProperty(target: Function, key: string, propertyType: Function, instanceFactory: InstanceFactory): void;
    static injectValueProperty(target: Function, key: string, name: string, valueFactory: ValueFactory): void;
    private static hasNamedConstructor;
    private static assertInstantiable;
}
