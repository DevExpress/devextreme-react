import * as React from "react";

import { ITemplateMeta, Template } from "../template";
import { INode, NodeType } from "./node";

function createNode(element: React.ReactChild): INode {
    if (typeof element === "string" || typeof element === "number") {
        return {
            type: NodeType.Unknown,
            getChildren: () => []
        };
    }

    if (element.type === Template) {
        return {
            type: NodeType.Template,
            values: element.props,
            getChildren: () => createChildNodes(element.props.children)
        };
    }

    const configuration = element.type as any as IConfigurationType;

    if (configuration.OptionName) {
        return {
            type: NodeType.Option,
            descriptor: {
                name: configuration.OptionName,
                isCollection: configuration.IsCollectionItem,
                templates: configuration.TemplateProps,
                initialValueProps: configuration.DefaultsProps,
                predefinedValues: configuration.PredefinedProps
            },
            values: element.props,
            getChildren: () => createChildNodes(element.props.children)
        };
    }

    return {
        type: NodeType.Unknown,
        getChildren: () => createChildNodes(element.props.children)
    };
}

function createChildNodes(children: React.ReactNode): INode[] {
    return React.Children.map(children, (child) => createNode(child)) || [];
}

interface IConfigurationType {
    OptionName: string;
    IsCollectionItem: boolean;
    DefaultsProps: Record<string, string>;
    TemplateProps: ITemplateMeta[];
    PredefinedProps: Record<string, any>;
}

export {
    createNode,
    createChildNodes
};
