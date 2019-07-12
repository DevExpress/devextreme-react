import { getOptionValue, IConfigNode, prepareConfig } from "./configuration";
import { mergeNameParts } from "./configuration/utils";
import TemplatesManager from "./templates-manager";

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
        const config = prepareConfig(rootNode, false);

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
        this._update(config, this._currentConfig);

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

        const controlledValue = getOptionValue(this._currentConfig, e.fullName.split("."));

        if (
            controlledValue === null ||
            controlledValue === undefined ||
            controlledValue === e.value
        ) {
            return;
        }

        this._setGuard(e.fullName, controlledValue);
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

    private _update(current: IConfigNode, prev: IConfigNode) {
        if (!prev) {
            this._updateNodeWithTemplates(current);
        }

        this._processRemovedValues(current.options, prev.options);
        this._processRemovedValues(current.configCollections, prev.configCollections);
        this._processRemovedValues(current.configs, prev.configs);

        for (const key of Object.keys(current.configCollections)) {
            this._updateCollection(
                current.configCollections[key],
                prev.configCollections[key],
                mergeNameParts(current.fullName, key)
            );
        }

        for (const key of Object.keys(current.configs)) {
            this._update(current.configs[key], prev.configs[key]);
        }

        for (const key of Object.keys(current.options)) {
            if (current.options[key] === prev.options[key]) {
                continue;
            }

            this._setValueInTransaction(
                mergeNameParts(current.fullName, key),
                current.options[key]
            );
        }

        this._updateTemplates(current);
    }

    private _updateTemplates(node: IConfigNode) {
        node.templates.map(
            (template) => {
                if (template.isAnonymous) {
                    const templateName = mergeNameParts(node.fullName, template.optionName);
                    this._templatesManager.add(templateName, template);
                } else {
                    this._templatesManager.add(template.optionName, template);
                }
            }
        );
    }

    private _updateCollection(current: IConfigNode[], prev: IConfigNode[], fullname: string) {
        if (!prev || current.length !== prev.length) {
            this._setValueInTransaction(
                fullname,
                current.map(
                    (node) => {
                        const config = prepareConfig(node, true);

                        for (const key of Object.keys(config.templates)) {
                            this._templatesManager.add(key, config.templates[key]);
                        }

                        return config.options;
                    }
                )
            );
            return;
        }

        for (let i = 0; i < current.length; i++) {
            this._update(current[i], prev[i]);
        }
    }

    private _processRemovedValues(current: Record<string, any>, prev: Record<string, any>) {
        const removedKeys = Object.keys(prev).filter((key) => Object.keys(current).indexOf(key) < 0);

        for (const key of removedKeys) {
            this._setValueInTransaction(
                mergeNameParts(current.fullName, key),
                undefined
            );
        }
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

    private _updateNodeWithTemplates(node: IConfigNode) {
        const config = prepareConfig(node, true);

        for (const key of Object.keys(config.templates)) {
            this._templatesManager.add(key, config.templates[key]);
        }

        this._setValueInTransaction(node.fullName, config.options);
    }
}

export {
    OptionsManager
};
