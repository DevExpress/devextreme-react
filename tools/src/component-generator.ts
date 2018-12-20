import { createTempate, L1, L2, L3, L4 } from "./template";

import {
    createKeyComparator,
    isNotEmptyArray,
    lowercaseFirst,
    uppercaseFirst
} from "./helpers";

interface IComponent {
    name: string;
    baseComponentPath: string;
    extensionComponentPath: string;
    configComponentPath: string;
    dxExportPath: string;
    expectedChildren: IExpectedChild[];
    isExtension?: boolean;
    subscribableOptions?: IOption[];
    nestedComponents?: INestedComponent[];
    templates?: string[];
    propTypings?: IPropTyping[];
}

interface INestedComponent {
    className: string;
    optionName: string;
    owners: string[];
    options: IOption[];
    templates: string[];
    expectedChildren: IExpectedChild[];
    predefinedProps?: Record<string, any>;
    isCollectionItem?: boolean;
}

interface IOption {
    name: string;
    type?: string;
    nested?: IOption[];
    isSubscribable?: boolean;
}

interface IPropTyping {
    propName: string;
    types: string[];
    acceptableValues?: string[];
}

interface IExpectedChild {
    componentName: string;
    optionName: string;
    isCollectionItem: boolean;
}

interface IRenderedPropTyping {
    propName: string;
    renderedTypes: string[];
}

const TYPE_KEY_FN = "(data: any) => string";
const TYPE_RENDER = "(props: any) => React.ReactNode";
const TYPE_COMPONENT = "React.ComponentType<any>";

function generateReExport(path: string, fileName: string): string {
    return renderReExport({ path, fileName });
}

const renderReExport: (model: {path: string, fileName: string}) => string = createTempate(
`/** @deprecated Use 'devextreme-react/<#= it.fileName #>' file instead */\n` +
`export * from "<#= it.path #>";\n` +
`export { default } from "<#= it.path #>";\n`
);

function generate(component: IComponent): string {
    const nestedComponents = component.nestedComponents
        ? component.nestedComponents
            .sort(createKeyComparator<INestedComponent>((o) => o.className))
            .map((c) => {
                const options = [...c.options];
                const nestedSubscribableOptions = options.filter((o) => o.isSubscribable);
                let renderedSubscribableOptions = null;
                if (isNotEmptyArray(nestedSubscribableOptions)) {

                    options.push(...nestedSubscribableOptions.map((o) => ({
                        ...o,
                        name: `default${uppercaseFirst(o.name)}`
                    })));

                    renderedSubscribableOptions = nestedSubscribableOptions.map((o) =>
                        renderObjectEntry({
                            key: `default${uppercaseFirst(o.name)}`,
                            value: o.name
                        })
                    );
                }
                const nestedTemplates = createTemplateDto(c.templates);
                if (nestedTemplates) {
                    nestedTemplates.forEach((t) => {
                        options.push({
                            name: t.render,
                            type: TYPE_RENDER
                        }, {
                            name: t.component,
                            type: TYPE_COMPONENT
                        }, {
                            name: t.keyFn,
                            type: TYPE_KEY_FN
                        });
                    });
                }

                let predefinedProps;
                if (c.predefinedProps) {
                    predefinedProps = Object.keys(c.predefinedProps).map((name) => ({
                        name,
                        value: c.predefinedProps[name]
                    }));
                }

                return {
                    className: c.className,
                    optionName: c.optionName,
                    ownerName: c.owners,
                    renderedType: renderObject(options, 0),
                    renderedSubscribableOptions,
                    renderedTemplateProps: nestedTemplates && nestedTemplates.map(renderTemplateOption),
                    isCollectionItem: c.isCollectionItem,
                    predefinedProps,
                    expectedChildren: c.expectedChildren,
                    owners: c.owners
                };
            })
        : null;

    const optionsName = `I${component.name}Options`;
    const exportNames: string[] = [
        component.name,
        optionsName
    ];

    if (isNotEmptyArray(component.nestedComponents)) {
        component.nestedComponents.forEach((c) => {
            exportNames.push(c.className);
        });
    }

    const templates = createTemplateDto(component.templates);
    const defaultProps = component.subscribableOptions
        ? component.subscribableOptions.map((o) => ({
            name: `default${uppercaseFirst(o.name)}`,
            type: o.type,
            actualOptionName: o.name
        }))
        : null;

    const hasExtraOptions = !component.isExtension;
    const widgetName =  `dx${uppercaseFirst(component.name)}`;

    const renderedPropTypings = component.propTypings
        ? component.propTypings
            .sort(createKeyComparator<IPropTyping>((p) => p.propName))
            .map((t) => renderPropTyping(createPropTypingModel(t)))
        : null;

    return renderModule({

        renderedImports: renderImports({
            dxExportPath: component.dxExportPath,
            baseComponentPath: component.isExtension ? component.extensionComponentPath : component.baseComponentPath,
            baseComponentName: component.isExtension ? "ExtensionComponent" : "Component",
            configComponentPath: component.configComponentPath,
            widgetName,
            optionsAliasName: hasExtraOptions ? undefined : optionsName,
            hasExtraOptions,
            hasNestedComponents: isNotEmptyArray(nestedComponents),
            hasPropTypings: isNotEmptyArray(renderedPropTypings)
        }),

        renderedOptionsInterface: !hasExtraOptions ? undefined : renderOptionsInterface({
            optionsName,
            defaultProps,
            templates
        }),

        renderedComponent: renderComponent({
            className: component.name,
            widgetName,
            optionsName,
            renderedTemplateProps: templates && templates.map(renderTemplateOption),
            renderedDefaultProps: defaultProps && defaultProps.map((o) =>
                renderObjectEntry({
                    key: o.name,
                    value: o.actualOptionName
                })
            ),
            renderedPropTypings,
            expectedChildren: component.expectedChildren
        }),

        renderedNestedComponents: nestedComponents && nestedComponents.map(renderNestedComponent),

        defaultExport: component.name,
        renderedExports: renderExports(exportNames)
    });
}

