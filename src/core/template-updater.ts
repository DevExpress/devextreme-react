import * as commonUtils from "devextreme/core/utils/common";
import { RenderedTemplate } from "./template-host";

interface ITemplateUpdater {
    setTemplate(templateId: string, templateFunc: () => RenderedTemplate): void;
    removeTemplate(templateId: string): void;
}

class TemplateUpdater implements ITemplateUpdater {

    private readonly _templates: Record<string, () => RenderedTemplate> = {};
    private readonly _updateTemplatesCallback: (t: Record<string, () => RenderedTemplate>) => void;

    private _updateIsDelayed: boolean = false;

    constructor(updateTemplatesCallback: (t: Record<string, () => RenderedTemplate>) => void) {
        this._updateTemplatesCallback = updateTemplatesCallback;

        this._scheduleUpdate = this._scheduleUpdate.bind(this);
        this.setTemplate = this.setTemplate.bind(this);
        this.removeTemplate = this.removeTemplate.bind(this);
    }

    public setTemplate(templateId: string, templateFunc: () => RenderedTemplate): void {
        this._templates[templateId] = templateFunc;
        this._scheduleUpdate();
    }

    public removeTemplate(templateId: string): void {
        delete this._templates[templateId];
        this._scheduleUpdate();
    }

    private _scheduleUpdate() {
        if (this._updateIsDelayed) {
            return;
        }

        this._updateIsDelayed = true;

        commonUtils.deferUpdate(() => {
            this._updateTemplatesCallback(this._templates);
            this._updateIsDelayed = false;
        });
    }
}

export {
    ITemplateUpdater,
    TemplateUpdater
};
