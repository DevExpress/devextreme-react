import { ITemplateMeta } from "./template";

import { Children as ReactChildren } from "react";
import { addPrefixToKeys, getNestedValue } from "./helpers";
import { createOptionComponent, INestedOptionMeta } from "./nested-option";
import TemplatesManager from "./templates-manager";
import { separateProps } from "./widget-config";

interface INestedOption {
    optionName: string;
    isCollectionItem: boolean;
}

interface INestedConfigDescr extends INestedOption {
    optionFullName: string;
    defaults: Record<string, any>;
    templates: ITemplateMeta[];
    elementEntries: Array<{
        element: React.ReactElement<any>;
        children: Record<string, INestedConfigDescr>;
        predefinedProps: Record<string, any>;
    }>;
}

interface INestedConfigClass {
    type: {
        IsCollectionItem: boolean;
        OptionName: string;
        DefaultsProps: Record<string, string>;
        TemplateProps: ITemplateMeta[];
        PredefinedProps: Record<string, any>;
        ExpectedChildren: Record<string, INestedOption>;
    };
    props: object;
}

function isEventHanlder(optionName: string, optionValue: any) {
    return optionName.substr(0, 2) === "on" && typeof optionValue === "function";
}

class OptionsManager {

    private readonly _guards: Record<string, number> = {};
    private readonly _nestedOptions: Record<string, INestedConfigDescr> = {};
    private readonly _optionValueGetter: (name: string) => any;
    private readonly _templatesManager: TemplatesManager;

    private _instance: any;

    private _updatingProps: boolean;
    private _dirtyOptions: Record<string, INestedConfigDescr> = {};

    constructor(optionValueGetter: (name: string) => any, templateHost: TemplatesManager) {
        this._optionValueGetter = optionValueGetter;
        this._templatesManager = templateHost;

        this._setOption = this._setOption.bind(this);
        this._syncOptions = this._syncOptions.bind(this);
        this._registerNestedOption = this._registerNestedOption.bind(this);
        this.registerNestedOption = this.registerNestedOption.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.updateOptions = this.updateOptions.bind(this);
    }

    public resetNestedElements() {
        Object.keys(this._nestedOptions).forEach((optionName) => {
            this._nestedOptions[optionName].elementEntries.length = 0;
        });
    }

    public setInstance(instance: any) {
        this._instance = instance;
    }

    public wrapEventHandlers(options: Record<string, any>) {
        Object.keys(options).forEach((name) => {
            const value = options[name];
            if (isEventHanlder(name, value)) {
                options[name] = this._wrapEventHandler(value);
            }
        });
    }

    public handleOptionChange(e: { name: string, fullName: string, value: any }) {
        if (this._updatingProps) {
            return;
        }

        let optionValue;
        let optionName;

        const nestedOption = this._nestedOptions[e.name];
        if (nestedOption && nestedOption.elementEntries.length > 0) {
            optionName = e.fullName;
            const nestedOptionObj = separateProps(
                nestedOption.elementEntries[0].element.props,
                nestedOption.defaults,
                []
            ).options;

            if (e.name === e.fullName) {
                Object.keys(nestedOptionObj).forEach((key) => this.handleOptionChange({
                    name: e.name,
                    fullName: `${e.fullName}.${key}`,
                    value: e.value[key]
                }));

                return;
            }

            if (nestedOption.isCollectionItem) { return; }

            optionValue = getNestedValue(nestedOptionObj, e.fullName.split(".").slice(1));
        } else {
            const fullNameParts = e.fullName.split(".");

            if (fullNameParts.length > 1) {
                optionName = e.fullName;
                optionValue = getNestedValue(
                    this._optionValueGetter(e.name),
                    fullNameParts.slice(1)
                );
            } else {
                optionName = e.name;
                optionValue = this._optionValueGetter(e.name);
            }
        }

        if (optionValue === undefined || optionValue === null) {
            return;
        }

        this._setGuard(optionName, optionValue);
    }

