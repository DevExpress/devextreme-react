import * as React from "react";

import { ITemplateMeta } from "./template";

import { generateID } from "./helpers";
import { ITemplateWrapperProps, TemplateWrapper } from "./template-wrapper";

type TemplateGetter = (nestedTemplates: Record<string, any>) => React.ReactElement<ITemplateWrapperProps>;
type StateUpdater = (callback: (templates: TemplateGetter) => void) => void;
type PropsGetter = (propName: string) => any;

interface IDxTemplateData {
    container: any;
    model?: any;
    index?: any;
}

interface IDxTemplate {
    render: (data: IDxTemplateData) => any;
}

interface ITemplateDescr {
    name: string;
    propName: string;
    isNested: boolean;
    isComponent: boolean;
    propsGetter: PropsGetter;
}

interface IIntegrationDescr {
    options: Record<string, any>;
    nestedOptions: Record<string, any>;
    templateProps: ITemplateMeta[];
    templatePrefix?: string;
    propsGetter: PropsGetter;
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
    const templateProps = meta.templateProps || [];

    const prefix = meta.templatePrefix || "";
    templateProps.forEach((m) => {
        if (!options[m.component] && !options[m.render]) {
            return;
        }
        const name = `${prefix}${m.tmplOption}`;

        const templateDescr: ITemplateDescr = {
            name,
            propName: options[m.component] ? m.component : m.render,
            isComponent: !!options[m.component],
            isNested: false,
            propsGetter: meta.propsGetter
        };
        templateStubs[m.tmplOption] = name;
        templates[name] = wrapTemplate(templateDescr, stateUpdater);
    });

    const nestedOptions = meta.nestedOptions;
    Object.keys(nestedOptions).forEach((name) => {
        const templateDescr: ITemplateDescr = {
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

function wrapTemplate(templateDescr: ITemplateDescr, stateUpdater: StateUpdater): IDxTemplate {
    return {
        render: (data: IDxTemplateData) => {
            const templateId = "__template_" + generateID();
            const createWrapper = (nestedTemplates) => {
                const propsGetter = templateDescr.isNested
                    ? (prop) => nestedTemplates[templateDescr.name][prop]
                    : templateDescr.propsGetter;

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
            stateUpdater((t) => t[templateId] = createWrapper);
        }
    };
}

function unwrapElement(element: any) {
    return element.get ? element.get(0) : element;
}

export {
    PropsGetter,
    StateUpdater,
    TemplateGetter,
    IIntegrationDescr,
    getTemplateOptions
};
