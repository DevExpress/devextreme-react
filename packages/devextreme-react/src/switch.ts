import dxSwitch, {
    Properties
} from "devextreme/ui/switch";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

type ISwitchOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
}>

class Switch extends BaseComponent<React.PropsWithChildren<ISwitchOptions>> {

  public get instance(): dxSwitch {
    return this._instance;
  }

  protected _WidgetClass = dxSwitch;

  protected subscribableOptions = ["value"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onValueChanged"];

  protected _defaults = {
    defaultValue: "value"
  };
}
(Switch as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  isValid: PropTypes.bool,
  name: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onValueChanged: PropTypes.func,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  switchedOffText: PropTypes.string,
  switchedOnText: PropTypes.string,
  tabIndex: PropTypes.number,
  validationErrors: PropTypes.array,
  validationMessageMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "always",
      "auto"])
  ]),
  validationMessagePosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "left",
      "right",
      "top"])
  ]),
  validationStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "valid",
      "invalid",
      "pending"])
  ]),
  value: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};
export default Switch;
export {
  Switch,
  ISwitchOptions
};
import type * as SwitchTypes from 'devextreme/ui/switch_types';
export { SwitchTypes };

