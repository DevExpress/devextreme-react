import * as React from "react";

import { getOption as getConfigOption } from "./config";
import { createDxTemplate, IDxTemplate } from "./dx-template";
import { ITemplateArgs, ITemplateMeta, ITemplateProps } from "./template";
import { TemplatesStore } from "./templates-store";

type PropsGetter = (propName: string) => any;

interface IIntegrationDescr {
    props: Record<string, any>;
    templateProps: ITemplateMeta[];
    ownerName: string;
    propsGetter: PropsGetter;
    useChildren: (name: string) => boolean;
}

function normalizeProps(props: ITemplateArgs): ITemplateArgs | ITemplateArgs["data"] {
    if (getConfigOption("useLegacyTemplateEngine")) {
        const model = props.data;
        if (model && model.hasOwnProperty("key")) {
            model.dxkey = model.key;
        }
        return model;
    }
    return props;
}

const contentCreators = {
    component: (name: string, propsGetter: PropsGetter) => (props: ITemplateArgs) => {
        props = normalizeProps(props);
        return React.createElement.bind(null, propsGetter(name))(props);
    },
    render: (name: string, propsGetter: PropsGetter) => (props: ITemplateArgs) => {
        normalizeProps(props);
        return propsGetter(name)(props.data, props.index);
    },
    children: (_: string, propsGetter: PropsGetter) => () => propsGetter("children")
};

class TemplatesManager {
    private _templatesStore: TemplatesStore;
    private _templates: Record<string, any> = {};
    private _nestedTemplateProps: Record<string, {
        render: any;
        component: any;
        children: any;
    }> = {};

    constructor(templatesStore: TemplatesStore) {
        this._templatesStore = templatesStore;
    }

    public add(meta: IIntegrationDescr): Record<string, any> {
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
            stubs[tmpl.tmplOption] = name;
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

        return stubs;
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
            }
        };
    }
}

export default TemplatesManager;
