import { lowercaseFirst, uppercaseFirst } from "./helpers";
import createTempate from "./template";

interface IComponent {
    name: string;
    baseComponentPath: string;
    dxExportPath: string;
    subscribableOptions?: IOption[];
    templates?: string[];
}

interface IOption {
    name: string;
    type: string;
}

function generate(component: IComponent): string {
    const templates = component.templates
        ? component.templates.map(createTemplateModel)
        : null;

    const subscribableOptions = component.subscribableOptions
        ? component.subscribableOptions.map(createSubscribableOptionModel)
        : null;

    const componentModel = {
        ...component,
        widgetName: `dx${uppercaseFirst(component.name)}`,
        optionsName: `I${component.name}Options`,
        hasExtraOptions: !!templates || !!subscribableOptions,
        subscribableOptions,
        templates
    };

    return renderComponent(componentModel);
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

const renderComponent: (model: {
    name: string;
    widgetName: string;
    optionsName: string;
    baseComponentPath: string;
    dxExportPath: string;
    hasExtraOptions: boolean;
    templates?: Array<{
        render: string;
        component: string;
        renderedProp: string;
    }>;
    subscribableOptions?: Array<{
        name: string,
        type: string,
        renderedProp: string
    }>;
}
// tslint:disable:max-line-length
) => string = createTempate(`
import <#= it.widgetName #>, { IOptions <#? !it.hasExtraOptions #>as <#= it.optionsName #> <#?#>} from "devextreme/<#= it.dxExportPath #>";
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

  protected WidgetClass = <#= it.widgetName #>;
<#? it.subscribableOptions #>
  protected defaults = {<#= it.subscribableOptions.map(t => t.renderedProp).join(',') #>
  };
<#?#><#? it.templates #>
  protected templateProps = [<#= it.templates.map(t => t.renderedProp).join(', ') #>];
<#?#>}
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
    <#= it.key #>: "<#= it.value #>"`);

export default generate;
