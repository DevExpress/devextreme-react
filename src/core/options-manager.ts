import TemplatesManager from "./templates-manager";

import { getChanges } from "./configuration/comparer";
import { IConfigNode } from "./configuration/config-node";
import { buildConfig, findValue, ValueType } from "./configuration/tree";
import { mergeNameParts } from "./configuration/utils";
import { capitalizeFirstLetter } from "./helpers";

class OptionsManager {
    private readonly _guards: Record<string, number> = {};
    private _templatesManager: TemplatesManager;
    private _instance: any;
    private _isUpdating = false;
    private _currentConfig: IConfigNode;

    constructor(templatesManager: TemplatesManager) {
        this._templatesManager = templatesManager;

        this.onOptionChanged = this.onOptionChanged.bind(this);
        this._wrapOptionValue = this._wrapOptionValue.bind(this);
    }

    public setInstance(instance: any, config: IConfigNode) {
        this._instance = instance;
        this._currentConfig = config;
    }

    public getInitialOptions(rootNode: IConfigNode) {
        const config = buildConfig(rootNode, false);

        for (const key of Object.keys(config.templates)) {
            this._templatesManager.add(key, config.templates[key]);
        }

        const options: Record<string, any> = {};

        for (const key of Object.keys(config.options)) {
            options[key] = this._wrapOptionValue(key, config.options[key]);
        }

        if (this._templatesManager.templatesCount > 0) {
            options.integrationOptions = {
                templates: this._templatesManager.templates
            };
        }

        return options;
    }

    public update(config: IConfigNode) {
        const changes = getChanges(config, this._currentConfig);

        if (!changes.options && !changes.templates && !changes.removedOptions.length) {
            return;
        }

        this._instance.beginUpdate();
        this._isUpdating = true;

        changes.removedOptions.forEach((optionName) => {
            this._resetOption(optionName);
        });

        for (const key of Object.keys(changes.templates)) {
            this._templatesManager.add(key, changes.templates[key]);
        }

        if (this._templatesManager.templatesCount > 0) {
            this._setValue(
                "integrationOptions",
                {
                    templates: this._templatesManager.templates
                }
            );
        }

        for (const key of Object.keys(changes.options)) {
            this._setValue(key, changes.options[key]);
        }

        this._isUpdating = false;
        this._instance.endUpdate();

        this._currentConfig = config;
    }

    public onOptionChanged(e: { name: string, fullName: string, value: any }) {
        if (this._isUpdating) {
            return;
        }

        this._callOptionChangeHandler(e.fullName, e.value);
        const valueDescriptor = findValue(this._currentConfig, e.fullName.split("."));
        if (!valueDescriptor) {
            return;
        }

        const { value, type } = valueDescriptor;
        if (type === ValueType.Complex) {
            for (const key of Object.keys(value)) {
                if (
                    value[key] === null ||
                    value[key] === undefined ||
                    value[key] === e.value[key]
                ) {
                    continue;
                }
                this._setGuard(mergeNameParts(e.fullName, key), value[key]);
            }
        } else {
            if (
                value === null ||
                value === undefined ||
                value === e.value
            ) {
                return;
            }
            this._setGuard(e.fullName, value);
        }
    }

    public dispose() {
        for (const optionName of Object.keys(this._guards)) {
            window.clearTimeout(this._guards[optionName]);
            delete this._guards[optionName];
        }
    }

    private _getOptionFromConfig(
        parts: string[],
        options: Record<string, any>,
        configs: Record<string, IConfigNode | IConfigNode[]>
    ): any {
        const currentName = parts[0];
        const arrayBracketIndex = currentName.indexOf("[");
        const optionName = arrayBracketIndex > - 1 ? currentName.slice(0, arrayBracketIndex) : currentName;
        const arrayIndex = arrayBracketIndex > - 1 ? currentName[arrayBracketIndex + 1] : -1;

        const isOption = !!options[optionName];
        let option = isOption ? options[optionName] : configs[optionName];
        if (option) {
            option = arrayIndex > -1 ? option[arrayIndex] : option;
            if (parts.length > 1) {
                const newOptions = isOption ? option : option.options;
                const newConfig = isOption ? {} : { ...option.configs, ...option.configCollections };
                return this._getOptionFromConfig(parts.slice(1), newOptions, newConfig);
            }
            return option;
        }

        return null;
    }

    private _callOptionChangeHandler(optionName: string, optionValue: any) {
        const parts = optionName.split(".");
        const propName = parts[parts.length - 1];
        if (propName.substr(0, 2) !== "on") {
            const eventName = `on${capitalizeFirstLetter(propName)}Change`;
            parts[parts.length - 1] = eventName;
            const changeEvent = this._getOptionFromConfig(
                parts,
                this._currentConfig.options,
                { ...this._currentConfig.configs, ...this._currentConfig.configCollections }
            );

            if (!changeEvent) {
                return;
            }

            if (typeof changeEvent !== "function") {
                throw new Error(
                    `Invalid value for "${eventName}" property.
                    The "${eventName}" must be a function.`
                );
            }
            changeEvent(optionValue);
        }
    }

    private _wrapOptionValue(name: string, value: any) {
        if (name.substr(0, 2) === "on" && typeof value === "function") {
            return (...args: any[]) => {
                if (!this._isUpdating) {
                    value(...args);
                }
            };
        }

        return value;
    }

    private _setGuard(optionName: string, optionValue: any): void {
        if (this._guards[optionName] !== undefined) {
            return;
        }

        const guardId = window.setTimeout(() => {
            this._setValue(optionName, optionValue);
            window.clearTimeout(guardId);
            delete this._guards[optionName];
        });

        this._guards[optionName] = guardId;
    }

    private _resetOption(name: string) {
        this._instance.resetOption(name);
    }

    private _setValue(name: string, value: any) {
        if (this._guards[name]) {
            window.clearTimeout(this._guards[name]);
            delete this._guards[name];
        }

        this._instance.option(
            name,
            this._wrapOptionValue(name, value)
        );
    }
}

export {
    OptionsManager
};
