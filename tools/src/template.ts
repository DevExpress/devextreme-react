import { template, templateSettings } from "dot";

interface ISettings {
    strip: boolean;
}

const TAB = "<#= this.__tab #>";
const NEWLINE = "<#= this.__newLine #>";
const symbols = {
    __newLine: "\n",
    __tab: "  "
};

const defaultSettings: ISettings = {
    ...templateSettings,
    conditional: /\<#\?(\?)?\s*([\s\S]*?)\s*#\>/g,
    define: /\<###\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)##\>/g,
    encode: /\<#!([\s\S]+?)#\>/g,
    evaluate: /\<#([\s\S]+?)#\>/g,
    interpolate: /\<#=([\s\S]+?)#\>/g,
    iterate: /\<#~\s*(?:#\>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*#\>)/g,
    use: /\<##([\s\S]+?)#\>/g,
    strip: false,
    varname: "it"
};

function createTempate(templateStr: string, settings?: ISettings): ((model: any) => string) {
    return template(templateStr, { ...defaultSettings, ...settings });
}

function createStrictTemplate(templateStr: string): ((model: any) => string) {
    return template(templateStr, { ...defaultSettings, strip: true }).bind(symbols);
}

export {
    createTempate,
    createStrictTemplate,
    TAB,
    NEWLINE
};
