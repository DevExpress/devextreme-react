import { createKeyComparator, lowercaseFirst, uppercaseFirst } from "./helpers";
import createTempate from "./template";

interface IComponent {
    name: string;
    baseComponentPath: string;
    dxExportPath: string;
    subscribableOptions?: IOption[];
    templates?: string[];
    propTypings?: IPropTyping[];
}

interface IOption {
    name: string;
    type: string;
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

    return renderComponent({
        name: component.name,
        baseComponentPath: component.baseComponentPath,
        dxExportPath: component.dxExportPath,

        widgetName: `dx${uppercaseFirst(component.name)}`,
        optionsName: `I${component.name}Options`,
        hasExtraOptions: !!templates || !!subscribableOptions,
        subscribableOptions,
        templates,
        renderedPropTypings
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
    if (typing.acceptableValues && typing.acceptableValues.length > 0) {
        types.push(`PropTypes.oneOf([${typing.acceptableValues.join(", ")}])`);
    }
    return {
        propName: typing.propName,
        renderedTypes: types
    };
}

// tslint:disable:max-line-length
const renderComponent: (model: {
    name: string;
    widgetName: string;
    optionsName: string;
    baseComponentPath: string;
    dxExportPath: string;
    hasExtraOptions: boolean;
    templates: {
        render: string;
        component: string;
        renderedProp: string;
    }[]; // tslint:disable-line:array-type
    subscribableOptions: {
        name: string,
        type: string,
        renderedProp: string
    }[]; // tslint:disable-line:array-type
    renderedPropTypings: string[]
}
) => string = createTempate(`
import <#= it.widgetName #>, { IOptions <#? !it.hasExtraOptions #>as <#= it.optionsName #> <#?#>} from "devextreme/<#= it.dxExportPath #>";<#? it.renderedPropTypings #>
import { PropTypes } from "prop-types";<#?#>
import BaseComponent from "<#= it.baseComponentPath #>";
<#? it.hasExtraOptions #>
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
};<#?#>
export { <#= it.name #>, <#= it.optionsName #> };
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

const renderObjectEntry: (model: {
    key: string;
    value: string;
}) => string = createTempate(`
    <#= it.key #>: "<#= it.value #>"
`.trimRight());

// tslint:disable:max-line-length
const renderPropTyping: (model: IRenderedPropTyping) => string = createTempate(`
  <#= it.propName #>: <#? it.renderedTypes.length === 1 #><#= it.renderedTypes[0] #><#??#>PropTypes.oneOfType([
    <#= it.renderedTypes.join(',\\n    ') #>
  ])<#?#>
`.trimRight());
// tslint:enable:max-line-length

export default generate;
export {
    IComponent,
    IPropTyping
};
