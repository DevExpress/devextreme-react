import * as React from "react";

import { createDxTemplate, IDxTemplate } from "./dx-template";
import { ITemplateMeta, ITemplateProps } from "./template";
import { TemplatesStore } from "./templates-store";

type PropsGetter = (propName: string) => any;

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

class TemplatesManager {
    private _templatesStore: TemplatesStore;
    private _templates: Record<string, any> = {};
    private _stubs: Record<string, any> = {};
    private _nestedTemplateProps: Record<string, {
        render: any;
        component: any;
        children: any;
    }> = {};

    constructor(templatesStore: TemplatesStore) {
        this._templatesStore = templatesStore;
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
            templates[name] = createDxTemplate(
                contentCreator,
                this._templatesStore,
                meta.propsGetter(tmpl.keyFn)
            );
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
        this._templates[name] = createDxTemplate(contentCreator, this._templatesStore, props.keyFn);
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

export default TemplatesManager;
