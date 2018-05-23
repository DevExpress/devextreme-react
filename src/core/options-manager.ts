import { ReactElement } from "react";

import { getNestedValue } from "./helpers";
import { separateProps } from "./widget-config";

interface INestedOptionDescr {
    name: string;
    defaults: Record<string, any>;
    elements: Array<React.ReactElement<any>>;
    isCollectionItem: boolean;
}

class OptionsManager {

    private readonly _guards: Record<string, number> = {};
    private readonly _nestedOptions: Record<string, INestedOptionDescr> = {};
    private readonly _optionValueGetter: (name: string) => any;

    private _instance: any;

    private _updatingProps: boolean;

    constructor(optionValueGetter: (name: string) => any) {
        this._optionValueGetter = optionValueGetter;

        this.addNestedOption = this.addNestedOption.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.processChangedValues = this.processChangedValues.bind(this);
    }

    public get updatingProps(): boolean {
        return this._updatingProps;
    }

    public setInstance(instance: any) {
        this._instance = instance;
    }

    public handleOptionChange(e: { name: string, fullName: string, value: any }) {
        if (this._updatingProps) {
            return;
        }

        let optionValue;

        const nestedOption = this._nestedOptions[e.name];
        if (nestedOption) {
            const nestedOptionObj = separateProps(nestedOption.elements[0].props, nestedOption.defaults, []).options;

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

    public addNestedOption(
        name: string,
        element: ReactElement<any>,
        defaults: Record<string, any>,
        isCollectionItem: boolean
    ): void {
        if (this._nestedOptions[name] === null ||
            this._nestedOptions[name] === undefined
        ) {
            this._nestedOptions[name] = {
                name,
                defaults,
                elements: [],
                isCollectionItem
            };
        }

        this._nestedOptions[name].elements.push(element);
    }

    public getNestedOptionsObjects(): Record<string, any> {

        const nestedOptions: Record<string, any> = {};

        Object.keys(this._nestedOptions).forEach((key) => {
            const nestedOption = this._nestedOptions[key];
            const options = nestedOption.elements.map((e) => {
                const props = separateProps(e.props, nestedOption.defaults, []);
                return {
                    ...props.defaults,
                    ...props.options
                };
            });

            nestedOptions[nestedOption.name] = nestedOption.isCollectionItem ? options : options[options.length - 1];
        });

        return nestedOptions;
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

export { INestedOptionDescr, OptionsManager };
