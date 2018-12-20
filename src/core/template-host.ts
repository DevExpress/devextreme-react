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

interface IIntegrationDescr {
    props: Record<string, any>;
    templateProps: ITemplateMeta[];
    ownerName: string;
    propsGetter: PropsGetter;
    useChildren: (name: string) => boolean;
}

const contentCreators = {
    component: (name: string, propsGetter: PropsGetter) => React.createElement.bind(null, propsGetter(name)),
    render: (name: string, propsGetter: PropsGetter) => propsGetter(name),
    children: (_: string, propsGetter: PropsGetter) => () => propsGetter("children")
};

class TemplateHost {
    private readonly _stateUpdater: StateUpdater;

    private _templates: Record<string, any> = {};
    private _stubs: Record<string, any> = {};
    private _nestedTemplateProps: Record<string, {
        render: any;
        component: any;
        children: any;
        keyExpr?: (data) => string
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
            let contentCreator;
            let propName;

            if (meta.useChildren(tmpl.tmplOption)) {
                contentCreator = contentCreators.children;
            }

            if (props[tmpl.render]) {
                propName = tmpl.render;
                contentCreator = contentCreators.render;
            }

            if (props[tmpl.component]) {
                propName = tmpl.component;
                contentCreator = contentCreators.component;
            }

            if (!contentCreator) {
                continue;
            }

            contentCreator = contentCreator.bind(this, propName, meta.propsGetter);

            const name = ownerName ? `${ownerName}.${tmpl.tmplOption}` : tmpl.tmplOption;
            stubs[name] = name;
            templates[name] = wrapTemplate(contentCreator, this._stateUpdater, meta.propsGetter(tmpl.keyExpr));
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
            children: props.children
        };

        const type = !!props.component ? "component" : !!props.render ? "render" : "children";
        const propsGetter: PropsGetter = (prop) => this._nestedTemplateProps[name][prop];

        const contentCreator = contentCreators[type].bind(this, type, propsGetter);
        this._templates[name] = wrapTemplate(contentCreator, this._stateUpdater, props.keyExpr);
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

function wrapTemplate(
    createContentProvider: () => (model: any) => any,
    stateUpdater: StateUpdater,
    keyExpr?: (data) => string
): IDxTemplate {
    return {
        render: (data: IDxTemplateData) => {
            const templateId = keyExpr ? keyExpr(data.model) : "__template_" + generateID();
            const container = unwrapElement(data.container);
            const createWrapper = () => {
                const model = data.model;
                if (model && model.hasOwnProperty("key")) {
                    model.dxkey = model.key;
                }
                const contentProvider = createContentProvider();
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
