import TemplatesManager from "../templates-manager";
import { OptionConfiguration } from "./option-configuration";
import { buildOptionFullname } from "./utils";

class OptionsManager {
    private _templatesManager: TemplatesManager;
    private _instance: any;
    private _isUpdating = false;
    private _currentConfig: OptionConfiguration;

    constructor(templatesManager: TemplatesManager) {
        this._templatesManager = templatesManager;
    }

    public setInstance(instance: any, config: OptionConfiguration) {
        this._instance = instance;
        this._currentConfig = config;
    }

    public build(config: OptionConfiguration, ignoreInitialValues: boolean) {
        return {
            ...this._build(config, ignoreInitialValues),
            ...this._templatesManager.options
        };
    }

    public update(config: OptionConfiguration) {
        this._update(config, this._currentConfig);

        const integrationOptions = this._templatesManager.options && this._templatesManager.options.integrationOptions;
        if (integrationOptions) {
            this._setValue(
                "integrationOptions",
                integrationOptions
            );
        }

        if (this._isUpdating) {
            this._instance.endUpdate();
            this._isUpdating = false;
        }

        this._currentConfig = config;
    }

    private _update(current: OptionConfiguration, prev: OptionConfiguration) {
        if (!prev) {
            this._setValue(
                current.fullname,
                this._build(current, true)
            );
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

            this._setValue(
                buildOptionFullname(current.fullname, key),
                current.values[key]
            );
        }

        this._registerTemplates(current);
    }

    private _updateCollection(current: OptionConfiguration[], prev: OptionConfiguration[], fullname: string) {
        if (!prev || current.length !== prev.length) {
            this._setValue(
                fullname,
                current.map((node) => this._build(node, true))
            );
            return;
        }

        for (let i = 0; i < current.length; i++) {
            this._update(current[i], prev[i]);
        }
    }

    private _setValue(name: string, value: any) {
        if (!this._isUpdating) {
            this._instance.beginUpdate();
            this._isUpdating = true;
        }

        this._instance.option(name, value);
    }

    private _processRemovedValues(current: Record<string, any>, prev: Record<string, any>, fullname: string) {
        const removedKeys = Object.keys(prev).filter((key) => Object.keys(current).indexOf(key) < 0);

        for (const key of removedKeys) {
            this._setValue(
                buildOptionFullname(current.fullname, key),
                undefined
            );
        }
    }

    private _build(configuration: OptionConfiguration, ignoreInitialValues: boolean): Record<string, any> {
        const complexOptions: Record<string, any> = {};

        this._appendChildren(
            complexOptions,
            configuration.children,
            ignoreInitialValues
        );

        this._appendCollections(
            complexOptions,
            configuration.collections,
            ignoreInitialValues
        );

        const initialValues = ignoreInitialValues ? {} : configuration.initialValues;

        const templatesOptions = this._registerTemplates(configuration);

        return {
            ...configuration.descriptor.predefinedValues,
            ...complexOptions,
            ...configuration.values,
            ...initialValues,
            ...templatesOptions
        };
    }

    private _appendChildren(
        options: Record<string, any>,
        children: OptionConfiguration[],
        ignoreInitialValues: boolean
    ) {
        children.map(
            (child) => {
                options[child.descriptor.name] = this._build(child, ignoreInitialValues);
            }
        );
    }

    private _appendCollections(
        options: Record<string, any>,
        collections: Record<string, OptionConfiguration[]>,
        ignoreInitialValues: boolean
    ) {
        for (const key of Object.keys(collections)) {
            options[key] = collections[key].map(
                (item) => this._build(item, ignoreInitialValues)
            );
        }
    }

    private _registerTemplates(node: OptionConfiguration): Record<string, any> {
        return this._templatesManager.add({
            useChildren: (optionName) => node.fullname.length > 0 && optionName === "template", // CHANGED LOGIC, CHECK
            props: node.templates,
            templateProps: node.descriptor.templates,
            ownerName: node.fullname,
            propsGetter: (prop) => node.rawValues[prop]
        });
    }
}

export {
    OptionsManager
};
