interface IOptionNode {
    GetDescriptor(): IOptionNodeDescriptor | null;
    GetValues(): Record<string, any>;
    GetChildren(): IOptionNode[];
}

interface IOptionNodeDescriptor {
    name: string;
    isCollection: boolean;
    templates: [];
    initialValueProps: Record<string, string>;
    predefinedValues: Record<string, any>;
}

export {
    IOptionNode,
    IOptionNodeDescriptor
};
