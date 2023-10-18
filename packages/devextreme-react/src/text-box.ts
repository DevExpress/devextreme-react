import dxTextBox, {
    Properties
} from "devextreme/ui/text_box";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ChangeEvent, ContentReadyEvent, CopyEvent, CutEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, KeyDownEvent, KeyUpEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, ClickEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ITextBoxOptionsNarrowedEvents = {
  onChange?: ((e: ChangeEvent) => any);
  onContentReady?: ((e: ContentReadyEvent) => any);
  onCopy?: ((e: CopyEvent) => any);
  onCut?: ((e: CutEvent) => any);
  onDisposing?: ((e: DisposingEvent) => any);
  onEnterKey?: ((e: EnterKeyEvent) => any);
  onFocusIn?: ((e: FocusInEvent) => any);
  onFocusOut?: ((e: FocusOutEvent) => any);
  onInitialized?: ((e: InitializedEvent) => any);
  onInput?: ((e: InputEvent) => any);
  onKeyDown?: ((e: KeyDownEvent) => any);
  onKeyUp?: ((e: KeyUpEvent) => any);
  onPaste?: ((e: PasteEvent) => any);
  onValueChanged?: ((e: ValueChangedEvent) => any);
}

type ITextBoxOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ITextBoxOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>

class TextBox extends BaseComponent<React.PropsWithChildren<ITextBoxOptions>> {

  public get instance(): dxTextBox {
    return this._instance;
  }

  protected _WidgetClass = dxTextBox;

  protected subscribableOptions = ["value"];

  protected independentEvents = ["onChange","onContentReady","onCopy","onCut","onDisposing","onEnterKey","onFocusIn","onFocusOut","onInitialized","onInput","onKeyDown","onKeyUp","onPaste","onValueChanged"];

  protected _defaults = {
    defaultValue: "value"
  };

  protected _expectedChildren = {
    button: { optionName: "buttons", isCollectionItem: true }
  };
}
(TextBox as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  buttons: PropTypes.array,
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
  label: PropTypes.string,
  labelMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "static",
      "floating",
      "hidden"])
  ]),
  mask: PropTypes.string,
  maskChar: PropTypes.string,
  maskInvalidMessage: PropTypes.string,
  maxLength: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  mode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "email",
      "password",
      "search",
      "tel",
      "text",
      "url"])
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
  showMaskMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "always",
      "onFocus"])
  ]),
  spellcheck: PropTypes.bool,
  stylingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "outlined",
      "underlined",
      "filled"])
  ]),
  tabIndex: PropTypes.number,
  text: PropTypes.string,
  useMaskedValue: PropTypes.bool,
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
  value: PropTypes.string,
  valueChangeEvent: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// TextBox
type IButtonProps = React.PropsWithChildren<{
  location?: "after" | "before";
  name?: string;
  options?: dxButtonOptions;
}>
class Button extends NestedOption<IButtonProps> {
  public static OptionName = "buttons";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    options: { optionName: "options", isCollectionItem: false }
  };
}

// owners:
// Button
type IOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => any) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: ClickEvent) => any);
  onContentReady?: ((e: ButtonContentReadyEvent) => any);
  onDisposing?: ((e: ButtonDisposingEvent) => any);
  onInitialized?: ((e: ButtonInitializedEvent) => any);
  onOptionChanged?: ((e: OptionChangedEvent) => any);
  rtlEnabled?: boolean;
  stylingMode?: "text" | "outlined" | "contained";
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => any) | template;
  text?: string;
  type?: "back" | "danger" | "default" | "normal" | "success";
  useSubmitBehavior?: boolean;
  validationGroup?: string;
  visible?: boolean;
  width?: (() => any) | number | string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Options extends NestedOption<IOptionsProps> {
  public static OptionName = "options";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

export default TextBox;
export {
  TextBox,
  ITextBoxOptions,
  Button,
  IButtonProps,
  Options,
  IOptionsProps
};
import type * as TextBoxTypes from 'devextreme/ui/text_box_types';
export { TextBoxTypes };

