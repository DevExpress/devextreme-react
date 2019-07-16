import { ITemplateMeta, Template } from "../../template";

enum ElementType {
    Option,
    Template,
    Unknown
}

interface IExpectedChild {
    optionName: string;
    isCollectionItem: boolean;
}

interface IOptionDescriptor {
    isCollection: boolean;
    name: string;
    templates: ITemplateMeta[];
    initialValuesProps: Record<string, string>;
    predefinedValuesProps: Record<string, any>;
    expectedChildren: Record<string, IExpectedChild>;
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

function getElementInfo(
    element: React.ReactChild,
    parentExpectedChildren: Record<string, IExpectedChild>
): IElement {
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
        let name = elementDescriptor.OptionName;
        let isCollectionItem =  elementDescriptor.IsCollectionItem;

        const expectation = parentExpectedChildren && parentExpectedChildren[name];
        if (expectation) {
            isCollectionItem = expectation.isCollectionItem;
            if (expectation.optionName) {
                name = expectation.optionName;
            }
        }

        return {
            type: ElementType.Option,
            descriptor: {
                name,
                isCollection: isCollectionItem,
                templates: elementDescriptor.TemplateProps || [],
                initialValuesProps: elementDescriptor.DefaultsProps || {},
                predefinedValuesProps: elementDescriptor.PredefinedProps || {},
                expectedChildren: elementDescriptor.ExpectedChildren || {}
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
    ExpectedChildren: Record<string, IExpectedChild>;
}

export {
    getElementInfo,
    ElementType,
    IElement,
    IOptionElement,
    IExpectedChild
};
