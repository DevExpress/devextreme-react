import { ITemplateMeta, Template } from "../../template";

enum ElementType {
    Option,
    Template,
    Unknown
}

interface IOptionDescriptor {
    isCollection: boolean;
    name: string;
    templates: ITemplateMeta[];
    initialValuesProps: Record<string, string>;
    predefinedValuesProps: Record<string, any>;
}

interface IOptionElement {
    type: ElementType.Option;
    descriptor: IOptionDescriptor;
    props: Record<string, any>;
}

interface ITemplateElement {
    type: ElementType.Template;
    props: Record<string, any>;
}

interface IUnknownElement {
    type: ElementType.Unknown;
}

type IElement = IOptionElement | ITemplateElement | IUnknownElement;

function getElementInfo(element: React.ReactChild): IElement {
    if (!element || typeof element === "string" || typeof element === "number") {
        return {
            type: ElementType.Unknown
        };
    }

    if (element.type === Template) {
        return {
            type: ElementType.Template,
            props: element.props
        };
    }

    const elementDescriptor = element.type as any as IElementDescriptor;

    if (elementDescriptor.OptionName) {
        return {
            type: ElementType.Option,
            descriptor: {
                name: elementDescriptor.OptionName,
                isCollection: elementDescriptor.IsCollectionItem,
                templates: elementDescriptor.TemplateProps || [],
                initialValuesProps: elementDescriptor.DefaultsProps || {},
                predefinedValuesProps: elementDescriptor.PredefinedProps || {}
            },
            props: element.props
        };
    }

    return {
        type: ElementType.Unknown
    };
}

interface IElementDescriptor {
    OptionName: string;
    IsCollectionItem: boolean;
    DefaultsProps: Record<string, string>;
    TemplateProps: ITemplateMeta[];
    PredefinedProps: Record<string, any>;
}

export {
    getElementInfo,
    ElementType,
    IElement,
    IOptionElement
};
