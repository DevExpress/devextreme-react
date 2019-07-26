import { IConfigNode, ITemplate } from "./config-node";
import { mergeNameParts, parseOptionName } from "./utils";

interface IConfig {
    options: Record<string, any>;
    templates: Record<string, ITemplate>;
}

function buildConfig(root: IConfigNode, ignoreInitialValues: boolean): IConfig {
    const templatesAccum: Record<string, ITemplate> = {};
    const options = buildNode(root, templatesAccum, ignoreInitialValues);

    return {
        templates: templatesAccum,
        options
    };
}

function buildNode(
    node: IConfigNode,
    templatesAccum: Record<string, ITemplate>,
    ignoreInitialValues: boolean
): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of Object.keys(node.predefinedOptions)) {
        result[key] = node.predefinedOptions[key];
    }

    for (const key of Object.keys(node.configs)) {
        result[key] = buildNode(node.configs[key], templatesAccum, ignoreInitialValues);
    }

    for (const key of Object.keys(node.configCollections)) {
        result[key] = node.configCollections[key].map(
            (item) => buildNode(item, templatesAccum, ignoreInitialValues)
        );
    }

    if (!ignoreInitialValues) {
        for (const key of Object.keys(node.initialOptions)) {
            result[key] = node.initialOptions[key];
        }
    }

    for (const key of Object.keys(node.options)) {
        result[key] = node.options[key];
    }

    buildTemplates(node, result, templatesAccum);

    return result;
}

function buildTemplates(
    node: IConfigNode,
    optionsAccum: Record<string, any>,
    templatesAccum: Record<string, ITemplate>
) {
    node.templates.map(
        (template) => {
            if (template.isAnonymous) {
                const templateName = mergeNameParts(node.fullName, template.optionName);
                optionsAccum[template.optionName] = templateName;
                templatesAccum[templateName] = template;
            } else {
                templatesAccum[template.optionName] = template;
            }
        }
    );
}

interface IValueDescriptor {
    value: any;
    type: ValueType;
}

enum ValueType {
    Simple,
    Complex,
    Array
}

function findValue(node: IConfigNode, path: string[]): undefined | IValueDescriptor {
    const name = path.shift();

    if (!name) {
        return {
            value: buildConfig(node, true).options,
            type: ValueType.Complex
        };
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

        return findValue(item, path);
    }

    const child = node.configs[optionInfo.name];
    if (child) {
        return findValue(child, path);
    }

    const childCollection = node.configCollections[optionInfo.name];
    if (childCollection) {
        if (path.length !== 0) {
            return;
        }

        return {
            value: childCollection.map((item) => buildNode(item, {}, true)),
            type: ValueType.Array
        };
    }

    const value = node.options[optionInfo.name];
    if (value) {
        return findValueInObject(value, path);
    }

    return;
}

function findValueInObject(obj: any, path: string[]): undefined | IValueDescriptor {
    if (!obj) {
        return;
    }

    const key = path.shift();
    if (!key) {
        return {
            value: obj,
            type: ValueType.Simple
        };
    }

    return findValueInObject(obj[key], path);
}

export {
    ValueType,
    buildConfig,
    buildNode,
    buildTemplates,
    findValue
};
