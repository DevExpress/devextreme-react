import dxButton, {
  Properties,
} from 'devextreme/ui/button';

import * as PropTypes from 'prop-types';
import type * as ButtonTypes from 'devextreme/ui/button_types';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type IButtonOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>;

class Button extends BaseComponent<React.PropsWithChildren<IButtonOptions>> {
  public get instance(): dxButton {
    return this._instance;
  }

  protected _WidgetClass = dxButton;

  protected independentEvents = ['onClick', 'onContentReady', 'onDisposing', 'onInitialized'];

  protected _templateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];
}
(Button as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  stylingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'text',
      'outlined',
      'contained']),
  ]),
  tabIndex: PropTypes.number,
  text: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'back',
      'danger',
      'default',
      'normal',
      'success']),
  ]),
  useSubmitBehavior: PropTypes.bool,
  validationGroup: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
};
export default Button;
export {
  Button,
  IButtonOptions,
};
export { ButtonTypes };
