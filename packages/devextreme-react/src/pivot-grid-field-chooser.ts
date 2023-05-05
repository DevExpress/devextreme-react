import dxPivotGridFieldChooser, {
  Properties,
} from 'devextreme/ui/pivot_grid_field_chooser';

import * as PropTypes from 'prop-types';

import type { dxButtonOptions } from 'devextreme/ui/button';
import type { dxTextEditorButton } from 'devextreme/ui/text_box/ui.text_editor.base';
import type { NativeEventInfo, EventInfo, event } from 'devextreme/events/index';
import type { Component } from 'devextreme/core/component';
import type { HeaderFilterSearchConfig } from 'devextreme/common/grids';
import type { template } from 'devextreme/core/templates/template';
import type { dxTextBoxOptions } from 'devextreme/ui/text_box';

import type DOMComponent from 'devextreme/core/dom_component';
import type Editor from 'devextreme/ui/editor/editor';
import type dxButton from 'devextreme/ui/button';
import type * as PivotGridFieldChooserTypes from 'devextreme/ui/pivot_grid_field_chooser_types';
import NestedOption from './core/nested-option';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type IPivotGridFieldChooserOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>;

class PivotGridFieldChooser extends BaseComponent<React.PropsWithChildren<IPivotGridFieldChooserOptions>> {
  public get instance(): dxPivotGridFieldChooser {
    return this._instance;
  }

  protected _WidgetClass = dxPivotGridFieldChooser;

  protected independentEvents = ['onContentReady', 'onContextMenuPreparing', 'onDisposing', 'onInitialized'];

  protected _expectedChildren = {
    headerFilter: { optionName: 'headerFilter', isCollectionItem: false },
    pivotGridFieldChooserTexts: { optionName: 'texts', isCollectionItem: false },
    texts: { optionName: 'texts', isCollectionItem: false },
  };
}
(PivotGridFieldChooser as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowSearch: PropTypes.bool,
  applyChangesMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'instantly',
      'onDemand']),
  ]),
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  encodeHtml: PropTypes.bool,
  focusStateEnabled: PropTypes.bool,
  headerFilter: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  layout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([
      0,
      1,
      2]),
  ]),
  onContentReady: PropTypes.func,
  onContextMenuPreparing: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  searchTimeout: PropTypes.number,
  tabIndex: PropTypes.number,
  texts: PropTypes.object,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
};

// owners:
// EditorOptions
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
// Search
type IEditorOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  bindingOptions?: object;
  buttons?: Array<dxTextEditorButton | string | 'clear'>;
  disabled?: boolean;
  elementAttr?: object;
  focusStateEnabled?: boolean;
  height?: (() => number) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  inputAttr?: any;
  isValid?: boolean;
  label?: string;
  labelMode?: 'static' | 'floating' | 'hidden';
  mask?: string;
  maskChar?: string;
  maskInvalidMessage?: string;
  maskRules?: any;
  maxLength?: number | string;
  mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
  name?: string;
  onChange?: ((e: NativeEventInfo<any>) => void);
  onContentReady?: ((e: EventInfo<any>) => void);
  onCopy?: ((e: NativeEventInfo<any>) => void);
  onCut?: ((e: NativeEventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onEnterKey?: ((e: NativeEventInfo<any>) => void);
  onFocusIn?: ((e: NativeEventInfo<any>) => void);
  onFocusOut?: ((e: NativeEventInfo<any>) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onInput?: ((e: NativeEventInfo<any>) => void);
  onKeyDown?: ((e: NativeEventInfo<any>) => void);
  onKeyUp?: ((e: NativeEventInfo<any>) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onPaste?: ((e: NativeEventInfo<any>) => void);
  onValueChanged?: ((e: { component: Editor, element: any, event: event, model: any, previousValue: object, value: object }) => void);
  placeholder?: string;
  readOnly?: boolean;
  rtlEnabled?: boolean;
  showClearButton?: boolean;
  showMaskMode?: 'always' | 'onFocus';
  spellcheck?: boolean;
  stylingMode?: 'outlined' | 'underlined' | 'filled';
  tabIndex?: number;
  text?: string;
  useMaskedValue?: boolean;
  validationError?: any;
  validationErrors?: Array<any>;
  validationMessageMode?: 'always' | 'auto';
  validationMessagePosition?: 'bottom' | 'left' | 'right' | 'top';
  validationStatus?: 'valid' | 'invalid' | 'pending';
  value?: string;
  valueChangeEvent?: string;
  visible?: boolean;
  width?: (() => number) | number | string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>;
class EditorOptions extends NestedOption<IEditorOptionsProps> {
  public static OptionName = 'editorOptions';

  public static DefaultsProps = {
    defaultValue: 'value',
  };

  public static ExpectedChildren = {
    button: { optionName: 'buttons', isCollectionItem: true },
  };
}

// owners:
// PivotGridFieldChooser
type IHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  height?: number;
  search?: HeaderFilterSearchConfig;
  searchTimeout?: number;
  showRelevantValues?: boolean;
  texts?: object | {
    cancel?: string;
    emptyValue?: string;
    ok?: string;
  };
  width?: number;
}>;
class HeaderFilter extends NestedOption<IHeaderFilterProps> {
  public static OptionName = 'headerFilter';

  public static ExpectedChildren = {
    headerFilterTexts: { optionName: 'texts', isCollectionItem: false },
    search: { optionName: 'search', isCollectionItem: false },
    texts: { optionName: 'texts', isCollectionItem: false },
  };
}

// owners:
// HeaderFilter
type IHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>;
class HeaderFilterTexts extends NestedOption<IHeaderFilterTextsProps> {
  public static OptionName = 'texts';
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

// owners:
// PivotGridFieldChooser
type IPivotGridFieldChooserTextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>;
class PivotGridFieldChooserTexts extends NestedOption<IPivotGridFieldChooserTextsProps> {
  public static OptionName = 'texts';
}

// owners:
// HeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: dxTextBoxOptions;
  enabled?: boolean;
  mode?: 'contains' | 'startswith' | 'equals';
  timeout?: number;
}>;
class Search extends NestedOption<ISearchProps> {
  public static OptionName = 'search';

  public static ExpectedChildren = {
    editorOptions: { optionName: 'editorOptions', isCollectionItem: false },
  };
}

// owners:
// HeaderFilter
// PivotGridFieldChooser
type ITextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>;
class Texts extends NestedOption<ITextsProps> {
  public static OptionName = 'texts';
}

export default PivotGridFieldChooser;
export {
  PivotGridFieldChooser,
  IPivotGridFieldChooserOptions,
  Button,
  IButtonProps,
  EditorOptions,
  IEditorOptionsProps,
  HeaderFilter,
  IHeaderFilterProps,
  HeaderFilterTexts,
  IHeaderFilterTextsProps,
  Options,
  IOptionsProps,
  PivotGridFieldChooserTexts,
  IPivotGridFieldChooserTextsProps,
  Search,
  ISearchProps,
  Texts,
  ITextsProps,
};
export { PivotGridFieldChooserTypes };
