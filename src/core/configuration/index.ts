import { mergeNameParts, parseOptionName } from "./utils";

interface IConfigNode {
    readonly fullName: string;
    readonly predefinedOptions: Record<string, any>;
    readonly initialOptions: Record<string, any>;
    readonly options: Record<string, any>;
    readonly templates: ITemplate[];
    readonly configs: Record<string, IConfigNode>;
    readonly configCollections: Record<string, IConfigNode[]>;
}

interface ITemplate {
    optionName: string;
    isAnonymous: boolean;
    type: "component" | "render" | "children";
    content: any;
    keyFn?: (data: any) => string;
}

function prepareConfig(root: IConfigNode, ignoreInitialValues: boolean): IWidgetConfig {
    const templates: Record<string, ITemplate> = {};
    const options = prepare(root, templates, ignoreInitialValues);

    return {
        templates,
        options
    };
}

function prepare(
    node: IConfigNode,
    templates: Record<string, ITemplate>,
    ignoreInitialValues: boolean
): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of Object.keys(node.predefinedOptions)) {
        result[key] = node.predefinedOptions[key];
    }

    for (const key of Object.keys(node.configs)) {
        result[key] = prepare(node.configs[key], templates, ignoreInitialValues);
    }

    for (const key of Object.keys(node.configCollections)) {
        result[key] = node.configCollections[key].map(
            (item) => prepare(item, templates, ignoreInitialValues)
        );
    }

    for (const key of Object.keys(node.options)) {
        result[key] = node.options[key];
    }

    if (!ignoreInitialValues) {
        for (const key of Object.keys(node.initialOptions)) {
            result[key] = node.initialOptions[key];
        }
    }

    node.templates.map(
        (template) => {
            if (template.isAnonymous) {
                const templateName = mergeNameParts(node.fullName, template.optionName);
                result[template.optionName] = templateName;
                templates[templateName] = template;
            } else {
                templates[template.optionName] = template;
            }
        }
    );

    return result;
}

interface IWidgetConfig {
    options: Record<string, any>;
    templates: Record<string, ITemplate>;
}

export function getOptionValue(node: IConfigNode, fullNameParts: string[]): any {
    const name = fullNameParts.shift();

    if (!name) {
        return prepareConfig(node, true);
    }

    const optionInfo = parseOptionName(name);

    if (optionInfo.isCollectionItem) {
        const collection = node.configCollections[optionInfo.name];
        if (!collection) {
            return;
        }

        const item = collection[optionInfo.index];
        if (!item) {
            return;
        }

        return getOptionValue(item, fullNameParts);
    }

    const child = node.configs[optionInfo.name];
    if (child) {
        return getOptionValue(child, fullNameParts);
    }

    const value = node.options[optionInfo.name];
    if (value) {
        return value;
    }

    return;
}

export {
    prepareConfig,
    IConfigNode,
    ITemplate
};
