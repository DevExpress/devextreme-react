import * as React from "react";

import { getOption as getConfigOption } from "./config";
import { ITemplateInfo } from "./configuration/builder";
import { createDxTemplate } from "./dx-template";
import { ITemplateArgs, ITemplateProps } from "./template";
import { TemplatesStore } from "./templates-store";

type PropsGetter = (propName: string) => any;

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

const newContentCreators = {
    component: (content: any) => (props: ITemplateArgs) => {
        props = normalizeProps(props);
        return React.createElement.bind(null, content)(props);
    },
    render: (content: any) => (props: ITemplateArgs) => {
        normalizeProps(props);
        return content(props.data, props.index);
    },
    children: (content: any) => () => content
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

    public add(templateInfo: ITemplateInfo) {
        let contentCreator: any = newContentCreators[templateInfo.type];
        contentCreator = contentCreator.bind(this, templateInfo.content);
        this._templates[templateInfo.name] = createDxTemplate(
            contentCreator,
            this._templatesStore,
            templateInfo.keyFn
        );
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

    public get templates(): Record<string, any> {
        return this._templates;
    }
}

export default TemplatesManager;
