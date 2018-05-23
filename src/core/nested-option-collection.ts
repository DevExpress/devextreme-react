import { ReactElement } from "react";

interface INestedOptionDescr {
    name: string;
    defaults: Record<string, any>;
    elements: Array<React.ReactElement<any>>;
    isCollectionItem: boolean;
}

class OptionCollection {
    private readonly _nestedOptions: Record<string, INestedOptionDescr> = {};

    public add(
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

    public get(name: string): INestedOptionDescr {
        return this._nestedOptions[name];
    }

    public forEach(callback: (item: INestedOptionDescr) => void): void {
        Object.keys(this._nestedOptions).forEach((key) => callback(this._nestedOptions[key]));
    }
}

export { INestedOptionDescr, OptionCollection };
