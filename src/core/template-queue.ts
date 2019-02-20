import * as commonUtils from "devextreme/core/utils/common";

class TemplateQueue {

    private _templateCallbacks: any[] = [];
    private _updateIsDelayed: boolean = false;
    private _updateTemplatesCallback: (callbacks: any[]) => void;

    constructor(updateTemplatesCallback: (callbacks: any[]) => void) {
        this._updateTemplatesCallback = updateTemplatesCallback;
        this.updateTemplate = this.updateTemplate.bind(this);
    }

    public updateTemplate(callback: any) {
        this._templateCallbacks.push(callback);

        if (this._updateIsDelayed) {
            return;
        }

        this._updateIsDelayed = true;

        commonUtils.deferUpdate(() => {
            this._updateTemplatesCallback(this._templateCallbacks);
            this.flush();
        });
    }

    public flush() {
        this._templateCallbacks.length = 0;
        this._updateIsDelayed = false;
    }
}

export {
    TemplateQueue
};
