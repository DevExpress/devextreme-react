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
    isComponent: boolean;
    propsGetter: PropsGetter;
}

interface IIntegrationDescr {
    props: Record<string, any>;
    templateProps: ITemplateMeta[];
    ownerName: string;
    propsGetter: PropsGetter;
}

class TemplateHost {
    private readonly _stateUpdater: StateUpdater;

    private _templates: Record<string, any> = {};
    private _stubs: Record<string, any> = {};
    private _nestedTemplateProps: Record<string, {
        render: any;
        component: any;
    }> = {};

    constructor(stateUpdater: StateUpdater) {
        this._stateUpdater = stateUpdater;
    }

    public add(meta: IIntegrationDescr) {
        const templateOptions = this._getTemplateOptions({
            ownerName: meta.ownerName,
            templateProps: meta.templateProps,
            props: meta.props,
            propsGetter: meta.propsGetter
        });

        this._templates = {
            ...this._templates,
            ...templateOptions.templates
        };

        this._stubs = {
            ...this._stubs,
            ...templateOptions.optionStubs
        };
    }

    public addNested(props: {
        name: string;
        render: any;
        component: any;
    }): void {
        const name: string = props.name;
        this._nestedTemplateProps[name] = {
            component: props.component,
            render: props.render
        };
        const propsGetter = (prop) => this._nestedTemplateProps[name][prop];

        const templateDescr: ITemplateDescr = {
            name,
            propName: !!props.component ? "component" : "render",
            isComponent: !!props.component,
            propsGetter
        };

        this._templates[name] = wrapTemplate(templateDescr, this._stateUpdater);
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

    private _getTemplateOptions(meta: IIntegrationDescr): {
        templates: any;
        optionStubs: any;
    } {
        const templates: Record<string, IDxTemplate> = {};
        const optionStubs: Record<string, any> = {};
        const props = meta.props;
        const templateProps = meta.templateProps || [];

        const ownerName = meta.ownerName;
        templateProps.forEach((m) => {
            if (!props[m.component] && !props[m.render]) {
                return;
            }
            const name = ownerName ? `${ownerName}.${m.tmplOption}` : m.tmplOption;

            const templateDescr: ITemplateDescr = {
                name,
                propName: props[m.component] ? m.component : m.render,
                isComponent: !!props[m.component],
                propsGetter: meta.propsGetter
            };
            optionStubs[name] = name;
            templates[name] = wrapTemplate(templateDescr, this._stateUpdater);
        });

        return {
            templates,
            optionStubs
        };
    }
}

function wrapTemplate(templateDescr: ITemplateDescr, stateUpdater: StateUpdater): IDxTemplate {
    return {
        render: (data: IDxTemplateData) => {
            const templateId = "__template_" + generateID();
            const container = unwrapElement(data.container);
            const createWrapper = () => {
                const propsGetter = templateDescr.propsGetter;

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

export default TemplateHost;
