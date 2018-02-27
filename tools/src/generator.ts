import { template, templateSettings } from "dot";
import { writeFileSync as writeFile } from "fs";
import { join as joinPaths } from "path";
import { removePrefix } from "./helpers";

(Object as any).assign(templateSettings, {
  conditional: /\<#\?(\?)?\s*([\s\S]*?)\s*#\>/g,
  define: /\<###\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)##\>/g,
  encode: /\<#!([\s\S]+?)#\>/g,
  evaluate: /\<#([\s\S]+?)#\>/g,
  interpolate: /\<#=([\s\S]+?)#\>/g,
  iterate: /\<#~\s*(?:#\>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*#\>)/g,
  strip: false,
  use: /\<##([\s\S]+?)#\>/g,
  varname: "it",
});

export default generateFromRawData;
export { generateComponent };

function generateFromRawData(outputDir: string, rawData: any[], baseComponent: string) {
  const data = rawData.map(
    (m) => mapComponent(m, baseComponent)
  );

  generateAll(outputDir, data);
}

function generateAll(outputDir: string, components: IComponentDescriptor[]) {
  components.forEach((c) => {
    writeFile(joinPaths(outputDir, `${c.name}.ts`), generateComponent(c), { encoding: "utf8" });
  });
}

function generateComponent(component: IComponentDescriptor): string {
  const componentModel: IComponentModel = {
    ...component,
    renderedTemplateProps: component.templates ? component.templates.map(templatePropTemplate) : null
  };

  return componentTemplate(componentModel);
}

function mapComponent(raw: any, baseComponent: string): IComponentDescriptor {
  return {
    name: removePrefix(raw.name, "dx"),
    baseComponentPath: baseComponent,
    dxExportPath: raw.exportPath,
    templates: raw.templates ? raw.templates.map((m) => {
      return {
        name: m,
        render: replaceTemplateSuffix(m, "Render"),
        component: replaceTemplateSuffix(m, "Component")
      };
    }) : null
  };
}

function replaceTemplateSuffix(name: string, suffix: string): string {
  return name.replace(/template$/i, suffix);
}

interface ITemplateItem {
  name: string;
  render: string;
  component: string;
}

interface IComponentDescriptor {
  name: string;
  baseComponentPath: string;
  dxExportPath: string;
  templates?: ITemplateItem[];
}

interface IComponentModel extends IComponentDescriptor {
  renderedTemplateProps?: string[];
}

const componentTemplate: (IComponentModel) => string = template(`
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
<#? it.renderedTemplateProps #>
    this.templateProps = [<#= it.renderedTemplateProps.join(', ') #>];
<#?#>  }
}
export { IOptions };
`.trimLeft());

const templatePropTemplate: (ITemplateItem) => string = template(`
    {
      tmplOption: "<#= it.name #>",
      render: "<#= it.render #>",
      component: "<#= it.component #>"
    }
`.trim());
