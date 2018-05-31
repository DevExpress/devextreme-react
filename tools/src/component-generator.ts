import {
    createKeyComparator,
    isNotEmptyArray,
    lowercaseFirst,
    uppercaseFirst
} from "./helpers";

import {
    createStrictTemplate,
    createTempate,
    NEWLINE as NL,
    TAB
} from "./template";

interface IComponent {
    name: string;
    baseComponentPath: string;
    configComponentPath: string;
    dxExportPath: string;
    subscribableOptions?: IOption[];
    nestedComponents?: INestedComponent[];
    templates?: string[];
    propTypings?: IPropTyping[];
}

interface INestedComponent {
    className: string;
    optionName: string;
    owner: string;
    options: IOption[];
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

interface IRenderedPropTyping {
    propName: string;
    renderedTypes: string[];
}

function generate(component: IComponent): string {
    const templates = component.templates
        ? component.templates.map(createTemplateModel)
        : null;

    const subscribableOptions = component.subscribableOptions
        ? component.subscribableOptions.map(createSubscribableOptionModel)
        : null;

    const renderedPropTypings = component.propTypings
        ? component.propTypings
            .sort(createKeyComparator<IPropTyping>((p) => p.propName))
            .map((t) => renderPropTyping(createPropTypingModel(t)))
        : null;

    const nestedComponents = component.nestedComponents
        ? component.nestedComponents
            .sort(createKeyComparator<INestedComponent>((o) => o.optionName))
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
                return {
                    className: c.className,
                    optionName: c.optionName,
                    ownerName: c.owner,
                    interfaceName: `I${uppercaseFirst(c.optionName)}Options`,
                    rendered: renderObject(options, 0),
                    renderedSubscribableOptions,
                    isCollectionItem: c.isCollectionItem
                };
            })
        : null;

    const optionsName = `I${component.name}Options`;
    const exportNames = [ component.name, optionsName ];
    if (isNotEmptyArray(nestedComponents)) {
        nestedComponents.forEach((opt) => {
            exportNames.push(opt.className);
        });
    }

    const hasExtraOptions = !!templates || !!subscribableOptions;
    const widgetName =  `dx${uppercaseFirst(component.name)}`;

    return renderModule({
        renderedImports: renderImports({
            dxExportPath: component.dxExportPath,
            baseComponentPath: component.baseComponentPath,
            configComponentPath: component.configComponentPath,
            widgetName,
            optionsAliasName: hasExtraOptions ? undefined : optionsName,
            hasExtraOptions,
            hasNestedComponents: isNotEmptyArray(nestedComponents),
            hasPropTypings: isNotEmptyArray(renderedPropTypings)
        }),

        renderedOptionsInterface: !hasExtraOptions ? undefined :  renderOptionsInterface({
            optionsName,
            subscribableOptions,
            templates
        }),
        className: component.name,

        widgetName,
        optionsName,
        hasExtraOptions,
        subscribableOptions,
        templates,
        nestedComponents,
        renderedPropTypings,
        renderedExports: renderExports(exportNames)
    });
}

function createTemplateModel(name: string) {
    const model = {
        render: formatTemplatePropName(name, "Render"),
        component: formatTemplatePropName(name, "Component"),
    };

    return { ...model, renderedProp: renderTemplateOption({ name, ...model }) };
}

function formatTemplatePropName(name: string, suffix: string): string {
    return lowercaseFirst(name.replace(/template$/i, suffix));
}

function createSubscribableOptionModel(option: IOption) {
    const name = `default${uppercaseFirst(option.name)}`;
    return {
        name,
        type: option.type,
        renderedProp: renderObjectEntry({
            key: name,
            value: option.name
        })
    };
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

const renderImports: (model: {
    dxExportPath: string;
    configComponentPath: string;
    baseComponentPath: string;
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

`import BaseComponent from "<#= it.baseComponentPath #>";` + `\n` +

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
    subscribableOptions: Array<{
        name: string;
        type: string;
    }>;
}) => string = createTempate(
`interface <#= it.optionsName #> extends IOptions {` + `\n` +

`<#~ it.templates :template #>` +
    `  <#= template.render #>?: (props: any) => React.ReactNode;` + `\n` +
    `  <#= template.component #>?: React.ComponentType<any>;` + `\n` +
`<#~#>` +

`<#~ it.subscribableOptions :option #>` +
    `  <#= option.name #>?: <#= option.type #>;` + `\n` +
`<#~#>` +

`}`
);

// tslint:disable:max-line-length
const renderModule: (model: {
    renderedImports: string;
    renderedOptionsInterface: string;
    renderedExports: string;
    className: string;
    widgetName: string;
    optionsName: string;
    hasExtraOptions: boolean;
    templates: Array<{
        render: string;
        component: string;
        renderedProp: string;
    }>;
    subscribableOptions: Array<{
        name: string;
        type: string;
        renderedProp: string;
    }>;
    nestedComponents: Array<{
        optionName: string;
        className: string;
        ownerName: string;
        interfaceName: string;
        rendered: string;
        renderedSubscribableOptions: string;
        isCollectionItem: boolean;
    }>;
    renderedPropTypings: string[];
}) => string = createTempate(
`<#= it.renderedImports #>` + `\n` +

`<#? it.renderedOptionsInterface #>` +
    `<#= it.renderedOptionsInterface #>` + `\n` + `\n` +
`<#?#>` +

`class <#= it.className #> extends BaseComponent<<#= it.optionsName #>> {

  public get instance(): <#= it.widgetName #> {
    return this._instance;
  }

  protected _WidgetClass = <#= it.widgetName #>;
<#? it.subscribableOptions #>
  protected _defaults = {<#= it.subscribableOptions.map(t => t.renderedProp).join(',') #>
  };
<#?#><#? it.templates #>
  protected _templateProps = [<#= it.templates.map(t => t.renderedProp).join(', ') #>];
<#?#>}` + `\n` +

`<#? it.renderedPropTypings #>` +
    `(<#= it.className #> as any).propTypes = {` + `\n` +
        `<#= it.renderedPropTypings.join(',\\n') #>` + `\n` +
    `};` + `\n` +
`<#?#>` +

`<#? it.nestedComponents #>` +
    `// tslint:disable:max-classes-per-file` +
    `<#~ it.nestedComponents :nested #>` + `\n` + `\n` +
        `class <#= nested.className #> extends NestedOption<<#= nested.rendered #>> {` + `\n` +
        `  public static OwnerType = <#= nested.ownerName #>;` + `\n` +
        `  public static OptionName = "<#= nested.optionName #>";` + `\n` +

        `<#? nested.isCollectionItem #>` +
        `  public static IsCollectionItem = true;` + `\n` +
        `<#?#>` +

        `<#? nested.renderedSubscribableOptions #>` +
        `  public static DefaultsProps = {<#= nested.renderedSubscribableOptions.join(',') #>` + `\n` +
        `  };` + `\n` +
        `<#?#>` +

    `}<#~#>` + `\n` + `\n` +
`<#?#>` +

`export {
<#= it.renderedExports #>
};
`);
// tslint:enable:max-line-length

const renderTemplateOption: (model: {
    name: string;
    render: string;
    component: string;
}) => string = createTempate(`
  {
    tmplOption: "<#= it.name #>",
    render: "<#= it.render #>",
    component: "<#= it.component #>"
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
    IPropTyping
};
