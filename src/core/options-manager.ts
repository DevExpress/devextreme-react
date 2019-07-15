import TemplatesManager from "./templates-manager";

import { buildConfig, findValue, IConfigNode } from "./configuration";
import { getChanges } from "./configuration/comparer";

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

        options.integrationOptions = {
            templates: this._templatesManager.templates
        };

        return options;
    }

    public update(config: IConfigNode) {
        const changes = getChanges(config, this._currentConfig);

        for (const key of Object.keys(changes.options)) {
            this._setValueInTransaction(key, changes.options[key]);
        }

        for (const key of Object.keys(changes.templates)) {
            this._templatesManager.add(key, changes.templates[key]);
        }

        this._setValueInTransaction(
            "integrationOptions",
            {
                templates: this._templatesManager.templates
            }
        );

        if (this._isUpdating) {
            this._isUpdating = false;
            this._instance.endUpdate();
        }

        this._currentConfig = config;
    }

    public onOptionChanged(e: { name: string, fullName: string, value: any }) {
        if (this._isUpdating) {
            return;
        }

        const controlledValue = findValue(this._currentConfig, e.fullName.split("."));

        if (
            controlledValue === null ||
            controlledValue === undefined ||
            controlledValue === e.value
        ) {
            return;
        }

        this._setGuard(e.fullName, controlledValue);
    }

    public dispose() {
        for (const optionName of Object.keys(this._guards)) {
            window.clearTimeout(this._guards[optionName]);
            delete this._guards[optionName];
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

    private _setValueInTransaction(name: string, value: any) {
        if (!this._isUpdating) {
            this._instance.beginUpdate();
            this._isUpdating = true;
        }

        this._setValue(name, value);
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
