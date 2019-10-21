import { deferUpdate } from "devextreme/core/utils/common";
import * as React from "react";

import { TemplatesStore } from "./templates-store";

class TemplatesRenderer extends React.PureComponent<{ templatesStore: TemplatesStore }> {
    private _updateScheduled: boolean = false;

    public scheduleUpdate() {
        // this.throttleWithSetTimeout();
        // this.throttleWithRequestAnimationFrame();
        this.deferUpdate();
    }

    public render() {
        return React.createElement(
            React.Fragment,
            {},
            this.props.templatesStore.renderWrappers()
        );
    }

    protected throttleWithSetTimeout() {
        if (this._updateScheduled) {
            return;
        }
        this._updateScheduled = true;

        setTimeout(() => {
            this.forceUpdate();
            this._updateScheduled = false;
        }, 50);
    }

    protected throttleWithRequestAnimationFrame() {
        if (this._updateScheduled) {
            return;
        }
        this._updateScheduled = true;

        requestAnimationFrame(() => {
            this.forceUpdate();
            this._updateScheduled = false;
        });
    }

    protected deferUpdate() {
        if (this._updateScheduled) {
            return;
        }
        this._updateScheduled = true;

        deferUpdate(() => {
            this.forceUpdate();
            this._updateScheduled = false;
        });
    }
}

export {
    TemplatesRenderer
};
