import * as React from "react";

import { findInArray, generateID } from "./helpers";
import { ITemplateUpdater } from "./template-updater";
import { ITemplateWrapperProps, TemplateWrapper } from "./template-wrapper";

interface IDxTemplate {
    render: (data: IDxTemplateData) => any;
}

interface IDxTemplateData {
    container: any;
    model?: any;
    index?: any;
    onRendered?: () => void;
}

type templateIdFunc = (data: any) => string;

function createDxTemplate(
    createContentProvider: () => (model: any) => any,
    templateUpdater: ITemplateUpdater,
    keyFn?: templateIdFunc
): IDxTemplate {

    const renderedModels: Array<{ model: any, templateId: string }> = [];
    return {
        render: (data: IDxTemplateData) => {
            const renderedModel = findInArray(renderedModels, (e) => e.model === data.model);

            let templateId: string;
            if (renderedModel) {
                templateId = renderedModel.templateId;
            } else {
                templateId = keyFn ? keyFn(data.model) : "__template_" + generateID();

                if (data.model !== undefined) {
                    renderedModels.push({ model: data.model, templateId });
                }
            }

            const container = unwrapElement(data.container);

            templateUpdater.setTemplate(templateId, () => {
                const model = data.model;
                if (model && model.hasOwnProperty("key")) {
                    model.dxkey = model.key;
                }
                const contentProvider = createContentProvider();
                return React.createElement<ITemplateWrapperProps>(
                    TemplateWrapper,
                    {
                        content: contentProvider(model),
                        container,
                        onRemoved: () => templateUpdater.removeTemplate(templateId),
                        onRendered: data.onRendered,
                        key: templateId
                    }
                ) as any as TemplateWrapper;
            });

            return container;
        }
    };
}

function unwrapElement(element: any): HTMLElement {
    return element.get ? element.get(0) : element;
}

export {
    IDxTemplate,
    createDxTemplate
};
