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

    const renderedContainers: HTMLElement[] = [];
    return {
        render: (data: IDxTemplateData) => {
            const templateId = keyFn ? keyFn(data.model) : "__template_" + generateID();
            const container = unwrapElement(data.container);

            if (renderedContainers.indexOf(container) > -1) {
                return container;
            }
            renderedContainers.push(container);

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
