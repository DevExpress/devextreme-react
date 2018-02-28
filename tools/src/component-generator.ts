import { createTempate } from "./template";

export interface IComponent {
    name: string;
    baseComponentPath: string;
    dxExportPath: string;
    templates?: string[];
}

export function generate(component: IComponent): string {
    const componentModel = {
        ...component,
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
import Widget, { IOptions <#? it.templates #>as WidgetOptions <#?#>} from "devextreme/<#= it.dxExportPath #>";
import BaseComponent from "<#= it.baseComponentPath #>";
<#? it.templates #>
interface IOptions extends WidgetOptions {<#~ it.templates :template #>
    <#= template.render #>?: (props: any) => React.ReactNode;
    <#= template.component #>?: React.ComponentType<any>;<#~#>
}<#?#>
export default class <#= it.name #> extends BaseComponent<IOptions> {

  constructor(props: IOptions) {
    super(props);
    this.WidgetClass = Widget;
<#? it.templates #>
    this.templateProps = [<#= it.templates.map(t => t.renderedProp).join(', ') #>];
<#?#>  }
}
export { IOptions as I<#= it.name #>Options };
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
