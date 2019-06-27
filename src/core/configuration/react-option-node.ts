import * as React from "react";
import { IOptionNode, IOptionNodeDescriptor } from "./option-node";

class ReactOptionNode implements IOptionNode {
    private _node: IReactConfigurationElement;

    constructor(node: React.ReactNode) {
        this._node = node as any as IReactConfigurationElement;
    }

    public GetDescriptor(): IOptionNodeDescriptor | null {
        if (!(this._node && this._node.type && this._node.type.OptionName)) {
            return null;
        }

        return {
            name: this._node.type.OptionName,
            isCollection: this._node.type.IsCollectionItem,
            templates: this._node.type.TemplateProps,
            initialValueProps: this._node.type.DefaultsProps,
            predefinedValues: this._node.type.PredefinedProps
        };
    }

    public GetValues(): Record<string, any> {
        if (!(this._node && this._node.props)) {
            return {};
        }

        return this._node.props;
    }

    public GetChildren(): IOptionNode[] {
        if (!(this._node && this._node.props)) {
            return [];
        }

        return React.Children.map(
            this._node.props.children,
            (child) => new ReactOptionNode(child)
        ) || [];
    }
}

interface IReactConfigurationElement {
    type: {
        IsCollectionItem: boolean;
        OptionName: string;
        DefaultsProps: Record<string, string>;
        TemplateProps: any;
        PredefinedProps: Record<string, any>;
    };
    props: any;
}

export {
    ReactOptionNode
};
