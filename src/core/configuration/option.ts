import { separateProps } from "../widget-config";
import { IOptionNodeDescriptor } from "./node";

class Option {
    private _fullname: string;
    private _descriptor: IOptionNodeDescriptor;
    private _values: Record<string, any> = {};
    private _initialValues: Record<string, any> = {};
    private _collections: Record<string, Option[]> = {};
    private _children: Record<string, Option> = {};

    constructor(descriptor: IOptionNodeDescriptor, fullname: string) {
        this._descriptor = descriptor;
        this._fullname = fullname;
    }

    public getValues(useInitialValues: boolean) {
        const result: Record<string, any> = useInitialValues ? {...this._initialValues} : {};

        for (const key of Object.keys(this._children)) {
            result[key] = this._children[key].getValues(useInitialValues);
        }

        for (const key of Object.keys(this._collections)) {
            result[key] = this._collections[key].map((item) => item.getValues(useInitialValues));
        }

        return {
            ...result,
            ...this._values
        };
    }

    public setValues(values: Record<string, any>) {
        const separatedProps = separateProps(
            values,
            this._descriptor.initialValueProps,
            this._descriptor.templates
        );

        // Register templates

        this._values = {
            ...this._descriptor.predefinedValues,
            ...separatedProps.options
        };

        this._initialValues = separatedProps.defaults;
    }

    public createChild(descriptor: IOptionNodeDescriptor) {
        if (descriptor.isCollection) {
            if (!this._collections[descriptor.name]) {
                this._collections[descriptor.name] = [];
            }

            const collection = this._collections[descriptor.name];
            const collectionItem = new Option(
                descriptor,
                this.buildOptionFullName(this._fullname, descriptor.name, collection.length)
            );
            collection.push(collectionItem);

            return collectionItem;
        }

        const child = new Option(
            descriptor,
            this.buildOptionFullName(this._fullname, descriptor.name)
        );
        this._children[descriptor.name] = child;

        return child;
    }

    private buildOptionFullName(parentName: string, name: string, index: number | null = null) {
        const fullName = parentName ? parentName + "." + name : name;

        if (index === null) {
            return fullName;
        }

        return fullName + "[" + index + "]";
    }
}

export {
    Option
};
