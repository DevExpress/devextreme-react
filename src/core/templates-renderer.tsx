import { deferUpdate } from "devextreme/core/utils/common";
import * as React from "react";

import { TemplatesStore } from "./templates-store";

const UPDATE_DEBOUNCE_TIME = 100;

class TemplatesRenderer extends React.PureComponent<{ templatesStore: TemplatesStore }> {
    private _updateScheduled: boolean = false;
    private _updateTimeout: any;
    private _updateCallsCount: number = 0;

    public scheduleUpdate() {
        if (this._updateScheduled) {
            return;
        }
        this._updateScheduled = true;

        clearTimeout(this._updateTimeout);
        // this._updateCallsCount++;
        // if (this._updateCallsCount > 30) {
        //     this._updateCallsCount = 0;
        //     this.forceUpdate();
        //     return;
        // }
        // this._updateTimeout = setTimeout(() => {
        //     clearTimeout(this._updateTimeout);
        //     this.forceUpdate();
        // }, 200);

        deferUpdate(() => {
            this.forceUpdate();
            this._updateScheduled = false;
        });
    }

    public render() {
        return React.createElement(
            React.Fragment,
            {},
            this.props.templatesStore.renderWrappers()
        );
    }
}

export {
    TemplatesRenderer
};
