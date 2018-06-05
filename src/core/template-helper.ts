import * as React from "react";

import { BaseComponent, IState } from "./component";
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
    createWrapper: (contentProvider: (model: object) => any) => any;
}

class TemplateHelper {
    private readonly _component: BaseComponent<any>;

    constructor(component: BaseComponent<any>) {
        this._component = component;

        this.wrapTemplate = this.wrapTemplate.bind(this);
        this._updateState = this._updateState.bind(this);
    }

    public getContentProvider(templateSource: any, isComponent: boolean)  {
        return isComponent ? React.createElement.bind(this, templateSource) : templateSource.bind(this);
    }

    public wrapTemplate(templateInfo: ITemplateInfo): IDxTemplate {
        return {
            render: (data: IDxTemplateData) => {
                const templateId = "__template_" + generateID();
                const createWrapper = (contentProvider) =>
                    React.createElement<ITemplateWrapperProps>(TemplateWrapper, {
                        content: contentProvider(data.model),
                        container: unwrapElement(data.container),
                        onRemoved: () => this._updateState((t) => delete t[templateId]),
                        key: templateId
                    });

                this._updateState((t) => t[templateId] = { ...templateInfo, createWrapper });
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
