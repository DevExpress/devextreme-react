import { createTempate } from "./template";

export function generate(paths: string[]): string {
  return render(paths);
}

const render: (model: string[]) => string = createTempate(`
<#~ it :modulePath #>export * from "<#= modulePath #>";
<#~#>
`.trim());
