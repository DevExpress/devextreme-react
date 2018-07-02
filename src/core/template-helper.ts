import * as React from "react";

import { ITemplateMeta } from "./template";

import { generateID } from "./helpers";
import { ITemplateWrapperProps, TemplateWrapper } from "./template-wrapper";

type StateUpdater = (callback: (templates: Record<string, ITemplateDescr>) => void) => void;

interface IDxTemplateData {
    container: any;
    model?: any;
    index?: any;
}

interface IDxTemplate {
    render: (data: IDxTemplateData) => any;
}

interface ITemplateBaseDescr {
    name: string;
    propName: string;
    isNested: boolean;
    isComponent: boolean;
    propsGetter: (prop: string) => any;
}

interface ITemplateDescr extends ITemplateBaseDescr {
    createWrapper: (propsGetter: (prop: string) => any) => any;
}

interface IIntegrationDescr {
    options: Record<string, any>;
    nestedOptions: Record<string, any>;
    templateProps: ITemplateMeta[];
    propsGetter: (prop: string) => any;
    stateUpdater: StateUpdater;
}

function getTemplateOptions(meta: IIntegrationDescr): {
    templates: any;
    templateStubs: any;
} {
    const templates: Record<string, IDxTemplate> = {};
    const templateStubs: Record<string, any> = {};
    const options = meta.options;
    const stateUpdater = meta.stateUpdater;

    meta.templateProps.forEach((m) => {
        if (!options[m.component] && !options[m.render]) {
            return;
        }

        const templateDescr: ITemplateBaseDescr = {
            name: m.tmplOption,
            propName: options[m.component] ? m.component : m.render,
            isComponent: !!options[m.component],
            isNested: false,
            propsGetter: meta.propsGetter
        };
        templateStubs[m.tmplOption] = m.tmplOption;
        templates[m.tmplOption] = wrapTemplate(templateDescr, stateUpdater);
    });

    const nestedOptions = meta.nestedOptions;
    Object.keys(nestedOptions).forEach((name) => {
        const templateDescr: ITemplateBaseDescr = {
            name,
            propName: !!nestedOptions[name].component ? "component" : "render",
            isComponent: !!nestedOptions[name].component,
            isNested: true,
            propsGetter: meta.propsGetter
        };
        templates[name] = wrapTemplate(templateDescr, stateUpdater);
    });

    return {
        templates,
        templateStubs
    };
}

function wrapTemplate(templateDescr: ITemplateBaseDescr, stateUpdater: StateUpdater): IDxTemplate {
    return {
        render: (data: IDxTemplateData) => {
            const templateId = "__template_" + generateID();
            const createWrapper = (propsGetter) => {
                const contentProvider = templateDescr.isComponent
                ? React.createElement.bind(null, propsGetter(templateDescr.propName))
                : propsGetter(templateDescr.propName);

                return React.createElement<ITemplateWrapperProps>(TemplateWrapper, {
                    content: contentProvider(data.model),
                    container: unwrapElement(data.container),
                    onRemoved: () => stateUpdater((t) => delete t[templateId]),
                    key: templateId
                });
            };
            stateUpdater((t) => t[templateId] = { ...templateDescr, createWrapper });
        }
    };
}

function unwrapElement(element: any) {
    return element.get ? element.get(0) : element;
}

export {
    IDxTemplate,
    IDxTemplateData,
    ITemplateBaseDescr,
    ITemplateDescr,
    IIntegrationDescr,
    StateUpdater,
    getTemplateOptions
};