function createTemplateDto(templates: string[]) {
    return templates
    ? templates.map((actualOptionName) => ({
        actualOptionName,
        render: formatTemplatePropName(actualOptionName, "Render"),
        component: formatTemplatePropName(actualOptionName, "Component"),
        keyFn: formatTemplatePropName(actualOptionName, "KeyFn")
    }))
    : null;
}

function formatTemplatePropName(name: string, suffix: string): string {
    return lowercaseFirst(name.replace(/template$/i, suffix));
}

function createPropTypingModel(typing: IPropTyping): IRenderedPropTyping {
    const types = typing.types.map((t) => "PropTypes." + t);
    if (isNotEmptyArray(typing.acceptableValues)) {
        types.push(`PropTypes.oneOf([\n    ${typing.acceptableValues.join(",\n    ")}\n  ])`);
    }
    return {
        propName: typing.propName,
        renderedTypes: types
    };
}

// tslint:disable:max-line-length

const renderModule: (model: {
    renderedImports: string;
    renderedOptionsInterface: string;
    renderedComponent: string;
    renderedNestedComponents: string[];
    defaultExport: string;
    renderedExports: string;
}) => string = createTempate(
`<#= it.renderedImports #>` + `\n` +

`<#? it.renderedOptionsInterface #>` +
    `<#= it.renderedOptionsInterface #>` + `\n` + `\n` +
`<#?#>` +

`<#= it.renderedComponent #>` +

`<#? it.renderedNestedComponents #>` +
    `// tslint:disable:max-classes-per-file` +
    `<#~ it.renderedNestedComponents :nestedComponent #>` + `\n\n` +
        `<#= nestedComponent #>` +
    `<#~#>` + `\n\n` +
`<#?#>` +

`export default <#= it.defaultExport #>;` + `\n` +
`export {
<#= it.renderedExports #>
};
`);
// tslint:enable:max-line-length

const renderImports: (model: {
    dxExportPath: string;
    configComponentPath: string;
    baseComponentPath: string;
    baseComponentName: string;
    widgetName: string;
    optionsAliasName: string;
    hasExtraOptions: boolean;
    hasPropTypings: boolean;
    hasNestedComponents: boolean;
}) => string = createTempate(
`import <#= it.widgetName #>, {
    IOptions` + `<#? it.optionsAliasName #> as <#= it.optionsAliasName #><#?#>` + `\n` +
`} from "devextreme/<#= it.dxExportPath #>";` + `\n` + `\n` +

`<#? it.hasPropTypings #>` +
    `import { PropTypes } from "prop-types";` + `\n` +
`<#?#>` +

`import { <#= it.baseComponentName #> as BaseComponent` +
    `<#? it.hasExtraOptions #>` +
        `, IHtmlOptions` +
    `<#?#>` +
` } from "<#= it.baseComponentPath #>";` + `\n` +

`<#? it.hasNestedComponents #>` +
    `import NestedOption from "<#= it.configComponentPath #>";` + `\n` +
`<#?#>`
);

const renderOptionsInterface: (model: {
    optionsName: string;
    templates: Array<{
        render: string;
        component: string;
    }>;
    defaultProps: Array<{
        name: string;
        type: string;
    }>;
}) => string = createTempate(
`interface <#= it.optionsName #> extends IOptions, IHtmlOptions {` + `\n` +

`<#~ it.templates :template #>` +
    `  <#= template.render #>?: ${TYPE_RENDER};` + `\n` +
    `  <#= template.component #>?: ${TYPE_COMPONENT};` + `\n` +
    `  <#= template.keyFn #>?: ${TYPE_KEY_FN};` + `\n` +
`<#~#>` +

`<#~ it.defaultProps :prop #>` +
    `  <#= prop.name #>?: <#= prop.type #>;` + `\n` +
`<#~#>` +

`}`
);