    public updateOptions(newProps: Record<string, any>, prevProps: Record<string, any>): void {
        const nestedOptions: Record<string, any> = {};

        Object.keys(this._dirtyOptions).forEach((optionName) => {
            const optionDescr = this._dirtyOptions[optionName];
            const optionValue = this._getNestedOptionObj(optionDescr, true);

            nestedOptions[optionName] = optionValue;
        });

        const newOptions: Record<string, any> = {
            ...this._templatesManager.options,
            ...nestedOptions,
            ...newProps
        };

        this._syncOptions(newOptions, prevProps);

        this._dirtyOptions = {};
    }

    public getNestedOptionsObjects(): Record<string, any> {
        return this._getNestedOptionsObjects(this._nestedOptions, true);
    }

    public registerNestedOption(
        component: React.ReactElement<any>,
        expectedChildren: Record<string, INestedOption>
    ): any {
        return this._registerNestedOption(component, expectedChildren, this._nestedOptions);
    }

    public dispose() {
        for (const optionName of Object.keys(this._guards)) {
            window.clearTimeout(this._guards[optionName]);
            delete this._guards[optionName];
        }
    }

    private _syncOptions(
        newOptions: Record<string, any>,
        prevOptions: Record<string, any>
    ): void {
        this._updatingProps = false;

        for (const optionName of Object.keys(newOptions)) {
            if (newOptions[optionName] === prevOptions[optionName]) {
                continue;
            }

            if (this._guards[optionName]) {
                window.clearTimeout(this._guards[optionName]);
                delete this._guards[optionName];
            }

            if (!this._updatingProps) {
                this._instance.beginUpdate();
                this._updatingProps = true;
            }
            this._setOption(optionName, newOptions[optionName]);
        }

        if (this._updatingProps) {
            this._updatingProps = false;
            this._instance.endUpdate();
        }
    }

    private _setOption(name: string, value: any): void {
        let actualValue = value;
        if (isEventHanlder(name, value)) {
            actualValue = this._wrapEventHandler(value);
        }

        this._instance.option(name, actualValue);
    }

    private _wrapEventHandler(handler: any) {
        return (...args: any[]) => {
            if (!this._updatingProps) {
                handler(...args);
            }
        };
    }

    private _getNestedOptionsObjects(
        optionsCollection: Record<string, INestedConfigDescr>,
        templateRegistrationRequired: boolean
    ): Record<string, any> {
        const configComponents: Record<string, any> = {};

        Object.keys(optionsCollection).forEach((key) => {
            const configComponent = optionsCollection[key];
            configComponents[configComponent.optionName] = this._getNestedOptionObj(
                configComponent,
                templateRegistrationRequired
            );
        });

        return configComponents;
    }

    private _getNestedOptionObj(
        configComponent: INestedConfigDescr,
        templateRegistrationRequired: boolean
    ): Record<string, any> | any {
        const options = configComponent.elementEntries.map((e, index) => {
            const props = separateProps(
                e.element.props,
                configComponent.defaults,
                configComponent.templates
            );

            const nestedObjects = this._getNestedOptionsObjects(e.children, templateRegistrationRequired);
            const nestedObjectsCount =  Object.keys(nestedObjects).reduce((acc, item) => {
                const obj = nestedObjects[item];
                return acc + (Array.isArray(obj) ? obj.length : 1);
            }, 0);

            const hasChildrenForTemplate =
                ReactChildren.count(e.element.props.children) > nestedObjectsCount;

            let templatesOptions = {};
            if (templateRegistrationRequired) {
                templatesOptions = this._templatesManager.add({
                    useChildren: (optionName) => {
                        return optionName === "template" && hasChildrenForTemplate;
                    },
                    props: props.templates,
                    templateProps: configComponent.templates,
                    ownerName: this.buildOptionItemName(
                        configComponent,
                        configComponent.isCollectionItem ? index : undefined,
                    ),
                    propsGetter: (prop) => {
                        const nestedElement = configComponent.elementEntries[index];
                        if (!nestedElement) {
                            return;
                        }

                        return nestedElement.element.props[prop];
                    }
                });
            }

            return {
                ...e.predefinedProps,
                ...props.defaults,
                ...props.options,
                ...nestedObjects,
                ...templatesOptions
            };
        });

        return configComponent.isCollectionItem
            ? options
            : options[options.length - 1];
    }

