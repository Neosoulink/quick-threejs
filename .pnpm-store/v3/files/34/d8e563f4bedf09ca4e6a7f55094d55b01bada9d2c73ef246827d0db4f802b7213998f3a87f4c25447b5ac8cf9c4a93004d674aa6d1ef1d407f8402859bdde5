import { IoCBindConfig, IoCBindValueConfig } from './container-binding-config';
export declare class ContainerNamespaces {
    private defaultNamespace;
    private namespaces;
    private currentNamespace;
    get(type: FunctionConstructor): IoCBindConfig;
    set(type: FunctionConstructor, bindConfig: IoCBindConfig): void;
    getValue(name: string): IoCBindValueConfig;
    setValue(name: string, bindConfig: IoCBindValueConfig): void;
    selectNamespace(name: string): void;
    removeNamespace(name: string): void;
    selectedNamespace(): string;
}
