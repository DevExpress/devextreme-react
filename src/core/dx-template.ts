import * as React from "react";

import { generateID } from "./helpers";
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

function createDxTemplate(
    createContentProvider: () => (model: any) => any,
    templateUpdater: ITemplateUpdater,
    keyFn?: (data: any) => string
): IDxTemplate {

    const renderedModels = new Map<any, string>();
    return {
        render: (data: IDxTemplateData) => {
            const prevTemplateId = renderedModels.get(data.model);

            let templateId: string;
            if (prevTemplateId) {
                templateId = prevTemplateId;
            } else {
                templateId = keyFn ? keyFn(data.model) : "__template_" + generateID();

                if (data.model !== undefined) {
                    renderedModels.set(data.model, templateId);
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
