import { TemplateWrapper, TemplateWrapperRenderer } from "./template-wrapper";

interface ITemplatesStore {
    add(templateId: string, templateFunc: TemplateWrapperRenderer): void;
    remove(templateId: string): void;
    listWrappers(): TemplateWrapper[];
}

class TemplatesStore implements ITemplatesStore {
    private readonly _templates: Record<string, TemplateWrapperRenderer> = {};
    private readonly _onTemplateAdded: () => void;

    constructor(onTemplateAdded: () => void) {
        this._onTemplateAdded = onTemplateAdded;
    }

    public add(templateId: string, templateFunc: TemplateWrapperRenderer): void {
        this._templates[templateId] = templateFunc;
        this._onTemplateAdded();
    }

    public remove(templateId: string): void {
        delete this._templates[templateId];
    }

    public listWrappers(): TemplateWrapper[] {
        return Object.getOwnPropertyNames(this._templates).map(
            (templateId) => this._templates[templateId]()
        );
    }
}

export {
    ITemplatesStore,
    TemplatesStore
};
