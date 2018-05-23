import { getNestedValue } from "./helpers";
import { OptionCollection } from "./nested-option-collection";
import { separateProps } from "./widget-config";

class OptionsSyncer {

    private readonly _guards: Record<string, number> = {};
    private readonly _nestedOptions: OptionCollection;
    private readonly _optionValueGetter: (name: string) => any;

    private _instance: any;

    private _updatingProps: boolean;

    constructor(nestedOptions: OptionCollection, optionValueGetter: (name: string) => any) {
        this._nestedOptions = nestedOptions;
        this._optionValueGetter = optionValueGetter;

        this.optionChangedHandler = this.optionChangedHandler.bind(this);
        this.processChangedValues = this.processChangedValues.bind(this);
        this.wrapEventHandler = this.wrapEventHandler.bind(this);
    }

    public get instance(): any {
        return this._instance;
    }

    public set instance(instance: any) {
        this._instance = instance;
    }

    public optionChangedHandler(e: { name: string, fullName: string, value: any }) {
        if (this._updatingProps) {
            return;
        }

        const optionName = e.fullName;
        let optionValue = this._optionValueGetter(e.name);

        const nestedOption = this._nestedOptions.get(e.name);
        if (nestedOption && !nestedOption.isCollectionItem) {
            const separatedProps = separateProps(nestedOption.elements[0].props, nestedOption.defaults, []);

            optionValue = getNestedValue(separatedProps.options, e.fullName.split(".").slice(1));
        }

        if (optionValue === undefined || optionValue === null) {
            return;
        }

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
}

export { OptionsSyncer };
