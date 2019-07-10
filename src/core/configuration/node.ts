import { ITemplateMeta } from "../template";

interface IOptionNodeDescriptor {
    name: string;
    isCollection: boolean;
    templates: ITemplateMeta[];
    initialValueProps: Record<string, string>;
    predefinedValues: Record<string, any>;
}

enum NodeType {
    Option,
    Template,
    Unknown
}

interface IOptionNode {
    type: NodeType.Option;
    descriptor: IOptionNodeDescriptor;
    values: Record<string, any>;
    getChildren(): INode[];
}

interface ITemplateNode {
    type: NodeType.Template;
    values: Record<string, any>;
}

interface IUnknownNode {
    type: NodeType.Unknown;
}

type INode = IOptionNode | ITemplateNode | IUnknownNode;

export {
    INode,
    IOptionNodeDescriptor,
    NodeType
};
