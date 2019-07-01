import { ITemplateMeta } from "../template";
import TemplatesManager from "../templates-manager";
import { separateProps } from "../widget-config";
import { OptionConfiguration } from "./option-configuration";

class OptionsBuilder {
    private _templatesManager: TemplatesManager;
    private _ignoreInitialValues: boolean;

    constructor(templatesManager: TemplatesManager) {
        this._templatesManager = templatesManager;
    }

    public build(config: OptionConfiguration, ignoreInitialValues: boolean) {
        this._ignoreInitialValues = ignoreInitialValues;

        return {
            templatesRenderAsynchronously: true,
            ...this._build(config, ""),
            ...this._templatesManager.options
        };
    }

    private _build(configuration: OptionConfiguration, path: string): Record<string, any> {
        const complexOptions: Record<string, any> = {};
        const currentOptionName = this._buildFullname(
            configuration.descriptor.name,
            path,
            configuration.descriptor.isCollection
        );

        this._appendChildren(
            complexOptions,
            configuration.children,
            currentOptionName
        );

        this._appendCollections(
            complexOptions,
            configuration.collections,
            currentOptionName
        );

        const separatedValues = separateProps(
            configuration.values,
            configuration.descriptor.initialValueProps,
            configuration.descriptor.templates
        );

        const initialValues = this._ignoreInitialValues ? {} : separatedValues.defaults;

        const templatesOptions = this._registerTemplates(
            configuration.values,
            separatedValues.templates,
            configuration.descriptor.templates,
            currentOptionName
        );

        return {
            ...configuration.descriptor.predefinedValues,
            ...complexOptions,
            ...separatedValues.options,
            ...initialValues,
            ...templatesOptions
        };
    }

    private _appendChildren(options: Record<string, any>, children: OptionConfiguration[], path: string) {
        children.map(
            (child) => {
                options[child.descriptor.name] = this._build(child, path);
            }
        );
    }

    private _appendCollections(
        options: Record<string, any>,
        collections: Record<string, OptionConfiguration[]>,
        path: string
    ) {
        for (const key of Object.keys(collections)) {
            const currentPath = this._buildFullname(key, path, false);
            options[key] = collections[key].map(
                (item, index) => this._build(item, currentPath + "[" + index + "]")
            );
        }
    }

    private _registerTemplates(
        values: Record<string, any>,
        templateValues: Record<string, any>,
        templates: ITemplateMeta[],
        path: string
    ): Record<string, any> {
        return this._templatesManager.add({
            useChildren: (optionName) => path.length > 0 && optionName === "template", // CHANGED LOGIC, CHECK
            props: templateValues,
            templateProps: templates,
            ownerName: path,
            propsGetter: (prop) => values[prop]
        });
    }

    private _buildFullname(name: string, path: string, isCollectionItem: boolean) {
        if (isCollectionItem) {
            return path;
        }

        return path ? path + "." + name : name;
    }
}

export {
    OptionsBuilder
};
