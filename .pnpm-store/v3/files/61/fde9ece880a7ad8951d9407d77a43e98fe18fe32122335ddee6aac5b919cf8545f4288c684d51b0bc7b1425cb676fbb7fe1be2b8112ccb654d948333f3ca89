"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BUILD_CONTEXT_KEY = '__BuildContext';
const IOC_WRAPPER_CLASS = 'ioc_wrapper';
/**
 * Utility class to handle injection behavior on class decorations.
 */
class InjectorHandler {
    static instrumentConstructor(source) {
        let newConstructor;
        // tslint:disable-next-line:class-name
        newConstructor = class ioc_wrapper extends source {
            constructor(...args) {
                super(...args);
                InjectorHandler.assertInstantiable();
            }
        };
        newConstructor['__parent'] = source;
        return newConstructor;
    }
    static blockInstantiation(blocked) {
        InjectorHandler.instantiationsBlocked = blocked;
    }
    static unblockInstantiation() {
        const blocked = InjectorHandler.instantiationsBlocked;
        InjectorHandler.instantiationsBlocked = false;
        return blocked;
    }
    static getConstructorFromType(target) {
        let typeConstructor = target;
        if (this.hasNamedConstructor(typeConstructor)) {
            return typeConstructor;
        }
        typeConstructor = typeConstructor['__parent'];
        while (typeConstructor) {
            if (this.hasNamedConstructor(typeConstructor)) {
                return typeConstructor;
            }
            typeConstructor = typeConstructor['__parent'];
        }
        throw TypeError('Can not identify the base Type for requested target ' + target.toString());
    }
    static checkType(source) {
        if (!source) {
            throw new TypeError('Invalid type requested to IoC ' +
                'container. Type is not defined.');
        }
    }
    static checkName(source) {
        if (!source) {
            throw new TypeError('Invalid name requested to IoC ' +
                'container. Name is not defined.');
        }
    }
    static injectContext(target, context) {
        target[BUILD_CONTEXT_KEY] = context;
    }
    static removeContext(target) {
        delete target[BUILD_CONTEXT_KEY];
    }
    static injectProperty(target, key, propertyType, instanceFactory) {
        const propKey = `__${key}`;
        Object.defineProperty(target.prototype, key, {
            enumerable: true,
            get: function () {
                const context = this[BUILD_CONTEXT_KEY] || target[BUILD_CONTEXT_KEY];
                return this[propKey] ? this[propKey] : this[propKey] = instanceFactory(propertyType, context);
            },
            set: function (newValue) {
                this[propKey] = newValue;
            }
        });
    }
    static injectValueProperty(target, key, name, valueFactory) {
        const propKey = `__${key}`;
        Object.defineProperty(target.prototype, key, {
            enumerable: true,
            get: function () {
                return this[propKey] ? this[propKey] : this[propKey] = valueFactory(name);
            },
            set: function (newValue) {
                this[propKey] = newValue;
            }
        });
    }
    static hasNamedConstructor(source) {
        if (source['name']) {
            return source['name'] !== 'ioc_wrapper';
        }
        else {
            try {
                const constructorName = source.prototype.constructor.toString().match(this.constructorNameRegEx)[1];
                return (constructorName && constructorName !== IOC_WRAPPER_CLASS);
            }
            catch (_a) {
                // make linter happy
            }
            return false;
        }
    }
    static assertInstantiable() {
        if (InjectorHandler.instantiationsBlocked) {
            throw new TypeError('Can not instantiate it. The instantiation is blocked for this class. ' +
                'Ask Container for it, using Container.get');
        }
    }
}
exports.InjectorHandler = InjectorHandler;
InjectorHandler.constructorNameRegEx = /function (\w*)/;
InjectorHandler.instantiationsBlocked = true;
//# sourceMappingURL=injection-handler.js.map