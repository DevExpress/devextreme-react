import TemplatesManager from "../templates-manager";
import { buildConfig, getTemplateInfo } from "./builder";
import { ConfigNode } from "./config-node";
import { buildOptionFullname, getOptionValue } from "./utils";

class OptionsManager {
    private readonly _guards: Record<string, number> = {};
    private _templatesManager: TemplatesManager;
    private _instance: any;
    private _isUpdating = false;
    private _currentConfig: ConfigNode;

    constructor(templatesManager: TemplatesManager) {
        this._templatesManager = templatesManager;

        this.onOptionChanged = this.onOptionChanged.bind(this);
    }

    public setInstance(instance: any, config: ConfigNode) {
        this._instance = instance;
        this._currentConfig = config;
    }

    public getInitialOptions(rootNode: ConfigNode) {
        const config = buildConfig(rootNode, false);

        for (const key of Object.keys(config.templates)) {
            this._templatesManager.add(config.templates[key]);
        }

        return {
            ...config.options,
            ...this._templatesManager.options
        };
    }

    public update(config: ConfigNode) {
        this._update(config, this._currentConfig);

        const integrationOptions = this._templatesManager.options && this._templatesManager.options.integrationOptions;
        if (integrationOptions) {
            this._setValueInTransaction(
                "integrationOptions",
                integrationOptions
            );
        }

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

    private _update(current: ConfigNode, prev: ConfigNode) {
        if (!prev) {
            this._updateNodeWithTemplates(current);
        }

        this._processRemovedValues(current.values, prev.values, current.fullname);
        this._processRemovedValues(current.collections, prev.collections, current.fullname);
        this._processRemovedValues(current.children, prev.children, current.fullname);

        for (const key of Object.keys(current.collections)) {
            this._updateCollection(
                current.collections[key],
                prev.collections[key],
                buildOptionFullname(current.fullname, key)
            );
        }

        for (const key of Object.keys(current.children)) {
            this._update(current.children[key], prev.children[key]);
        }

        for (const key of Object.keys(current.values)) {
            if (current.values[key] === prev.values[key]) {
                continue;
            }

            this._setValueInTransaction(
                buildOptionFullname(current.fullname, key),
                current.values[key]
            );
        }

        this._registerTemplates(current);
    }

    private _registerTemplates(node: ConfigNode) {
        for (const templateMeta of node.descriptor.templates || []) {
            const templateInfo = getTemplateInfo(node, templateMeta);
            if (templateInfo) {
                this._templatesManager.add(templateInfo);
            }
        }
    }

    private _updateCollection(current: ConfigNode[], prev: ConfigNode[], fullname: string) {
        if (!prev || current.length !== prev.length) {
            this._setValueInTransaction(
                fullname,
                current.map(
                    (node) => {
                        const config = buildConfig(node, true);

                        for (const key of Object.keys(config.templates)) {
                            this._templatesManager.add(config.templates[key]);
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

    private _processRemovedValues(current: Record<string, any>, prev: Record<string, any>, fullname: string) {
        const removedKeys = Object.keys(prev).filter((key) => Object.keys(current).indexOf(key) < 0);

        for (const key of removedKeys) {
            this._setValueInTransaction(
                buildOptionFullname(fullname, key),
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
        this._instance.option(name, value);
    }

    private _updateNodeWithTemplates(node: ConfigNode) {
        const config = buildConfig(node, true);

        for (const key of Object.keys(config.templates)) {
            this._templatesManager.add(config.templates[key]);
        }

        this._setValueInTransaction(node.fullname, config.options);
    }
}

export {
    OptionsManager
};
