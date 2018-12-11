import { ITemplateMeta, ITemplateProps } from "./template";

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
    propName: string;
    isComponent: boolean;
    propsGetter: PropsGetter;
}

interface IIntegrationDescr {
    props: Record<string, any>;
    templateProps: ITemplateMeta[];
    ownerName: string;
    propsGetter: PropsGetter;
    useChildren: (name: string) => boolean;
}

class TemplateHost {
    private readonly _stateUpdater: StateUpdater;

    private _templates: Record<string, any> = {};
    private _stubs: Record<string, any> = {};
    private _nestedTemplateProps: Record<string, {
        render: any;
        component: any;
        children: any;
    }> = {};

    constructor(stateUpdater: StateUpdater) {
        this._stateUpdater = stateUpdater;
    }

    public add(meta: IIntegrationDescr) {
        const templates: Record<string, IDxTemplate> = {};
        const stubs: Record<string, any> = {};

        const props = meta.props;
        const templateProps = meta.templateProps || [];
        const ownerName = meta.ownerName;

        for (const tmpl of templateProps) {
            let propName = props[tmpl.component] ? tmpl.component : tmpl.render;
            let propsGetter = meta.propsGetter;
            if (!props[tmpl.component] && !props[tmpl.render]) {
                if (meta.useChildren(tmpl.tmplOption)) {
                    propName = "children";
                    propsGetter = () => () => meta.propsGetter("children");
                } else {
                    continue;
                }
            }

            const name = ownerName ? `${ownerName}.${tmpl.tmplOption}` : tmpl.tmplOption;
            const templateDescr: ITemplateDescr = {
                propName,
                isComponent: !!props[tmpl.component],
                propsGetter
            };
            stubs[name] = name;
            templates[name] = wrapTemplate(templateDescr, this._stateUpdater);
        }

        this._templates = {
            ...this._templates,
            ...templates
        };

        this._stubs = {
            ...this._stubs,
            ...stubs
        };
    }

    public addNested(props: ITemplateProps): void {
        const name: string = props.name;
        this._nestedTemplateProps[name] = {
            component: props.component,
            render: props.render,
            children: () => props.children
        };
        const propsGetter: PropsGetter = (prop) => this._nestedTemplateProps[name][prop];

        const templateDescr: ITemplateDescr = {
            propName: !!props.component ? "component" : !!props.render ? "render" : "children",
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
