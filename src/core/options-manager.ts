import { ITemplateMeta } from "./template";

import { addPrefixToKeys, getNestedValue } from "./helpers";
import { createOptionComponent } from "./nested-option";
import { getTemplateOptions } from "./template-helper";
import { separateProps } from "./widget-config";

interface INestedOptionDescr {
    name: string;
    defaults: Record<string, any>;
    templates: ITemplateMeta[];
    elementEntries: Array<{
        element: React.ReactElement<any>;
        children: Record<string, INestedOptionDescr>;
    }>;
    isCollectionItem: boolean;
}

interface INestedOptionClass {
    type: {
        IsCollectionItem: boolean;
        OwnerType: any;
        OptionName: string;
        DefaultsProps: Record<string, string>;
        TemplateProps: ITemplateMeta[]
    };
    props: object;
}

class OptionsManager {

    private readonly _guards: Record<string, number> = {};
    private readonly _nestedOptions: Record<string, INestedOptionDescr> = {};
    private readonly _optionValueGetter: (name: string) => any;

    private _instance: any;

    private _updatingProps: boolean;

    constructor(optionValueGetter: (name: string) => any) {
        this._optionValueGetter = optionValueGetter;
        this._registerNestedOption = this._registerNestedOption.bind(this);

        this.registerNestedOption = this.registerNestedOption.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.processChangedValues = this.processChangedValues.bind(this);
    }

    public resetNestedElements() {
        Object.keys(this._nestedOptions).forEach((optionName) => {
            this._nestedOptions[optionName].elementEntries.length = 0;
        });
    }

    public setInstance(instance: any) {
        this._instance = instance;
    }

    public wrapEventHandler(optionValue: any, optionName: string): any {
        if (optionName.substr(0, 2) === "on" && typeof optionValue === "function") {
            return (...args: any[]) => {
                if (!this._updatingProps) {
                    optionValue(...args);
                }
            };
        }

        return optionValue;
    }

    public handleOptionChange(e: { name: string, fullName: string, value: any }) {
        if (this._updatingProps) {
            return;
        }

        let optionValue;

        const nestedOption = this._nestedOptions[e.name];
        if (nestedOption) {
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

            if (!nestedOption.isCollectionItem) {
                optionValue = getNestedValue(nestedOptionObj, e.fullName.split(".").slice(1));
            }
        } else {
            optionValue = this._optionValueGetter(e.name);
        }

        if (optionValue === undefined || optionValue === null) {
            return;
        }

        this._setGuard(e.fullName, optionValue);
    }

    public processChangedValues(newProps: Record<string, any>, prevProps: Record<string, any>): void {
        this._updatingProps = false;

        for (const optionName of Object.keys(newProps)) {
            if (newProps[optionName] === prevProps[optionName]) {
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
            this._instance.option(optionName, newProps[optionName]);
        }

        if (this._updatingProps) {
            this._updatingProps = false;
            this._instance.endUpdate();
        }
    }

    public getNestedOptionsObjects(stateUpdater: any): Record<string, any> {
        return this._getNestedOptionsObjects(this._nestedOptions, stateUpdater);
    }

    public registerNestedOption(component: React.ReactElement<any>, owner: any): any {
        return this._registerNestedOption(component, owner, this._nestedOptions);
    }

    private _getNestedOptionsObjects(
        optionsCollection: Record<string, INestedOptionDescr>,
        stateUpdater: any
    ): Record<string, any> {
        const nestedOptions: Record<string, any> = {};

        Object.keys(optionsCollection).forEach((key) => {
            const nestedOption = optionsCollection[key];
            let templates = {};
            const options = nestedOption.elementEntries.map((e, index) => {
                const props = separateProps(e.element.props,
                    nestedOption.defaults,
                    nestedOption.templates);

                const templateOptions = getTemplateOptions({
                    options: props.templates,
                    nestedOptions: {},
                    templateProps: nestedOption.templates,
                    stateUpdater,
                    propsGetter: (prop) => nestedOption.elementEntries[index].element.props[prop]
                });

                templates = {
                    ...templates,
                    ...templateOptions.templates
                };
                return {
                    ...props.defaults,
                    ...props.options,
                    ...templateOptions.templateStubs,
                    ...this._getNestedOptionsObjects(e.children, stateUpdater)
                };
            });
            if (Object.keys(templates).length) {
                nestedOptions.integrationOptions = {
                    templates
                };
            }

            nestedOptions[nestedOption.name] = nestedOption.isCollectionItem ? options : options[options.length - 1];
        });

        return nestedOptions;
    }

    private _registerNestedOption(
        element: React.ReactElement<any>,
        owner: any,
        owningCollection: Record<string, INestedOptionDescr>,
        ownerFullName?: string
    ): any {
        const nestedOptionClass = element as any as INestedOptionClass;
        if (!(
            nestedOptionClass && nestedOptionClass.type &&
            nestedOptionClass.type.OptionName &&
            nestedOptionClass.type.OwnerType && owner instanceof nestedOptionClass.type.OwnerType
        )) {
            return null;
        }

        const nestedOptionsCollection: Record<string, INestedOptionDescr> = {};
        const optionName = nestedOptionClass.type.OptionName;

        const entry = ensureNestedOption(
            optionName,
            owningCollection,
            nestedOptionClass.type.DefaultsProps,
            nestedOptionClass.type.TemplateProps,
            nestedOptionClass.type.IsCollectionItem
        );

        const index = nestedOptionClass.type.IsCollectionItem ? `[${entry.elementEntries.length}]` : "";
        let optionFullName = `${optionName}${index}`;
        if (ownerFullName) {
            optionFullName = `${ownerFullName}.${optionFullName}`;
        }

        const optionComponent = createOptionComponent(
            element,
            {
                optionName,
                registerNestedOption: (c: React.ReactElement<any>, o: any) => {
                    return this._registerNestedOption(c, o, nestedOptionsCollection, optionName);
                },
                updateFunc: (newProps, prevProps) => {
                    const newOptions = separateProps(newProps,
                        nestedOptionClass.type.DefaultsProps,
                        nestedOptionClass.type.TemplateProps).options;
                    this.processChangedValues(
                        addPrefixToKeys(newOptions, optionFullName + "."),
                        addPrefixToKeys(prevProps, optionFullName + ".")
                    );
                }
            }
        );

        entry.elementEntries.push({
            element,
            children: nestedOptionsCollection
        });

        return optionComponent;
    }

    private _setGuard(optionName, optionValue): void {
        if (this._guards[optionName] !== undefined) {
            return;
        }

        const guardId = window.setTimeout(() => {
            this._instance.option(optionName, optionValue);
            window.clearTimeout(guardId);
            delete this._guards[optionName];
        });

        this._guards[optionName] = guardId;
    }
}

function ensureNestedOption(
    name: string,
    optionsCollection: Record<string, INestedOptionDescr>,
    defaults: Record<string, any>,
    templates: ITemplateMeta[],
    isCollectionItem: boolean
): INestedOptionDescr {

    if (optionsCollection[name] === null ||
        optionsCollection[name] === undefined
    ) {
        optionsCollection[name] = {
            name,
            defaults,
            templates,
            elementEntries: [],
            isCollectionItem
        };
    }

    return optionsCollection[name];
}

export default OptionsManager;
