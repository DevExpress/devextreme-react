import { requestAnimationFrame } from 'devextreme/animation/frame';
import { deferUpdate } from 'devextreme/core/utils/common';
import * as React from 'react';

import { TemplatesStore } from './templates-store';

class TemplatesRenderer extends React.PureComponent<{ templatesStore: TemplatesStore }> {
  private _updateScheduled = false;

  public scheduleUpdate(useDeferUpdate: boolean): void {
    if (this._updateScheduled) {
      return;
    }

    this._updateScheduled = true;

    const updateCallback = useDeferUpdate ? deferUpdate : requestAnimationFrame;
    updateCallback(() => {
      this.forceUpdate();
      this._updateScheduled = false;
    });
  }

  public render(): React.ReactNode {
    const { templatesStore } = this.props;
    return React.createElement(
      React.Fragment,
      {},
      templatesStore.renderWrappers(),
    );
  }
}

export {
  TemplatesRenderer,
};
