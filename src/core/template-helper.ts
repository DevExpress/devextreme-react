import * as React from "react";

import { ITemplateMeta } from "./template";

import { ComponentBase, IState } from "./component";
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
    private readonly _component: ComponentBase<any>;

    constructor(component: ComponentBase<any>) {
        this._component = component;

        this.wrapTemplate = this.wrapTemplate.bind(this);
        this._updateState = this._updateState.bind(this);
    }

    public getIntegrationOptions(
        options: Record<string, any>,
        nestedOptions: Record<string, any>,
        templateProps: ITemplateMeta[]
    ): any {
        const templates: Record<string, IDxTemplate> = {};
        const result = {
            integrationOptions: {
                templates
            }
        };

        templateProps.forEach((m) => {
            if (options[m.component] || options[m.render]) {
                const templateInfo: ITemplateInfo = {
                    name: m.tmplOption,
                    prop: options[m.component] ? m.component : m.render,
                    isComponent: !!options[m.component],
                    isNested: false
                };
                result[m.tmplOption] = m.tmplOption;
                templates[m.tmplOption] = this.wrapTemplate(templateInfo);
            }
        });

        Object.keys(nestedOptions).forEach((name) => {
            const templateInfo: ITemplateInfo = {
                name,
                prop: !!nestedOptions[name].component ? "component" : "render",
                isComponent: !!nestedOptions[name].component,
                isNested: true
            };
            templates[name] = this.wrapTemplate(templateInfo);
        });

        if (Object.keys(templates).length > 0) {
            return result;
        }
    }

    private wrapTemplate(templateInfo: ITemplateInfo): IDxTemplate {
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
