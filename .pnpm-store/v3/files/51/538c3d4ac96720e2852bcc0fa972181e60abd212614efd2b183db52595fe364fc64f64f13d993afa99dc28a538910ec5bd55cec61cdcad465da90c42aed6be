"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injection_handler_1 = require("./injection-handler");
const model_1 = require("../model");
const get = require("lodash.get");
const set = require("lodash.set");
class IoCBindConfig {
    constructor(source, instanceFactory, valueFactory) {
        this.source = source;
        this.instanceFactory = instanceFactory;
        this.valueFactory = valueFactory;
    }
    to(target) {
        injection_handler_1.InjectorHandler.checkType(target);
        const targetSource = injection_handler_1.InjectorHandler.getConstructorFromType(target);
        this.targetSource = targetSource;
        if (this.source === targetSource) {
            this.factory((context) => {
                const params = this.getParameters(context);
                const constructor = this.decoratedConstructor || target;
                return (params ? new constructor(...params) : new constructor());
            });
        }
        else {
            this.factory((context) => {
                return this.instanceFactory(target, context);
            });
        }
        return this;
    }
    factory(factory) {
        this.iocFactory = (context) => {
            const blocked = injection_handler_1.InjectorHandler.unblockInstantiation();
            const constructor = this.decoratedConstructor || this.targetSource || this.source;
            injection_handler_1.InjectorHandler.injectContext(constructor, context);
            const instance = factory(context);
            injection_handler_1.InjectorHandler.removeContext(constructor);
            injection_handler_1.InjectorHandler.injectContext(instance, context);
            injection_handler_1.InjectorHandler.blockInstantiation(blocked);
            return instance;
        };
        if (this.iocScope) {
            this.iocScope.reset(this.source);
        }
        return this;
    }
    scope(scope) {
        if (this.iocScope && this.iocScope !== scope) {
            this.iocScope.finish(this.source);
        }
        this.iocScope = scope;
        if (this.iocScope) {
            this.iocScope.init(this.source);
        }
        return this;
    }
    withParams(...paramTypes) {
        this.paramTypes = paramTypes;
        return this;
    }
    instrumentConstructor() {
        const newConstructor = injection_handler_1.InjectorHandler.instrumentConstructor(this.source);
        this.decoratedConstructor = newConstructor;
        this.source.constructor = newConstructor;
        return this;
    }
    getInstance(context) {
        if (!this.iocScope) {
            this.scope(model_1.Scope.Local);
        }
        return this.iocScope.resolve(this.iocFactory, this.source, context);
    }
    clone() {
        const result = new IoCBindConfig(this.source, this.instanceFactory, this.valueFactory);
        result.iocFactory = this.iocFactory;
        result.iocScope = this.iocScope;
        result.targetSource = this.targetSource;
        result.paramTypes = this.paramTypes;
        result.decoratedConstructor = this.decoratedConstructor;
        return result;
    }
    getParameters(context) {
        if (this.paramTypes) {
            return this.paramTypes.map(paramType => {
                if (typeof paramType === 'string' || paramType instanceof String) {
                    return this.valueFactory(paramType);
                }
                return this.instanceFactory(paramType, context);
            });
        }
        return null;
    }
}
exports.IoCBindConfig = IoCBindConfig;
class IoCBindValueConfig {
    constructor(name) {
        this.name = name;
    }
    to(value) {
        if (this.path) {
            this.value = this.value || {};
            set(this.value, this.path, value);
        }
        else {
            this.value = value;
        }
        return this;
    }
    getValue() {
        if (this.path) {
            return get(this.value, this.path);
        }
        return this.value;
    }
    clone() {
        const result = new IoCBindValueConfig(this.name);
        result.path = this.path;
        result.value = this.value;
        return result;
    }
}
exports.IoCBindValueConfig = IoCBindValueConfig;
class PropertyPath {
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }
    static parse(value) {
        const index = value.indexOf('.');
        if (index < 0) {
            return new PropertyPath(value);
        }
        else if (index === 0) {
            throw new TypeError(`Invalid value [${value}] passed to Container.bindName`);
        }
        else if (index + 1 < value.length) {
            return new PropertyPath(value.substring(0, index), value.substring(index + 1));
        }
        return new PropertyPath(value.substring(0, index));
    }
}
exports.PropertyPath = PropertyPath;
//# sourceMappingURL=container-binding-config.js.map