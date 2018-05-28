import { createKeyComparator, isNotEmptyArray, lowercaseFirst, uppercaseFirst } from "./helpers";
import createTempate from "./template";

interface IComponent {
    name: string;
    baseComponentPath: string;
    configComponentPath: string;
    dxExportPath: string;
    subscribableOptions?: IOption[];
    nestedOptions?: IOption[];
    templates?: string[];
    propTypings?: IPropTyping[];
}

interface IOption {
    name: string;
    type?: string;
    nested?: IOption[];
    isCollectionItem?: boolean;
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

    const nestedOptions = component.nestedOptions
        ? component.nestedOptions
            .sort(createKeyComparator<IOption>((o) => o.name))
            .map((o) => ({
                name: o.name,
                className: component.name + uppercaseFirst(o.name),
                interfaceName: `I${uppercaseFirst(o.name)}Options`,
                rendered: renderObject(o.nested, 0),
                isCollectionItem: o.isCollectionItem
            }))
        : null;

    const optionsName = `I${component.name}Options`;
    const exportNames = [ component.name, optionsName ];
    if (isNotEmptyArray(nestedOptions)) {
        nestedOptions.forEach((opt) => {
            exportNames.push(opt.className);
        });
    }

    return renderComponent({
        name: component.name,
        baseComponentPath: component.baseComponentPath,
        configComponentPath: component.configComponentPath,
        dxExportPath: component.dxExportPath,

        widgetName: `dx${uppercaseFirst(component.name)}`,
        optionsName,
        hasExtraOptions: !!templates || !!subscribableOptions,
        subscribableOptions,
        templates,
        nestedOptions,
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

const renderComponent: (model: {
    name: string;
    widgetName: string;
    optionsName: string;
    baseComponentPath: string;
    configComponentPath: string;
    dxExportPath: string;
    hasExtraOptions: boolean;
    templates: Array<{
        render: string;
        component: string;
        renderedProp: string;
    }>;
    subscribableOptions: Array<{
        name: string,
        type: string,
        renderedProp: string
    }>
    nestedOptions: Array<{
        name: string;
        className: string;
        interfaceName: string;
        rendered: string;
        isCollectionItem: boolean;
    }>;
    renderedPropTypings: string[],
    renderedExports: string
}
) => string = createTempate(`
import <#= it.widgetName #>, {
    IOptions<#? !it.hasExtraOptions #> as <#= it.optionsName #><#?#>
} from "devextreme/<#= it.dxExportPath #>";

<#? it.renderedPropTypings #>import { PropTypes } from "prop-types";
<#?#>import BaseComponent from "<#= it.baseComponentPath #>";
<#? it.nestedOptions #>import NestedOption from "<#= it.configComponentPath #>";
<#?#><#? it.hasExtraOptions #>
interface <#= it.optionsName #> extends IOptions {<#~ it.templates :template #>
  <#= template.render #>?: (props: any) => React.ReactNode;
  <#= template.component #>?: React.ComponentType<any>;<#~#><#~ it.subscribableOptions :option #>
  <#= option.name #>?: <#= option.type #>;<#~#>
}
<#?#>
class <#= it.name #> extends BaseComponent<<#= it.optionsName #>> {

  public get instance(): <#= it.widgetName #> {
    return this._instance;
  }

  protected _WidgetClass = <#= it.widgetName #>;
<#? it.subscribableOptions #>
  protected _defaults = {<#= it.subscribableOptions.map(t => t.renderedProp).join(',') #>
  };
<#?#><#? it.templates #>
  protected _templateProps = [<#= it.templates.map(t => t.renderedProp).join(', ') #>];
<#?#>}<#? it.renderedPropTypings #>
(<#= it.name #> as any).propTypes = {<#= it.renderedPropTypings.join(',') #>
};<#?#><#? it.nestedOptions #>
// tslint:disable:max-classes-per-file<#~ it.nestedOptions :opt #>

class <#= opt.className #> extends NestedOption<<#= opt.rendered #>> {<#? opt.isCollectionItem #>
  public static IsCollectionItem = true;<#?#>
  public static OwnerType = <#= it.name #>;
  public static OptionName = "<#= opt.name #>";
}<#~#>
<#?#>
export {
<#= it.renderedExports #>
};
`.trimLeft());
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
const renderPropTyping: (model: IRenderedPropTyping) => string = createTempate(`
  <#= it.propName #>: <#? it.renderedTypes.length === 1 #><#= it.renderedTypes[0] #><#??#>PropTypes.oneOfType([
    <#= it.renderedTypes.join(',\\n    ') #>
  ])<#?#>
`.trimRight());
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
    IOption,
    IPropTyping
};
