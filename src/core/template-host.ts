import { ITemplateMeta } from "./template";

import * as React from "react";

import { generateID } from "./helpers";
import { ITemplateWrapperProps, TemplateWrapper } from "./template-wrapper";

type TemplateGetter = (nestedTemplates: Record<string, any>) => React.ReactElement<ITemplateWrapperProps>;
type StateUpdater = (callback: (templates: TemplateGetter) => void) => void;
type PropsGetter = (propName: string) => any;

interface IDxTemplateData {
    container: any;
    model?: any;
    index?: any;
    onRendered?: () => void;
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
    ownerName?: string;
    propsGetter: PropsGetter;
}

class TemplateHost {
    private readonly _stateUpdater: StateUpdater;

    private _templates: Record<string, any> = {};
    private _stubs: Record<string, any> = {};

    constructor(stateUpdater: StateUpdater) {
        this._stateUpdater = stateUpdater;
    }

    public add(meta: IIntegrationDescr) {
        const templateOptions = getTemplateOptions({
            ownerName: meta.ownerName,
            templateProps: meta.templateProps,
            options: meta.options,
            nestedOptions: meta.nestedOptions,
            stateUpdater: this._stateUpdater,
            propsGetter: meta.propsGetter
        });

        this._templates = {
            ...this._templates,
            ...templateOptions.templates
        };

        this._stubs = {
            ...this._stubs,
            ...templateOptions.templateStubs
        };
    }

    public get options(): Record<string, any> | undefined {
        if (!Object.keys(this._templates).length) {
            return;
        }

        return {
            integrationOptions: {
                templates: this._templates
            },
            ...this._stubs
        };
    }
}

function getTemplateOptions(meta: IIntegrationDescr & { stateUpdater: StateUpdater }): {
    templates: any;
    templateStubs: any;
} {
    const templates: Record<string, IDxTemplate> = {};
    const templateStubs: Record<string, any> = {};
    const options = meta.options;
    const stateUpdater = meta.stateUpdater;
    const templateProps = meta.templateProps || [];

    const prefix = meta.ownerName || "";
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
        templateStubs[meta.ownerName ? prefix + "." + m.tmplOption : m.tmplOption] = name;
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
            const container = unwrapElement(data.container);
            const createWrapper = (nestedTemplates) => {
                const propsGetter = templateDescr.isNested
                    ? (prop) => nestedTemplates[templateDescr.name][prop]
                    : templateDescr.propsGetter;

                const contentProvider = templateDescr.isComponent
                    ? React.createElement.bind(null, propsGetter(templateDescr.propName))
                    : propsGetter(templateDescr.propName);

                const model = data.model;
                if (model && model.hasOwnProperty("key")) {
                    model.dxkey = model.key;
                }
                return React.createElement<ITemplateWrapperProps>(TemplateWrapper, {
                    content: contentProvider(model),
                    container,
                    onRemoved: () => stateUpdater((t) => delete t[templateId]),
                    onRendered: data.onRendered,
                    key: templateId
                });
            };
            stateUpdater((t) => t[templateId] = createWrapper);
            return container;
        }
    };
}

function unwrapElement(element: any) {
    return element.get ? element.get(0) : element;
}

export {
    TemplateGetter
};

export default TemplateHost;
