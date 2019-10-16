import { deferUpdate } from "devextreme/core/utils/common";
import * as React from "react";

import { TemplatesStore } from "./templates-store";

class TemplatesRenderer extends React.PureComponent<{ templatesStore: TemplatesStore }> {
    private _updateScheduled: boolean = false;
    private _updateTimeout: any;

    public scheduleUpdate() {
        this.debounceForceUpdate();
        // this.deferForceUpdate();
    }

    public render() {
        return React.createElement(
            React.Fragment,
            {},
            this.props.templatesStore.renderWrappers()
        );
    }

    protected debounceForceUpdate() {
        clearTimeout(this._updateTimeout);

        this._updateTimeout = setTimeout(() => {
            clearTimeout(this._updateTimeout);
            this.forceUpdate();
        });
    }

    protected deferForceUpdate() {
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
