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

interface ITemplateInfo {
    name: string;
    prop: string;
    isNested: boolean;
    isComponent: boolean;
}

interface IWrappedTemplateInfo extends ITemplateInfo {
    wrapper: (Function) => any;
}

class TemplateHelper {
    private readonly _component: Component<any>;

    constructor(component: Component<any>) {
        this._component = component;

        this.wrapTemplate = this.wrapTemplate.bind(this);
        this._updateState = this._updateState.bind(this);
    }

    public getContentProvider(templateInfo: ITemplateInfo, props: any) {
        const templateSource = props[templateInfo.prop];
        return templateInfo.isComponent ? React.createElement.bind(this, templateSource) : templateSource.bind(this);
    }

    public wrapTemplate(templateInfo: ITemplateInfo): IDxTemplate {
        return {
            render: (data: IDxTemplateData) => {
                const templateId = "__template_" + generateID();
                const wrapper = (contentProvider: any) =>
                    React.createElement<ITemplateWrapperProps>(TemplateWrapper, {
                        content: contentProvider(data.model),
                        container: unwrapElement(data.container),
                        onRemoved: () => this._updateState((t) => delete t[templateId]),
                        key: templateId
                    });

                this._updateState((t) => t[templateId] = { ...templateInfo, wrapper });
            }
        };
    }

    private _updateState(callback: (templates: Record<string, IWrappedTemplateInfo>) => void) {
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
    ITemplateInfo,
    IWrappedTemplateInfo,
    TemplateHelper
};
