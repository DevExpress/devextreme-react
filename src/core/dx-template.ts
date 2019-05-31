import * as React from "react";

import { DoubleKeyMap, generateID } from "./helpers";
import { ITemplateWrapperProps, TemplateWrapper } from "./template-wrapper";
import { TemplatesStore } from "./templates-store";

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
    templatesStore: TemplatesStore,
    keyFn?: (data: any) => string
): IDxTemplate {

    const renderedTemplates = new DoubleKeyMap<any, HTMLElement | null, string>();

    return {
        render: (data: IDxTemplateData) => {
            const container = unwrapElement(data.container);
            const key = { key1: data.model, key2: container };
            const prevTemplateId = renderedTemplates.get(key);

            let templateId: string;
            if (prevTemplateId) {
                templateId = prevTemplateId;
            } else {
                templateId = keyFn ? keyFn(data.model) : "__template_" + generateID();

                if (data.model !== undefined) {
                    renderedTemplates.set(key, templateId);
                }
            }

            templatesStore.add(templateId, () => {
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
                        onRemoved: () => {
                            templatesStore.remove(templateId);
                            renderedTemplates.delete({ key1: model, key2: container });
                        },
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
