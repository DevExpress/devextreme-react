import dxNumberBox, {
  Properties,
} from 'devextreme/ui/number_box';

import * as PropTypes from 'prop-types';

import type { dxButtonOptions } from 'devextreme/ui/button';
import type { event, EventInfo } from 'devextreme/events/index';
import type { Component } from 'devextreme/core/component';
import type { template } from 'devextreme/core/templates/template';

import type dxButton from 'devextreme/ui/button';
import type DOMComponent from 'devextreme/core/dom_component';
import type * as NumberBoxTypes from 'devextreme/ui/number_box_types';
import NestedOption from './core/nested-option';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type INumberBoxOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}>;

class NumberBox extends BaseComponent<React.PropsWithChildren<INumberBoxOptions>> {
  public get instance(): dxNumberBox {
    return this._instance;
  }

  protected _WidgetClass = dxNumberBox;

  protected subscribableOptions = ['value'];

  protected independentEvents = ['onChange', 'onContentReady', 'onCopy', 'onCut', 'onDisposing', 'onEnterKey', 'onFocusIn', 'onFocusOut', 'onInitialized', 'onInput', 'onKeyDown', 'onKeyUp', 'onPaste', 'onValueChanged'];

  protected _defaults = {
    defaultValue: 'value',
  };

  protected _expectedChildren = {
    button: { optionName: 'buttons', isCollectionItem: true },
    format: { optionName: 'format', isCollectionItem: false },
  };
}
(NumberBox as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  buttons: PropTypes.array,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  format: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.string,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  invalidValueMessage: PropTypes.string,
  isValid: PropTypes.bool,
  label: PropTypes.string,
  labelMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'static',
      'floating',
      'hidden']),
  ]),
  max: PropTypes.number,
  min: PropTypes.number,
  mode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'number',
      'text',
      'tel']),
  ]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  onContentReady: PropTypes.func,
  onCopy: PropTypes.func,
  onCut: PropTypes.func,
  onDisposing: PropTypes.func,
  onEnterKey: PropTypes.func,
  onFocusIn: PropTypes.func,
  onFocusOut: PropTypes.func,
  onInitialized: PropTypes.func,
  onInput: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onPaste: PropTypes.func,
  onValueChanged: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  showClearButton: PropTypes.bool,
  showSpinButtons: PropTypes.bool,
  step: PropTypes.number,
  stylingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'outlined',
      'underlined',
      'filled']),
  ]),
  tabIndex: PropTypes.number,
  text: PropTypes.string,
  useLargeSpinButtons: PropTypes.bool,
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
  value: PropTypes.number,
  valueChangeEvent: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
};

// owners:
// NumberBox
type IButtonProps = React.PropsWithChildren<{
  location?: 'after' | 'before';
  name?: string;
  options?: dxButtonOptions;
}>;
class Button extends NestedOption<IButtonProps> {
  public static OptionName = 'buttons';

  public static IsCollectionItem = true;

  public static ExpectedChildren = {
    options: { optionName: 'options', isCollectionItem: false },
  };
}

// owners:
// NumberBox
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | any) => string);
  parser?: ((value: string) => number);
  precision?: number;
  type?: 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';
  useCurrencyAccountingStyle?: boolean;
}>;
class Format extends NestedOption<IFormatProps> {
  public static OptionName = 'format';
}

// owners:
// Button
type IOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  bindingOptions?: object;
  disabled?: boolean;
  elementAttr?: object;
  focusStateEnabled?: boolean;
  height?: (() => number) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: { component: dxButton, element: any, event: event, model: any, validationGroup: object }) => void);
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  rtlEnabled?: boolean;
  stylingMode?: 'text' | 'outlined' | 'contained';
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string) | template;
  text?: string;
  type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
  useSubmitBehavior?: boolean;
  validationGroup?: string;
  visible?: boolean;
  width?: (() => number) | number | string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>;
class Options extends NestedOption<IOptionsProps> {
  public static OptionName = 'options';

  public static TemplateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];
}

export default NumberBox;
export {
  NumberBox,
  INumberBoxOptions,
  Button,
  IButtonProps,
  Format,
  IFormatProps,
  Options,
  IOptionsProps,
};
export { NumberBoxTypes };
