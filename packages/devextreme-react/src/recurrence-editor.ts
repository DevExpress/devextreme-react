import dxRecurrenceEditor, {
    Properties
} from "devextreme/ui/recurrence_editor";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

type IRecurrenceEditorOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>

class RecurrenceEditor extends BaseComponent<React.PropsWithChildren<IRecurrenceEditorOptions>> {

  public get instance(): dxRecurrenceEditor {
    return this._instance;
  }

  protected _WidgetClass = dxRecurrenceEditor;

  protected subscribableOptions = ["value"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onValueChanged"];

  protected _defaults = {
    defaultValue: "value"
  };
}
(RecurrenceEditor as any).propTypes = {
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
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onValueChanged: PropTypes.func,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
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
  value: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};
export default RecurrenceEditor;
export {
  RecurrenceEditor,
  IRecurrenceEditorOptions
};
