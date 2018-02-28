import { template, templateSettings } from "dot";

export const createTempate = (templateStr: string): ((model: any) => string) => template(templateStr);

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
