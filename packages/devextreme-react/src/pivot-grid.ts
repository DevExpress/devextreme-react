import dxPivotGrid, {
  Properties,
} from 'devextreme/ui/pivot_grid';

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
import type * as PivotGridTypes from 'devextreme/ui/pivot_grid_types';
import NestedOption from './core/nested-option';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type IPivotGridOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>;

class PivotGrid extends BaseComponent<React.PropsWithChildren<IPivotGridOptions>> {
  public get instance(): dxPivotGrid {
    return this._instance;
  }

  protected _WidgetClass = dxPivotGrid;

  protected independentEvents = ['onCellClick', 'onCellPrepared', 'onContentReady', 'onContextMenuPreparing', 'onDisposing', 'onExporting', 'onInitialized'];

  protected _expectedChildren = {
    export: { optionName: 'export', isCollectionItem: false },
    fieldChooser: { optionName: 'fieldChooser', isCollectionItem: false },
    fieldPanel: { optionName: 'fieldPanel', isCollectionItem: false },
    headerFilter: { optionName: 'headerFilter', isCollectionItem: false },
    loadPanel: { optionName: 'loadPanel', isCollectionItem: false },
    pivotGridTexts: { optionName: 'texts', isCollectionItem: false },
    scrolling: { optionName: 'scrolling', isCollectionItem: false },
    stateStoring: { optionName: 'stateStoring', isCollectionItem: false },
    texts: { optionName: 'texts', isCollectionItem: false },
  };
}
(PivotGrid as any).propTypes = {
  allowExpandAll: PropTypes.bool,
  allowFiltering: PropTypes.bool,
  allowSorting: PropTypes.bool,
  allowSortingBySummary: PropTypes.bool,
  dataFieldArea: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'column',
      'row']),
  ]),
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  encodeHtml: PropTypes.bool,
  export: PropTypes.object,
  fieldChooser: PropTypes.object,
  fieldPanel: PropTypes.object,
  headerFilter: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  hideEmptySummaryCells: PropTypes.bool,
  hint: PropTypes.string,
  loadPanel: PropTypes.object,
  onCellClick: PropTypes.func,
  onCellPrepared: PropTypes.func,
  onContentReady: PropTypes.func,
  onContextMenuPreparing: PropTypes.func,
  onDisposing: PropTypes.func,
  onExporting: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rowHeaderLayout: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'standard',
      'tree']),
  ]),
  rtlEnabled: PropTypes.bool,
  scrolling: PropTypes.object,
  showBorders: PropTypes.bool,
  showColumnGrandTotals: PropTypes.bool,
  showColumnTotals: PropTypes.bool,
  showRowGrandTotals: PropTypes.bool,
  showRowTotals: PropTypes.bool,
  showTotalsPrior: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'both',
      'columns',
      'none',
      'rows']),
  ]),
  stateStoring: PropTypes.object,
  tabIndex: PropTypes.number,
  texts: PropTypes.object,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  wordWrapEnabled: PropTypes.bool,
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
// PivotGrid
type IExportProps = React.PropsWithChildren<{
  enabled?: boolean;
}>;
class Export extends NestedOption<IExportProps> {
  public static OptionName = 'export';
}

// owners:
// PivotGrid
type IFieldChooserProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  applyChangesMode?: 'instantly' | 'onDemand';
  enabled?: boolean;
  height?: number;
  layout?: 0 | 1 | 2;
  searchTimeout?: number;
  texts?: object | {
    allFields?: string;
    columnFields?: string;
    dataFields?: string;
    filterFields?: string;
    rowFields?: string;
  };
  title?: string;
  width?: number;
}>;
class FieldChooser extends NestedOption<IFieldChooserProps> {
  public static OptionName = 'fieldChooser';

  public static ExpectedChildren = {
    fieldChooserTexts: { optionName: 'texts', isCollectionItem: false },
    texts: { optionName: 'texts', isCollectionItem: false },
  };
}

// owners:
// FieldChooser
type IFieldChooserTextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>;
class FieldChooserTexts extends NestedOption<IFieldChooserTextsProps> {
  public static OptionName = 'texts';
}