const renderComponent: (model: {
    className: string;
    widgetName: string;
    optionsName: string;
    expectedChildren: IExpectedChild[];
    renderedDefaultProps: string[];
    renderedTemplateProps: string[];
    renderedPropTypings: string[];
}) => string = createTempate(
`class <#= it.className #> extends BaseComponent<<#= it.optionsName #>> {

  public get instance(): <#= it.widgetName #> {
    return this._instance;
  }

  protected _WidgetClass = <#= it.widgetName #>;\n` +

`<#? it.renderedDefaultProps #>` +
L1 + `protected _defaults = {<#= it.renderedDefaultProps.join(',') #>` +
L1 +  `};\n` +
`<#?#>` +

`<#? it.expectedChildren #>` +
L1 + `protected _expectedChildren = {` +

`<#~ it.expectedChildren : child #>` +
L2 + `<#= child.componentName #>:` +
    ` { optionName: "<#= child.optionName #>", isCollectionItem: <#= !!child.isCollectionItem #> },` +
`<#~#>` + `\b` +

L1 +  `};\n` +
`<#?#>` +

`<#? it.renderedTemplateProps #>
  protected _templateProps = [<#= it.renderedTemplateProps.join(', ') #>];
<#?#>}` + `\n` +

`<#? it.renderedPropTypings #>` +
    `(<#= it.className #> as any).propTypes = {` + `\n` +
        `<#= it.renderedPropTypings.join(',\\n') #>` + `\n` +
    `};` + `\n` +
`<#?#>`
);

const renderNestedComponent: (model: {
    className: string;
    optionName: string;
    isCollectionItem: boolean;
    predefinedProps: Array<{
        name: string;
        value: any;
    }>;
    expectedChildren: IExpectedChild[];
    renderedType: string;
    renderedSubscribableOptions: string[];
    renderedTemplateProps: string[];
    owners: string[];
}) => string = createTempate(
`// owners:\n` +
`<#~ it.owners : owner #>` +
    `// <#= owner #>\n` +
`<#~#>` +

`class <#= it.className #> extends NestedOption<<#= it.renderedType #>> {` +
L1 + `public static OptionName = "<#= it.optionName #>";` +

`<#? it.isCollectionItem #>` +
    L1 + `public static IsCollectionItem = true;` +
`<#?#>` +

`<#? it.renderedSubscribableOptions #>` +
    L1 + `public static DefaultsProps = {<#= it.renderedSubscribableOptions.join(',') #>` +
    L1 + `};` +
`<#?#>` +

`<#? it.expectedChildren #>` +
    L1 + `public static ExpectedChildren = {` +

    `<#~ it.expectedChildren : child #>` +
    L2 + `<#= child.componentName #>:` +
        ` { optionName: "<#= child.optionName #>", isCollectionItem: <#= !!child.isCollectionItem #> },` +
    `<#~#>` + `\b` +

    L1 +  `};` +
`<#?#>` +

`<#? it.renderedTemplateProps #>` +
    L1 + `public static TemplateProps = [<#= it.renderedTemplateProps.join(', ') #>];` +
`<#?#>` +

`<#? it.predefinedProps #>` +
    L1 + `public static PredefinedProps = {` +
        `<#~ it.predefinedProps : prop #>` +
            L2 + `<#= prop.name #>: "<#= prop.value #>",` +
        `<#~#>` + `\b` +
    L1 + `};` +
`<#?#>` +

`\n}`
);

const renderTemplateOption: (model: {
    actualOptionName: string;
    render: string;
    component: string;
}) => string = createTempate(`
  {
    tmplOption: "<#= it.actualOptionName #>",
    render: "<#= it.render #>",
    component: "<#= it.component #>",
    keyFn: "<#= it.keyFn #>"
  }
`.trim());

// tslint:disable:max-line-length
const renderPropTyping: (model: IRenderedPropTyping) => string = createTempate(
`  <#= it.propName #>: ` +

`<#? it.renderedTypes.length === 1 #>` +
    `<#= it.renderedTypes[0] #>` +

`<#??#>` +

    `PropTypes.oneOfType([` + `\n` +
    `    <#= it.renderedTypes.join(',\\n    ') #>` + `\n` +
    `  ])` +
`<#?#>`
);
// tslint:enable:max-line-length

const renderObjectEntry: (model: {
    key: string;
    value: string;
}) => string = createTempate(`
    <#= it.key #>: "<#= it.value #>"
`.trimRight());

function renderObject(props: IOption[], indent: number): string {
    let result = "{";

    indent += 1;

    props.forEach((opt) => {
        result += "\n" + getIndent(indent) + opt.name + "?: ";
        if (isNotEmptyArray(opt.nested)) {
            result += renderObject(opt.nested, indent);
        } else {
            result += opt.type;
        }
        result += ";";
    });

    indent -= 1;
    result +=  "\n" + getIndent(indent) + "}";
    return result;
}

function getIndent(indent: number) {
    return Array(indent * 2 + 1).join(" ");
}

function renderExports(exportsNames: string[]) {
    return exportsNames
        .map((exportName) => getIndent(1) + exportName)
        .join(",\n");
}

export default generate;
export {
    IComponent,
    INestedComponent,
    IOption,
    IPropTyping,
    generateReExport
};
