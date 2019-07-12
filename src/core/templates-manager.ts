import * as React from "react";

import { getOption as getConfigOption } from "./config";
import { ITemplate } from "./configuration";
import { createDxTemplate } from "./dx-template";
import { ITemplateArgs } from "./template";
import { TemplatesStore } from "./templates-store";

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

    constructor(templatesStore: TemplatesStore) {
        this._templatesStore = templatesStore;
    }

    public add(name: string, template: ITemplate) {
        let contentCreator: any = contentCreators[template.type];
        contentCreator = contentCreator.bind(this, template.content);
        this._templates[name] = createDxTemplate(
            contentCreator,
            this._templatesStore,
            template.keyFn
        );
    }

    public get templates(): Record<string, any> {
        return this._templates;
    }
}

export default TemplatesManager;