// owners:
// PivotGrid
type IFieldPanelProps = React.PropsWithChildren<{
  allowFieldDragging?: boolean;
  showColumnFields?: boolean;
  showDataFields?: boolean;
  showFilterFields?: boolean;
  showRowFields?: boolean;
  texts?: object | {
    columnFieldArea?: string;
    dataFieldArea?: string;
    filterFieldArea?: string;
    rowFieldArea?: string;
  };
  visible?: boolean;
}>;
class FieldPanel extends NestedOption<IFieldPanelProps> {
  public static OptionName = 'fieldPanel';

  public static ExpectedChildren = {
    fieldPanelTexts: { optionName: 'texts', isCollectionItem: false },
    texts: { optionName: 'texts', isCollectionItem: false },
  };
}

// owners:
// FieldPanel
type IFieldPanelTextsProps = React.PropsWithChildren<{
  columnFieldArea?: string;
  dataFieldArea?: string;
  filterFieldArea?: string;
  rowFieldArea?: string;
}>;
class FieldPanelTexts extends NestedOption<IFieldPanelTextsProps> {
  public static OptionName = 'texts';
}

// owners:
// PivotGrid
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
// PivotGrid
type ILoadPanelProps = React.PropsWithChildren<{
  enabled?: boolean;
  height?: number;
  indicatorSrc?: string;
  shading?: boolean;
  shadingColor?: string;
  showIndicator?: boolean;
  showPane?: boolean;
  text?: string;
  width?: number;
}>;
class LoadPanel extends NestedOption<ILoadPanelProps> {
  public static OptionName = 'loadPanel';
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
// PivotGrid
type IPivotGridTextsProps = React.PropsWithChildren<{
  collapseAll?: string;
  dataNotAvailable?: string;
  expandAll?: string;
  exportToExcel?: string;
  grandTotal?: string;
  noData?: string;
  removeAllSorting?: string;
  showFieldChooser?: string;
  sortColumnBySummary?: string;
  sortRowBySummary?: string;
  total?: string;
}>;
class PivotGridTexts extends NestedOption<IPivotGridTextsProps> {
  public static OptionName = 'texts';
}

// owners:
// PivotGrid
type IScrollingProps = React.PropsWithChildren<{
  mode?: 'standard' | 'virtual';
  useNative?: boolean | 'auto';
}>;
class Scrolling extends NestedOption<IScrollingProps> {
  public static OptionName = 'scrolling';
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
// PivotGrid
type IStateStoringProps = React.PropsWithChildren<{
  customLoad?: (() => any);
  customSave?: ((state: object) => void);
  enabled?: boolean;
  savingTimeout?: number;
  storageKey?: string;
  type?: 'custom' | 'localStorage' | 'sessionStorage';
}>;
class StateStoring extends NestedOption<IStateStoringProps> {
  public static OptionName = 'stateStoring';
}

// owners:
// FieldChooser
// FieldPanel
// HeaderFilter
// PivotGrid
type ITextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
  columnFieldArea?: string;
  dataFieldArea?: string;
  filterFieldArea?: string;
  rowFieldArea?: string;
  cancel?: string;
  emptyValue?: string;
  ok?: string;
  collapseAll?: string;
  dataNotAvailable?: string;
  expandAll?: string;
  exportToExcel?: string;
  grandTotal?: string;
  noData?: string;
  removeAllSorting?: string;
  showFieldChooser?: string;
  sortColumnBySummary?: string;
  sortRowBySummary?: string;
  total?: string;
}>;
class Texts extends NestedOption<ITextsProps> {
  public static OptionName = 'texts';
}

export default PivotGrid;
export {
  PivotGrid,
  IPivotGridOptions,
  Button,
  IButtonProps,
  EditorOptions,
  IEditorOptionsProps,
  Export,
  IExportProps,
  FieldChooser,
  IFieldChooserProps,
  FieldChooserTexts,
  IFieldChooserTextsProps,
  FieldPanel,
  IFieldPanelProps,
  FieldPanelTexts,
  IFieldPanelTextsProps,
  HeaderFilter,
  IHeaderFilterProps,
  HeaderFilterTexts,
  IHeaderFilterTextsProps,
  LoadPanel,
  ILoadPanelProps,
  Options,
  IOptionsProps,
  PivotGridTexts,
  IPivotGridTextsProps,
  Scrolling,
  IScrollingProps,
  Search,
  ISearchProps,
  StateStoring,
  IStateStoringProps,
  Texts,
  ITextsProps,
};
export { PivotGridTypes };
