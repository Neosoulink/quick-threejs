import { Scope, ObjectFactory, Config, BuildContext, ValueConfig } from '../model';
import { InstanceFactory, ValueFactory } from './container-types';
export declare class IoCBindConfig implements Config {
    source: Function;
    targetSource: Function;
    iocFactory: ObjectFactory;
    iocScope: Scope;
    decoratedConstructor: FunctionConstructor;
    paramTypes: Array<any>;
    namespace: string;
    private instanceFactory;
    private valueFactory;
    constructor(source: Function, instanceFactory: InstanceFactory, valueFactory: ValueFactory);
    to(target: FunctionConstructor): this;
    factory(factory: ObjectFactory): this;
    scope(scope: Scope): this;
    withParams(...paramTypes: Array<any>): this;
    instrumentConstructor(): this;
    getInstance(context: BuildContext): any;
    clone(): IoCBindConfig;
    private getParameters;
}
export declare class IoCBindValueConfig implements ValueConfig {
    name: string;
    path: string;
    namespace: string;
    private value;
    constructor(name: string);
    to(value: any): ValueConfig;
    getValue(): any;
    clone(): IoCBindValueConfig;
}
export declare class PropertyPath {
    readonly name: string;
    readonly path?: string;
    private constructor();
    static parse(value: string): PropertyPath;
}