    private _registerNestedOption(
        element: React.ReactElement<any>,
        expectedChildren: Record<string, INestedOption>,
        owningCollection: Record<string, INestedConfigDescr>,
        ownerFullName?: string
    ): any {
        const nestedOptionClass = element as any as INestedConfigClass;
        if (!(nestedOptionClass && nestedOptionClass.type && nestedOptionClass.type.OptionName)) {
            return null;
        }

        const nestedOptionsCollection: Record<string, INestedConfigDescr> = {};

        const resolvedNested = resolveNestedOption(
            nestedOptionClass.type.OptionName,
            nestedOptionClass.type.IsCollectionItem,
            expectedChildren
        );
        const optionName = resolvedNested.optionName;
        const isCollectionItem = resolvedNested.isCollectionItem;

        let optionFullName = optionName;
        if (ownerFullName) {
            optionFullName = `${ownerFullName}.${optionFullName}`;
        }

        const option = ensureNestedOption(
            optionName,
            optionFullName,
            owningCollection,
            nestedOptionClass.type.DefaultsProps,
            nestedOptionClass.type.TemplateProps,
            isCollectionItem
        );

        const optionItemName = this.buildOptionItemName(
            option,
            isCollectionItem ? option.elementEntries.length : undefined
        );

        const nestedOptionMeta: INestedOptionMeta = {
            optionName,
            registerNestedOption: (c: React.ReactElement<any>) => {
                return this._registerNestedOption(
                    c,
                    nestedOptionClass.type.ExpectedChildren,
                    nestedOptionsCollection,
                    optionItemName
                );
            },
            updateFunc: (newProps, prevProps) => {
                const newOptions = separateProps(
                    newProps,
                    nestedOptionClass.type.DefaultsProps,
                    nestedOptionClass.type.TemplateProps
                ).options;

                this._syncOptions(
                    addPrefixToKeys(newOptions, optionItemName + "."),
                    addPrefixToKeys(prevProps, optionItemName + ".")
                );
            },
            makeDirty: () => {
                if (this._instance && option.isCollectionItem) {
                    this._dirtyOptions[option.optionName] = option;
                }
            }
        };

        const optionComponent = createOptionComponent(element, nestedOptionMeta);

        option.elementEntries.push({
            element,
            children: nestedOptionsCollection,
            predefinedProps: nestedOptionClass.type.PredefinedProps
        });

        return optionComponent;
    }

    private buildOptionItemName(descr: INestedConfigDescr, index?: number): string {
        let optionItemName = descr.optionFullName;

        if (index !== undefined) {
            optionItemName += `[${index}]`;
        }

        return optionItemName;
    }

    private _setGuard(optionName: string, optionValue: any): void {
        if (this._guards[optionName] !== undefined) {
            return;
        }

        const guardId = window.setTimeout(() => {
            this._setOption(optionName, optionValue);
            window.clearTimeout(guardId);
            delete this._guards[optionName];
        });

        this._guards[optionName] = guardId;
    }
}

function ensureNestedOption(
    optionName: string,
    optionFullName: string,
    optionsCollection: Record<string, INestedConfigDescr>,
    defaults: Record<string, any>,
    templates: ITemplateMeta[],
    isCollectionItem: boolean
): INestedConfigDescr {

    if (optionsCollection[optionName] === null ||
        optionsCollection[optionName] === undefined
    ) {
        optionsCollection[optionName] = {
            optionName,
            optionFullName,
            defaults,
            templates,
            elementEntries: [],
            isCollectionItem
        };
    }

    return optionsCollection[optionName];
}

function resolveNestedOption(
    componentName: string,
    canBeCollectionItem: boolean,
    expectations: Record<string, INestedOption>
): INestedOption {
    let optionName = componentName;
    let isCollectionItem = canBeCollectionItem;

    const expectation = expectations && expectations[componentName];
    if (expectation) {
        isCollectionItem = expectation.isCollectionItem;
        if (expectation.optionName) {
            optionName = expectation.optionName;
        }
    }

    return { optionName, isCollectionItem };
}

export default OptionsManager;
export {
    INestedOption,
    resolveNestedOption
};
