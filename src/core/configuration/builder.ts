import { Children as ReactChildren } from "react";

import { ITemplateMeta } from "../template";
import { ConfigNode } from "./config-node";

function buildConfig(root: ConfigNode, ignoreInitialValues: boolean): IWidgetConfig {
    const templates: Record<string, ITemplateInfo> = {};
    const options = build(root, templates, ignoreInitialValues);

    return {
        templates,
        options
    };
}

function build(
    node: ConfigNode,
    templates: Record<string, ITemplateInfo>,
    ignoreInitialValues: boolean
): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of Object.keys(node.descriptor.predefinedValues || [])) {
        result[key] = node.descriptor.predefinedValues[key];
    }

    for (const key of Object.keys(node.children)) {
        result[key] = build(node.children[key], templates, ignoreInitialValues);
    }

    for (const key of Object.keys(node.collections)) {
        result[key] = node.collections[key].map(
            (item) => build(item, templates, ignoreInitialValues)
        );
    }

    for (const key of Object.keys(node.values)) {
        result[key] = node.values[key];
    }

    if (!ignoreInitialValues) {
        for (const key of Object.keys(node.initialValues)) {
            result[key] = node.initialValues[key];
        }
    }

    for (const templateMeta of node.descriptor.templates || []) {
        const templateInfo = getTemplateInfo(node, templateMeta);
        if (templateInfo) {
            result[templateMeta.tmplOption] = templateInfo.name;
            templates[templateInfo.name] = templateInfo;
        }
    }

    return result;
}

function getTemplateInfo(node: ConfigNode, templateMeta: ITemplateMeta): ITemplateInfo | null {
    const name = node.fullname ? `${node.fullname}.${templateMeta.tmplOption}` : templateMeta.tmplOption;
    if (isTranscludedTemplate(node, templateMeta.tmplOption)) {
        return {
            name,
            type: "children",
            content: node.rawValues.children,
            keyFn: node.rawValues[templateMeta.keyFn]
        };
    }

    if (node.templates[templateMeta.render]) {
        return {
            name,
            type: "render",
            content: node.templates[templateMeta.render],
            keyFn: node.rawValues[templateMeta.keyFn]
        };
    }

    if (node.templates[templateMeta.component]) {
        return {
            name,
            type: "component",
            content: node.templates[templateMeta.component],
            keyFn: node.rawValues[templateMeta.keyFn]
        };
    }

    return null;
}

function isTranscludedTemplate(node: ConfigNode, optionName: string): boolean {
    if (node.fullname === "" || optionName !== "template") {
        return false;
    }

    if (ReactChildren.count(node.rawValues.children) > Object.keys(node.children).length) {
        return true;
    }

    return false;
}

interface ITemplateInfo {
    name: string;
    type: "component" | "render" | "children";
    content: any;
    keyFn?: (data: any) => string;
}

interface IWidgetConfig {
    options: Record<string, any>;
    templates: Record<string, ITemplateInfo>;
}

export {
    buildConfig,
    getTemplateInfo,
    ITemplateInfo
};
