import TemplatesManager from "../templates-manager";
import { IOptionNodeDescriptor } from "./node";

class OptionConfiguration {
    public readonly descriptor: IOptionNodeDescriptor;
    public readonly values: Record<string, any>;
    public readonly collections: Record<string, OptionConfiguration[]> = {};
    public readonly children: OptionConfiguration[] = [];

    constructor(descriptor: IOptionNodeDescriptor, values: Record<string, any>) {
        this.descriptor = descriptor;
        this.values = values;
    }

    public createChild(descriptor: IOptionNodeDescriptor, values: Record<string, any>) {
        const child = new OptionConfiguration(descriptor, values);

        if (descriptor.isCollection) {
            if (!this.collections[descriptor.name]) {
                this.collections[descriptor.name] = [];
            }

            this.collections[descriptor.name].push(child);
        } else {
            this.children.push(child);
        }

        return child;
    }
}

export {
    OptionConfiguration
};
