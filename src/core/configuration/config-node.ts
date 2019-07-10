import { separateProps } from "../widget-config";
import { IOptionNodeDescriptor } from "./node";
import { buildOptionFullname } from "./utils";

class ConfigNode {
    public readonly fullname: string;
    public readonly descriptor: IOptionNodeDescriptor;
    public readonly values: Record<string, any>;
    public readonly initialValues: Record<string, any>;
    public readonly templates: Record<string, any>;
    public readonly collections: Record<string, ConfigNode[]> = {};
    public readonly children: Record<string, ConfigNode> = {};

    public readonly rawValues: Record<string, any>; // Refactor templates-manager.add to remove

    constructor(descriptor: IOptionNodeDescriptor, rawValues: Record<string, any>, fullname: string) {
        this.fullname = fullname;
        this.descriptor = descriptor;
        const separatedValues = separateProps(
            rawValues,
            descriptor.initialValueProps,
            descriptor.templates
        );

        this.values = separatedValues.options;
        this.initialValues = separatedValues.defaults;
        this.templates = separatedValues.templates;
        this.rawValues = rawValues;
    }

    public createChild(descriptor: IOptionNodeDescriptor, values: Record<string, any>) {
        let child: ConfigNode;
        if (descriptor.isCollection) {
            let collection = this.collections[descriptor.name];
            if (!collection) {
                collection = [];
                this.collections[descriptor.name] = collection;
            }

            child = new ConfigNode(
                descriptor,
                values,
                buildOptionFullname(this.fullname, descriptor.name) + "[" + collection.length + "]"
            );

            collection.push(child);
        } else {
            child = new ConfigNode(
                descriptor,
                values,
                buildOptionFullname(this.fullname, descriptor.name)
            );

            this.children[child.descriptor.name] = child;
        }

        return child;
    }
}

export {
    ConfigNode
};
