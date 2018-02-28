import createTempate from "./template";

interface IComponent {
    name: string;
    baseComponentPath: string;
    dxExportPath: string;
    templates?: string[];
}

function generate(component: IComponent): string {
    const componentModel = {
        ...component,
        optionsName: `I${component.name}Options`,
        templates: component.templates ? component.templates.map(createTemplateModel) : null
    };

    return renderComponent(componentModel);
}

function createTemplateModel(name: string) {
    const model = {
        name,
        render: replaceTemplateSuffix(name, "Render"),
        component: replaceTemplateSuffix(name, "Component"),
    };

    return { ...model, renderedProp: renderTemplateProp(model) };
}

function replaceTemplateSuffix(name: string, suffix: string): string {
    return name.replace(/template$/i, suffix);
}

const renderComponent: (model: {
    name: string;
    optionsName: string;
    baseComponentPath: string;
    dxExportPath: string;
    templates?: Array<{
        name: string;
        render: string;
        component: string;
        renderedProp: string;
    }>;
}
) => string = createTempate(`
import Widget, { IOptions <#? !it.templates #>as <#= it.optionsName #> <#?#>} from "devextreme/<#= it.dxExportPath #>";
import BaseComponent from "<#= it.baseComponentPath #>";
<#? it.templates #>
interface <#= it.optionsName #> extends IOptions {<#~ it.templates :template #>
    <#= template.render #>?: (props: any) => React.ReactNode;
    <#= template.component #>?: React.ComponentType<any>;<#~#>
}<#?#>
class <#= it.name #> extends BaseComponent<<#= it.optionsName #>> {

  constructor(props: <#= it.optionsName #>) {
    super(props);
    this.WidgetClass = Widget;
<#? it.templates #>
    this.templateProps = [<#= it.templates.map(t => t.renderedProp).join(', ') #>];
<#?#>  }
}
export { <#= it.name #>, <#= it.optionsName #> };
`.trimLeft());

const renderTemplateProp: (model: {
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

export default generate;
