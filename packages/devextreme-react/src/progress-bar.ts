import dxProgressBar, {
  Properties,
} from 'devextreme/ui/progress_bar';

import * as PropTypes from 'prop-types';
import type * as ProgressBarTypes from 'devextreme/ui/progress_bar_types';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type IProgressBarOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultValue?: false | number;
  onValueChange?: (value: false | number) => void;
}>;

class ProgressBar extends BaseComponent<React.PropsWithChildren<IProgressBarOptions>> {
  public get instance(): dxProgressBar {
    return this._instance;
  }

  protected _WidgetClass = dxProgressBar;

  protected subscribableOptions = ['value'];

  protected independentEvents = ['onComplete', 'onContentReady', 'onDisposing', 'onInitialized', 'onValueChanged'];

  protected _defaults = {
    defaultValue: 'value',
  };
}
(ProgressBar as any).propTypes = {
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  isValid: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  onComplete: PropTypes.func,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onValueChanged: PropTypes.func,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  showStatus: PropTypes.bool,
  statusFormat: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  validationErrors: PropTypes.array,
  validationMessageMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'always',
      'auto']),
  ]),
  validationMessagePosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'bottom',
      'left',
      'right',
      'top']),
  ]),
  validationStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'valid',
      'invalid',
      'pending']),
  ]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
};
export default ProgressBar;
export {
  ProgressBar,
  IProgressBarOptions,
};
export { ProgressBarTypes };
