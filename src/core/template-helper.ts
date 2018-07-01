import * as React from "react";

import { ITemplateMeta } from "./template";

import { generateID } from "./helpers";
import { ITemplateWrapperProps, TemplateWrapper } from "./template-wrapper";

type StateUpdater = (callback: (templates: Record<string, ITemplateDto>) => void) => void;

interface IDxTemplateData {
    container: any;
    model?: any;
    index?: any;
}

interface IDxTemplate {
    render: (data: IDxTemplateData) => any;
}

interface ITemplateBaseDto {
    name: string;
    prop: string;
    isNested: boolean;
    isComponent: boolean;
    component: any;
}

interface ITemplateDto extends ITemplateBaseDto {
    createWrapper: (contentProvider: (model: object) => any) => any;
}

interface IIntegrationMeta {
    options: Record<string, any>;
    nestedOptions: Record<string, any>;
    templateProps: ITemplateMeta[];
    component: any;
    stateUpdater: StateUpdater;
}

function getIntegrationOptions(meta: IIntegrationMeta): any {
    const templates: Record<string, IDxTemplate> = {};
    const result = {
        integrationOptions: {
            templates
        }
    };
    const options = meta.options;
    const stateUpdater = meta.stateUpdater;

    meta.templateProps.forEach((m) => {
        if (options[m.component] || options[m.render]) {
            const templateInfo: ITemplateBaseDto = {
                name: m.tmplOption,
                prop: options[m.component] ? m.component : m.render,
                isComponent: !!options[m.component],
                isNested: false,
                component: meta.component
            };
            result[m.tmplOption] = m.tmplOption;
            templates[m.tmplOption] = wrapTemplate(templateInfo, stateUpdater);
        }
    });

    const nestedOptions = meta.nestedOptions;
    Object.keys(nestedOptions).forEach((name) => {
        const templateInfo: ITemplateBaseDto = {
            name,
            prop: !!nestedOptions[name].component ? "component" : "render",
            isComponent: !!nestedOptions[name].component,
            isNested: true,
            component: meta.component
        };
        templates[name] = wrapTemplate(templateInfo, stateUpdater);
    });

    if (Object.keys(templates).length > 0) {
        return result;
    }
}

function wrapTemplate(templateInfo: ITemplateBaseDto, stateUpdater: StateUpdater): IDxTemplate {
    return {
        render: (data: IDxTemplateData) => {
            const templateId = "__template_" + generateID();
            const createWrapper = (contentProvider) =>
                React.createElement<ITemplateWrapperProps>(TemplateWrapper, {
                    content: contentProvider(data.model),
                    container: unwrapElement(data.container),
                    onRemoved: () => stateUpdater((t) => delete t[templateId]),
                    key: templateId
                });

            stateUpdater((t) => t[templateId] = { ...templateInfo, createWrapper });
        }
    };
}

function unwrapElement(element: any) {
    return element.get ? element.get(0) : element;
}

export {
    IDxTemplate,
    IDxTemplateData,
    ITemplateBaseDto,
    ITemplateDto,
    IIntegrationMeta,
    StateUpdater,
    getIntegrationOptions
};
