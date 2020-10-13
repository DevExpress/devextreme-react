import { createTempate } from "./template";

interface IReExport {
  name: string;
  path: string;
}

const constParts = `export { Template } from "./core/template";
`;

function generate(paths: IReExport[]): string {
  return constParts.concat(render(paths));
}

const render: (model: IReExport[]) => string = createTempate(`
<#~ it :reExport #>export { <#= reExport.name #> } from "<#= reExport.path #>";
<#~#>
`.trim());

export default generate;
export {
  IReExport,
};
