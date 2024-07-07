"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContainerNamespaces {
    constructor() {
        this.defaultNamespace = new NamespaceBindings(null);
        this.namespaces = new Map();
    }
    get(type) {
        let result;
        if (this.currentNamespace) {
            result = this.currentNamespace.get(type);
            if (result) {
                return result;
            }
        }
        return this.defaultNamespace.get(type);
    }
    set(type, bindConfig) {
        (this.currentNamespace || this.defaultNamespace).set(type, bindConfig);
    }
    getValue(name) {
        let result;
        if (this.currentNamespace) {
            result = this.currentNamespace.getValue(name);
            if (result) {
                return result;
            }
        }
        return this.defaultNamespace.getValue(name);
    }
    setValue(name, bindConfig) {
        (this.currentNamespace || this.defaultNamespace).setValue(name, bindConfig);
    }
    selectNamespace(name) {
        if (name) {
            let namespace = this.namespaces.get(name);
            if (!namespace) {
                namespace = new NamespaceBindings(name);
                this.namespaces.set(name, namespace);
            }
            this.currentNamespace = namespace;
        }
        else {
            this.currentNamespace = null;
        }
    }
    removeNamespace(name) {
        const namespace = this.namespaces.get(name);
        if (namespace) {
            if (this.currentNamespace && (namespace.name === this.currentNamespace.name)) {
                this.currentNamespace = null;
            }
            namespace.clear();
            this.namespaces.delete(name);
        }
    }
    selectedNamespace() {
        return (this.currentNamespace ? this.currentNamespace.name : null);
    }
}
exports.ContainerNamespaces = ContainerNamespaces;
class NamespaceBindings {
    constructor(name) {
        this.bindings = new Map();
        this.values = new Map();
        this.name = name;
    }
    get(type) {
        return this.bindings.get(type);
    }
    set(type, bindConfig) {
        bindConfig.namespace = this.name;
        this.bindings.set(type, bindConfig);
    }
    getValue(name) {
        return this.values.get(name);
    }
    setValue(name, bindConfig) {
        bindConfig.namespace = this.name;
        this.values.set(name, bindConfig);
    }
    clear() {
        this.bindings.clear();
        this.values.clear();
    }
}
//# sourceMappingURL=container-namespaces.js.map