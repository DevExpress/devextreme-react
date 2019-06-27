interface IOptionNode {
    getDescriptor(): IOptionNodeDescriptor | null;
    getValues(): Record<string, any>;
    getChildren(): IOptionNode[];
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
