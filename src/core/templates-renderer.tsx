import { requestAnimationFrame } from "devextreme/animation/frame";
import { deferUpdate } from "devextreme/core/utils/common";
import * as React from "react";

import { TemplatesStore } from "./templates-store";

class TemplatesRenderer extends React.PureComponent<{ templatesStore: TemplatesStore }> {
    private _updateScheduled: boolean = false;

    public scheduleUpdate(useDeferUpdate: boolean): void {
        if (this._updateScheduled) {
            return;
        }
        this._updateScheduled = true;

        const updateFunc = useDeferUpdate ? deferUpdate : requestAnimationFrame;
        updateFunc(() => {
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
