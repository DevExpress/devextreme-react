import * as React from "react";

import Component, { IState } from "./component";
import { generateID } from "./helpers";
import { ITemplateWrapperProps, TemplateWrapper } from "./template-wrapper";

interface IDxTemplateData {
    container: any;
    model?: any;
    index?: any;
}

interface IDxTemplate {
    render: (data: IDxTemplateData) => any;
}

class TemplateHelper {
    private readonly _component: Component<any>;

    constructor(component: Component<any>) {
        this._component = component;

        this.wrapTemplate = this.wrapTemplate.bind(this);
        this._updateState = this._updateState.bind(this);
    }

    public wrapTemplate(component: any, render: any): IDxTemplate {
        const tmplFn = !!component
            ? React.createElement.bind(this, component)
            : render.bind(this);

        return {
            render: (data: IDxTemplateData) => {
                const templateId = "__template_" + generateID();
                const wrapper = () =>
                    React.createElement<ITemplateWrapperProps>(TemplateWrapper, {
                        content: tmplFn(data.model),
                        container: unwrapElement(data.container),
                        onRemoved: () => this._updateState((t) => delete t[templateId]),
                        key: templateId
                    });

                this._updateState((t) => t[templateId] = wrapper);
            }
        };
    }

    private _updateState(callback: (templates: Record<string, any>) => void) {
        this._component.setState((state: IState) => {
            const templates = { ...state.templates };
            callback(templates);
            return {
                templates
            };
        });
    }
}

function unwrapElement(element: any) {
    return element.get ? element.get(0) : element;
}

export {
    IDxTemplate,
    IDxTemplateData,
    TemplateHelper
};
