/**
 * This is a lightweight annotation-based dependency injection container for typescript.
 *
 * Visit the project page on [GitHub] (https://github.com/thiagobustamante/typescript-ioc).
 */
import 'reflect-metadata';
import { Config, ValueConfig, ObjectFactory, Scope, ContainerConfiguration, ConstantConfiguration, NamespaceConfiguration, Snapshot, BuildContext } from './model';
export { Config };
export { ValueConfig };
export { ObjectFactory };
export { BuildContext };
export { Scope };
export { ContainerConfiguration };
export { ConstantConfiguration };
export { Inject, Factory, Singleton, Scoped, OnlyInstantiableByContainer, InRequestScope, InjectValue } from './decorators';
export { Snapshot };
/**
 * The IoC Container class. Can be used to register and to retrieve your dependencies.
 * You can also use de decorators [[OnlyInstantiableByContainer]], [[Scoped]], [[Singleton]], [[Factory]]
 * to configure the dependency directly on the class.
 */
export declare class Container {
    /**
     * Add a dependency to the Container. If this type is already present, just return its associated
     * configuration object.
     * Example of usage:
     *
     * ```
     * Container.bind(PersonDAO).to(ProgrammerDAO).scope(Scope.Singleton);
     * ```
     * @param source The type that will be bound to the Container
     * @return a container configuration
     */
    static bind(source: Function): Config;
    /**
     * Retrieve an object from the container. It will resolve all dependencies and apply any type replacement
     * before return the object.
     * If there is no declared dependency to the given source type, an implicity bind is performed to this type.
     * @param source The dependency type to resolve
     * @return an object resolved for the given source type;
     */
    static get<T>(source: Function & {
        prototype: T;
    }): T;
    /**
     * Retrieve a type associated with the type provided from the container
     * @param source The dependency type to resolve
     * @return an object resolved for the given source type;
     */
    static getType(source: Function): Function;
    /**
     *
     * @param name
     */
    static bindName(name: string): ValueConfig;
    /**
     * Retrieve a constant from the container.
     * @param name The name of the constant used to identify these binding
     * @return the constant value
     */
    static getValue(name: string): any;
    /**
     * Select the current namespace to work.
     * @param name The namespace name, or null to select the default namespace
     */
    static namespace(name: string): import("./model").Namespace;
    /**
     * An alias to namespace method.
     * @param name The namespace name, or null to select the default namespace
     */
    static environment(name: string): import("./model").Namespace;
    /**
     * Store the state for a specified binding.  Can then be restored later.   Useful for testing.
     * @param source The dependency type
     */
    static snapshot(_args?: any): Snapshot;
    /**
     * Import an array of configurations to the Container
     * @param configurations
     */
    static configure(...configurations: Array<ContainerConfiguration | ConstantConfiguration | NamespaceConfiguration>): void;
    private static configureNamespace;
    private static configureConstant;
    private static configureType;
}
