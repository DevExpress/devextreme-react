import * as React from "react";

import { ITemplate } from "./configuration/config-node";
import { createDxTemplate } from "./dx-template";
import { TemplatesStore } from "./templates-store";

type ContentGetter = () => any;

const contentCreators = {
    component: (contentGetter: ContentGetter) => React.createElement.bind(null, contentGetter()),
    render: (contentGetter: ContentGetter) => contentGetter(),
    children: (contentGetter: ContentGetter) => () => contentGetter()
};

class TemplatesManager {
    private _templatesStore: TemplatesStore;
    private _templates: Record<string, any> = {};
    private _templatesContent: Record<string, any> = {};

    constructor(templatesStore: TemplatesStore) {
        this._templatesStore = templatesStore;
    }

    public add(name: string, template: ITemplate) {
        this._templatesContent[name] = template.content;
        const contentCreator = contentCreators[template.type].bind(this, () => this._templatesContent[name]);
        this._templates[name] = createDxTemplate(
            contentCreator,
            this._templatesStore,
            template.keyFn
        );
    }

    public get templatesCount(): number {
        return Object.keys(this._templates).length;
    }

    public get templates(): Record<string, any> {
        return this._templates;
    }
}

export default TemplatesManager;
