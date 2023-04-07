export { ExplicitTypes } from "devextreme/ui/tree_list";
import dxTreeList, {
    Properties
} from "devextreme/ui/tree_list";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxTreeListColumn, dxTreeListRowObject, dxTreeListColumnButton, dxTreeListToolbarItem } from "devextreme/ui/tree_list";
import type { DataChange, GridBase } from "devextreme/common/grids";
import type { AnimationConfig, AnimationState } from "devextreme/animation/fx";
import type { event, EventInfo } from "devextreme/events/index";
import type { template } from "devextreme/core/templates/template";
import type { dxFormSimpleItem, dxFormOptions, dxFormGroupItem, dxFormTabbedItem, dxFormEmptyItem, dxFormButtonItem } from "devextreme/ui/form";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/abstract_store";
import type { dxFilterBuilderField, dxFilterBuilderCustomOperation } from "devextreme/ui/filter_builder";
import type { dxPopupOptions, dxPopupToolbarItem } from "devextreme/ui/popup";
import type { Component } from "devextreme/core/component";
import type { PositionConfig } from "devextreme/animation/position";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

import type dxFilterBuilder from "devextreme/ui/filter_builder";
import type Widget from "devextreme/ui/widget/ui.widget";
import type DOMComponent from "devextreme/core/dom_component";
import type dxOverlay from "devextreme/ui/overlay";
import type dxPopup from "devextreme/ui/popup";
import type dxForm from "devextreme/ui/form";
import type dxSortable from "devextreme/ui/sortable";
import type dxDraggable from "devextreme/ui/draggable";

import type * as LocalizationTypes from "devextreme/localization";
import type * as CommonTypes from "devextreme/common";

type ITreeListOptions<TRowData = any, TKey = any> = React.PropsWithChildren<Properties<TRowData, TKey> & IHtmlOptions & {
  dataSource?: Properties<TRowData, TKey>["dataSource"];
  defaultColumns?: Array<dxTreeListColumn | string>;
  defaultEditing?: object;
  defaultExpandedRowKeys?: Array<any>;
  defaultFilterPanel?: object;
  defaultFilterValue?: Array<any> | (() => any) | string;
  defaultFocusedColumnIndex?: number;
  defaultFocusedRowIndex?: number;
  defaultFocusedRowKey?: any;
  defaultPaging?: object;
  defaultSearchPanel?: object;
  defaultSelectedRowKeys?: Array<any>;
  onColumnsChange?: (value: Array<dxTreeListColumn | string>) => void;
  onEditingChange?: (value: object) => void;
  onExpandedRowKeysChange?: (value: Array<any>) => void;
  onFilterPanelChange?: (value: object) => void;
  onFilterValueChange?: (value: Array<any> | (() => any) | string) => void;
  onFocusedColumnIndexChange?: (value: number) => void;
  onFocusedRowIndexChange?: (value: number) => void;
  onFocusedRowKeyChange?: (value: any) => void;
  onPagingChange?: (value: object) => void;
  onSearchPanelChange?: (value: object) => void;
  onSelectedRowKeysChange?: (value: Array<any>) => void;
}>

class TreeList<TRowData = any, TKey = any> extends BaseComponent<React.PropsWithChildren<ITreeListOptions<TRowData, TKey>>> {

  public get instance(): dxTreeList<TRowData, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxTreeList;

  protected subscribableOptions = ["columns","editing","editing.changes","editing.editColumnName","editing.editRowKey","expandedRowKeys","filterPanel","filterPanel.filterEnabled","filterValue","focusedColumnIndex","focusedRowIndex","focusedRowKey","paging","paging.pageIndex","paging.pageSize","searchPanel","searchPanel.text","selectedRowKeys"];

  protected independentEvents = ["onAdaptiveDetailRowPreparing","onCellClick","onCellDblClick","onCellPrepared","onContentReady","onContextMenuPreparing","onDataErrorOccurred","onDisposing","onEditCanceled","onEditCanceling","onEditingStart","onEditorPrepared","onEditorPreparing","onFocusedCellChanging","onFocusedRowChanging","onInitialized","onInitNewRow","onKeyDown","onNodesInitialized","onRowClick","onRowCollapsed","onRowCollapsing","onRowDblClick","onRowExpanded","onRowExpanding","onRowInserted","onRowInserting","onRowPrepared","onRowRemoved","onRowRemoving","onRowUpdated","onRowUpdating","onRowValidating","onSaved","onSaving","onToolbarPreparing"];

  protected _defaults = {
    defaultColumns: "columns",
    defaultEditing: "editing",
    defaultExpandedRowKeys: "expandedRowKeys",
    defaultFilterPanel: "filterPanel",
    defaultFilterValue: "filterValue",
    defaultFocusedColumnIndex: "focusedColumnIndex",
    defaultFocusedRowIndex: "focusedRowIndex",
    defaultFocusedRowKey: "focusedRowKey",
    defaultPaging: "paging",
    defaultSearchPanel: "searchPanel",
    defaultSelectedRowKeys: "selectedRowKeys"
  };

  protected _expectedChildren = {
    column: { optionName: "columns", isCollectionItem: true },
    columnChooser: { optionName: "columnChooser", isCollectionItem: false },
    columnFixing: { optionName: "columnFixing", isCollectionItem: false },
    editing: { optionName: "editing", isCollectionItem: false },
    filterBuilder: { optionName: "filterBuilder", isCollectionItem: false },
    filterBuilderPopup: { optionName: "filterBuilderPopup", isCollectionItem: false },
    filterPanel: { optionName: "filterPanel", isCollectionItem: false },
    filterRow: { optionName: "filterRow", isCollectionItem: false },
    headerFilter: { optionName: "headerFilter", isCollectionItem: false },
    keyboardNavigation: { optionName: "keyboardNavigation", isCollectionItem: false },
    loadPanel: { optionName: "loadPanel", isCollectionItem: false },
    pager: { optionName: "pager", isCollectionItem: false },
    paging: { optionName: "paging", isCollectionItem: false },
    remoteOperations: { optionName: "remoteOperations", isCollectionItem: false },
    rowDragging: { optionName: "rowDragging", isCollectionItem: false },
    scrolling: { optionName: "scrolling", isCollectionItem: false },
    searchPanel: { optionName: "searchPanel", isCollectionItem: false },
    selection: { optionName: "selection", isCollectionItem: false },
    sorting: { optionName: "sorting", isCollectionItem: false },
    stateStoring: { optionName: "stateStoring", isCollectionItem: false },
    toolbar: { optionName: "toolbar", isCollectionItem: false },
    treeListHeaderFilter: { optionName: "headerFilter", isCollectionItem: false }
  };
}
(TreeList as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowColumnReordering: PropTypes.bool,
  allowColumnResizing: PropTypes.bool,
  autoExpandAll: PropTypes.bool,
  autoNavigateToFocusedRow: PropTypes.bool,
  cacheEnabled: PropTypes.bool,
  cellHintEnabled: PropTypes.bool,
  columnAutoWidth: PropTypes.bool,
  columnChooser: PropTypes.object,
  columnFixing: PropTypes.object,
  columnHidingEnabled: PropTypes.bool,
  columnMinWidth: PropTypes.number,
  columnResizingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "nextColumn",
      "widget"])
  ]),
  columns: PropTypes.array,
  columnWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto"])
  ])
  ]),
  customizeColumns: PropTypes.func,
  dataStructure: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "plain",
      "tree"])
  ]),
  dateSerializationFormat: PropTypes.string,
  disabled: PropTypes.bool,
  editing: PropTypes.object,
  elementAttr: PropTypes.object,
  errorRowEnabled: PropTypes.bool,
  expandedRowKeys: PropTypes.array,
  expandNodesOnFiltering: PropTypes.bool,
  filterBuilder: PropTypes.object,
  filterBuilderPopup: PropTypes.object,
  filterMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "fullBranch",
      "withAncestors",
      "matchOnly"])
  ]),
  filterPanel: PropTypes.object,
  filterRow: PropTypes.object,
  filterSyncEnabled: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto"])
  ])
  ]),
  filterValue: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.string
  ]),
  focusedColumnIndex: PropTypes.number,
  focusedRowEnabled: PropTypes.bool,
  focusedRowIndex: PropTypes.number,
  hasItemsExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  headerFilter: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  highlightChanges: PropTypes.bool,
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  itemsExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  keyboardNavigation: PropTypes.object,
  keyExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  loadPanel: PropTypes.object,
  noDataText: PropTypes.string,
  onAdaptiveDetailRowPreparing: PropTypes.func,
  onCellClick: PropTypes.func,
  onCellDblClick: PropTypes.func,
  onCellHoverChanged: PropTypes.func,
  onCellPrepared: PropTypes.func,
  onContentReady: PropTypes.func,
  onContextMenuPreparing: PropTypes.func,
  onDataErrorOccurred: PropTypes.func,
  onDisposing: PropTypes.func,
  onEditCanceled: PropTypes.func,
  onEditCanceling: PropTypes.func,
  onEditingStart: PropTypes.func,
  onEditorPrepared: PropTypes.func,
  onEditorPreparing: PropTypes.func,
  onFocusedCellChanged: PropTypes.func,
  onFocusedCellChanging: PropTypes.func,
  onFocusedRowChanged: PropTypes.func,
  onFocusedRowChanging: PropTypes.func,
  onInitialized: PropTypes.func,
  onInitNewRow: PropTypes.func,
  onKeyDown: PropTypes.func,
  onNodesInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onRowClick: PropTypes.func,
  onRowCollapsed: PropTypes.func,
  onRowCollapsing: PropTypes.func,
  onRowDblClick: PropTypes.func,
  onRowExpanded: PropTypes.func,
  onRowExpanding: PropTypes.func,
  onRowInserted: PropTypes.func,
  onRowInserting: PropTypes.func,
  onRowPrepared: PropTypes.func,
  onRowRemoved: PropTypes.func,
  onRowRemoving: PropTypes.func,
  onRowUpdated: PropTypes.func,
  onRowUpdating: PropTypes.func,
  onRowValidating: PropTypes.func,
  onSaved: PropTypes.func,
  onSaving: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  onToolbarPreparing: PropTypes.func,
  pager: PropTypes.object,
  paging: PropTypes.object,
  parentIdExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  remoteOperations: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto"])
  ])
  ]),
  renderAsync: PropTypes.bool,
  repaintChangesOnly: PropTypes.bool,
  rowAlternationEnabled: PropTypes.bool,
  rowDragging: PropTypes.object,
  rtlEnabled: PropTypes.bool,
  scrolling: PropTypes.object,
  searchPanel: PropTypes.object,
  selectedRowKeys: PropTypes.array,
  selection: PropTypes.object,
  showBorders: PropTypes.bool,
  showColumnHeaders: PropTypes.bool,
  showColumnLines: PropTypes.bool,
  showRowLines: PropTypes.bool,
  sorting: PropTypes.object,
  stateStoring: PropTypes.object,
  syncLookupFilterValues: PropTypes.bool,
  tabIndex: PropTypes.number,
  toolbar: PropTypes.object,
  twoWayBindingEnabled: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  wordWrapEnabled: PropTypes.bool
};


// owners:
// Popup
type IAnimationProps = React.PropsWithChildren<{
  hide?: AnimationConfig;
  show?: AnimationConfig;
}>
class Animation extends NestedOption<IAnimationProps> {
  public static OptionName = "animation";
  public static ExpectedChildren = {
    hide: { optionName: "hide", isCollectionItem: false },
    show: { optionName: "show", isCollectionItem: false }
  };
}

// owners:
// FormItem
// Column
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: object, data: object, formItem: object, rule: object, validator: object, value: string | number }) => any);
}>
class AsyncRule extends NestedOption<IAsyncRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "async"
  };
}

// owners:
// Position
type IAtProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
class At extends NestedOption<IAtProps> {
  public static OptionName = "at";
}

// owners:
// Position
type IBoundaryOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class BoundaryOffset extends NestedOption<IBoundaryOffsetProps> {
  public static OptionName = "boundaryOffset";
}

// owners:
// Column
type IButtonProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean | ((options: { column: dxTreeListColumn, component: dxTreeList, row: dxTreeListRowObject }) => boolean);
  hint?: string;
  icon?: string;
  name?: "add" | "cancel" | "delete" | "edit" | "save" | "undelete";
  onClick?: ((e: { column: dxTreeListColumn, component: dxTreeList, element: any, event: event, model: any, row: dxTreeListRowObject }) => void);
  template?: ((cellElement: any, cellInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList, data: object, key: any, row: dxTreeListRowObject, rowIndex: number, rowType: string }) => string) | template;
  text?: string;
  visible?: boolean | ((options: { column: dxTreeListColumn, component: dxTreeList, row: dxTreeListRowObject }) => boolean);
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Button extends NestedOption<IButtonProps> {
  public static OptionName = "buttons";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// Editing
type IChangeProps = React.PropsWithChildren<{
  data?: any;
  insertAfterKey?: any;
  insertBeforeKey?: any;
  key?: any;
  type?: "insert" | "update" | "remove";
}>
class Change extends NestedOption<IChangeProps> {
  public static OptionName = "changes";
  public static IsCollectionItem = true;
}

// owners:
// Form
type IColCountByScreenProps = React.PropsWithChildren<{
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
}>
class ColCountByScreen extends NestedOption<IColCountByScreenProps> {
  public static OptionName = "colCountByScreen";
}

// owners:
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: "fit" | "flip" | "flipfit" | "none";
  y?: "fit" | "flip" | "flipfit" | "none";
}>
class Collision extends NestedOption<ICollisionProps> {
  public static OptionName = "collision";
}

// owners:
// TreeList
type IColumnProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  allowEditing?: boolean;
  allowFiltering?: boolean;
  allowFixing?: boolean;
  allowHeaderFiltering?: boolean;
  allowHiding?: boolean;
  allowReordering?: boolean;
  allowResizing?: boolean;
  allowSearch?: boolean;
  allowSorting?: boolean;
  buttons?: Array<dxTreeListColumnButton | "add" | "cancel" | "delete" | "edit" | "save" | "undelete">;
  calculateCellValue?: ((rowData: object) => any);
  calculateDisplayValue?: ((rowData: object) => any) | string;
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string);
  calculateSortValue?: ((rowData: object) => any) | string;
  caption?: string;
  cellTemplate?: ((cellElement: any, cellInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList, data: object, displayValue: any, oldValue: any, row: dxTreeListRowObject, rowIndex: number, rowType: string, text: string, value: any, watch: (() => void) }) => any) | template;
  columns?: Array<dxTreeListColumn | string>;
  cssClass?: string;
  customizeText?: ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string);
  dataField?: string;
  dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
  editCellTemplate?: ((cellElement: any, cellInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList, data: object, displayValue: any, row: dxTreeListRowObject, rowIndex: number, rowType: string, setValue(newValue, newText): any, text: string, value: any, watch: (() => void) }) => any) | template;
  editorOptions?: any;
  encodeHtml?: boolean;
  falseText?: string;
  filterOperations?: Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | "anyof" | "noneof" | string>;
  filterType?: "exclude" | "include";
  filterValue?: any;
  filterValues?: Array<any>;
  fixed?: boolean;
  fixedPosition?: "left" | "right";
  format?: LocalizationTypes.Format;
  formItem?: dxFormSimpleItem;
  headerCellTemplate?: ((columnHeader: any, headerInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList }) => any) | template;
  headerFilter?: object | {
    allowSearch?: boolean;
    dataSource?: Array<any> | DataSourceOptions | ((options: { component: object, dataSource: DataSourceOptions | null }) => void) | null | Store;
    groupInterval?: number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year";
    height?: number;
    searchMode?: "contains" | "startswith" | "equals";
    width?: number;
  };
  hidingPriority?: number;
  isBand?: boolean;
  lookup?: object | {
    allowClearing?: boolean;
    calculateCellValue?: ((rowData: object) => any);
    dataSource?: Array<any> | DataSourceOptions | ((options: { data: object, key: any }) => Array<any>) | null | Store;
    displayExpr?: ((data: object) => string) | string;
    valueExpr?: string;
  };
  minWidth?: number;
  name?: string;
  ownerBand?: number;
  renderAsync?: boolean;
  selectedFilterOperation?: "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith";
  setCellValue?: ((newData: object, value: any, currentRowData: object) => any);
  showEditorAlways?: boolean;
  showInColumnChooser?: boolean;
  sortIndex?: number;
  sortingMethod?: ((value1: any, value2: any) => number);
  sortOrder?: "asc" | "desc";
  trueText?: string;
  type?: "adaptive" | "buttons" | "drag";
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number;
  width?: number | string;
  defaultFilterValue?: any;
  onFilterValueChange?: (value: any) => void;
  defaultFilterValues?: Array<any>;
  onFilterValuesChange?: (value: Array<any>) => void;
  defaultSelectedFilterOperation?: "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith";
  onSelectedFilterOperationChange?: (value: "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith") => void;
  defaultSortOrder?: "asc" | "desc";
  onSortOrderChange?: (value: "asc" | "desc") => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultVisibleIndex?: number;
  onVisibleIndexChange?: (value: number) => void;
  cellRender?: (...params: any) => React.ReactNode;
  cellComponent?: React.ComponentType<any>;
  cellKeyFn?: (data: any) => string;
  editCellRender?: (...params: any) => React.ReactNode;
  editCellComponent?: React.ComponentType<any>;
  editCellKeyFn?: (data: any) => string;
  headerCellRender?: (...params: any) => React.ReactNode;
  headerCellComponent?: React.ComponentType<any>;
  headerCellKeyFn?: (data: any) => string;
}>
class Column extends NestedOption<IColumnProps> {
  public static OptionName = "columns";
  public static IsCollectionItem = true;
  public static DefaultsProps = {
    defaultFilterValue: "filterValue",
    defaultFilterValues: "filterValues",
    defaultSelectedFilterOperation: "selectedFilterOperation",
    defaultSortOrder: "sortOrder",
    defaultVisible: "visible",
    defaultVisibleIndex: "visibleIndex"
  };
  public static ExpectedChildren = {
    AsyncRule: { optionName: "validationRules", isCollectionItem: true },
    button: { optionName: "buttons", isCollectionItem: true },
    columnHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
    columnLookup: { optionName: "lookup", isCollectionItem: false },
    CompareRule: { optionName: "validationRules", isCollectionItem: true },
    CustomRule: { optionName: "validationRules", isCollectionItem: true },
    EmailRule: { optionName: "validationRules", isCollectionItem: true },
    format: { optionName: "format", isCollectionItem: false },
    formItem: { optionName: "formItem", isCollectionItem: false },
    headerFilter: { optionName: "headerFilter", isCollectionItem: false },
    lookup: { optionName: "lookup", isCollectionItem: false },
    NumericRule: { optionName: "validationRules", isCollectionItem: true },
    PatternRule: { optionName: "validationRules", isCollectionItem: true },
    RangeRule: { optionName: "validationRules", isCollectionItem: true },
    RequiredRule: { optionName: "validationRules", isCollectionItem: true },
    StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
    validationRule: { optionName: "validationRules", isCollectionItem: true }
  };
  public static TemplateProps = [{
    tmplOption: "cellTemplate",
    render: "cellRender",
    component: "cellComponent",
    keyFn: "cellKeyFn"
  }, {
    tmplOption: "editCellTemplate",
    render: "editCellRender",
    component: "editCellComponent",
    keyFn: "editCellKeyFn"
  }, {
    tmplOption: "headerCellTemplate",
    render: "headerCellRender",
    component: "headerCellComponent",
    keyFn: "headerCellKeyFn"
  }];
}

// owners:
// TreeList
type IColumnChooserProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  emptyPanelText?: string;
  enabled?: boolean;
  height?: number;
  mode?: "dragAndDrop" | "select";
  searchTimeout?: number;
  sortOrder?: "asc" | "desc";
  title?: string;
  width?: number;
}>
class ColumnChooser extends NestedOption<IColumnChooserProps> {
  public static OptionName = "columnChooser";
}

// owners:
// TreeList
type IColumnFixingProps = React.PropsWithChildren<{
  enabled?: boolean;
  texts?: object | {
    fix?: string;
    leftPosition?: string;
    rightPosition?: string;
    unfix?: string;
  };
}>
class ColumnFixing extends NestedOption<IColumnFixingProps> {
  public static OptionName = "columnFixing";
  public static ExpectedChildren = {
    columnFixingTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// ColumnFixing
type IColumnFixingTextsProps = React.PropsWithChildren<{
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  unfix?: string;
}>
class ColumnFixingTexts extends NestedOption<IColumnFixingTextsProps> {
  public static OptionName = "texts";
}

// owners:
// Column
type IColumnHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: object, dataSource: DataSourceOptions | null }) => void) | null | Store;
  groupInterval?: number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year";
  height?: number;
  searchMode?: "contains" | "startswith" | "equals";
  width?: number;
}>
class ColumnHeaderFilter extends NestedOption<IColumnHeaderFilterProps> {
  public static OptionName = "headerFilter";
}

// owners:
// Column
type IColumnLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  calculateCellValue?: ((rowData: object) => any);
  dataSource?: Array<any> | DataSourceOptions | ((options: { data: object, key: any }) => Array<any>) | null | Store;
  displayExpr?: ((data: object) => string) | string;
  valueExpr?: string;
}>
class ColumnLookup extends NestedOption<IColumnLookupProps> {
  public static OptionName = "lookup";
}

// owners:
// FormItem
// Column
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => object);
  comparisonType?: "!=" | "!==" | "<" | "<=" | "==" | "===" | ">" | ">=";
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class CompareRule extends NestedOption<ICompareRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "compare"
  };
}

// owners:
// RowDragging
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class CursorOffset extends NestedOption<ICursorOffsetProps> {
  public static OptionName = "cursorOffset";
}

// owners:
// FilterBuilder
type ICustomOperationProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string);
  caption?: string;
  customizeText?: ((fieldInfo: { field: dxFilterBuilderField, value: string | number | any, valueText: string }) => string);
  dataTypes?: Array<"string" | "number" | "date" | "boolean" | "object" | "datetime">;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, setValue: (() => void), value: string | number | any }, container: any) => string) | template;
  hasValue?: boolean;
  icon?: string;
  name?: string;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
  editorKeyFn?: (data: any) => string;
}>
class CustomOperation extends NestedOption<ICustomOperationProps> {
  public static OptionName = "customOperations";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent",
    keyFn: "editorKeyFn"
  }];
}

// owners:
// FormItem
// Column
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: object, data: object, formItem: object, rule: object, validator: object, value: string | number }) => boolean);
}>
class CustomRule extends NestedOption<ICustomRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "custom"
  };
}

// owners:
// TreeList
type IEditingProps = React.PropsWithChildren<{
  allowAdding?: boolean | ((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean);
  allowDeleting?: boolean | ((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean);
  allowUpdating?: boolean | ((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean);
  changes?: Array<DataChange>;
  confirmDelete?: boolean;
  editColumnName?: string;
  editRowKey?: any;
  form?: dxFormOptions;
  mode?: "batch" | "cell" | "row" | "form" | "popup";
  popup?: dxPopupOptions<any>;
  refreshMode?: "full" | "reshape" | "repaint";
  selectTextOnEditStart?: boolean;
  startEditAction?: "click" | "dblClick";
  texts?: object | {
    addRow?: string;
    addRowToNode?: string;
    cancelAllChanges?: string;
    cancelRowChanges?: string;
    confirmDeleteMessage?: string;
    confirmDeleteTitle?: string;
    deleteRow?: string;
    editRow?: string;
    saveAllChanges?: string;
    saveRowChanges?: string;
    undeleteRow?: string;
    validationCancelChanges?: string;
  };
  useIcons?: boolean;
  defaultChanges?: Array<DataChange>;
  onChangesChange?: (value: Array<DataChange>) => void;
  defaultEditColumnName?: string;
  onEditColumnNameChange?: (value: string) => void;
  defaultEditRowKey?: any;
  onEditRowKeyChange?: (value: any) => void;
}>
class Editing extends NestedOption<IEditingProps> {
  public static OptionName = "editing";
  public static DefaultsProps = {
    defaultChanges: "changes",
    defaultEditColumnName: "editColumnName",
    defaultEditRowKey: "editRowKey"
  };
  public static ExpectedChildren = {
    change: { optionName: "changes", isCollectionItem: true },
    editingTexts: { optionName: "texts", isCollectionItem: false },
    form: { optionName: "form", isCollectionItem: false },
    popup: { optionName: "popup", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// Editing
type IEditingTextsProps = React.PropsWithChildren<{
  addRow?: string;
  addRowToNode?: string;
  cancelAllChanges?: string;
  cancelRowChanges?: string;
  confirmDeleteMessage?: string;
  confirmDeleteTitle?: string;
  deleteRow?: string;
  editRow?: string;
  saveAllChanges?: string;
  saveRowChanges?: string;
  undeleteRow?: string;
  validationCancelChanges?: string;
}>
class EditingTexts extends NestedOption<IEditingTextsProps> {
  public static OptionName = "texts";
}

// owners:
// FormItem
// Column
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class EmailRule extends NestedOption<IEmailRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "email"
  };
}

// owners:
// FilterBuilder
type IFieldProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string);
  caption?: string;
  customizeText?: ((fieldInfo: { value: string | number | any, valueText: string }) => string);
  dataField?: string;
  dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
  defaultFilterOperation?: "=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between";
  editorOptions?: any;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, filterOperation: string, setValue: (() => void), value: string | number | any }, container: any) => string) | template;
  falseText?: string;
  filterOperations?: Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | string>;
  format?: LocalizationTypes.Format;
  lookup?: object | {
    allowClearing?: boolean;
    dataSource?: Array<any> | DataSourceOptions | Store;
    displayExpr?: ((data: object) => string) | string;
    valueExpr?: ((data: object) => string) | string;
  };
  name?: string;
  trueText?: string;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
  editorKeyFn?: (data: any) => string;
}>
class Field extends NestedOption<IFieldProps> {
  public static OptionName = "fields";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    fieldLookup: { optionName: "lookup", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    lookup: { optionName: "lookup", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent",
    keyFn: "editorKeyFn"
  }];
}

// owners:
// Field
type IFieldLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  dataSource?: Array<any> | DataSourceOptions | Store;
  displayExpr?: ((data: object) => string) | string;
  valueExpr?: ((data: object) => string) | string;
}>
class FieldLookup extends NestedOption<IFieldLookupProps> {
  public static OptionName = "lookup";
}

// owners:
// TreeList
type IFilterBuilderProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  allowHierarchicalFields?: boolean;
  bindingOptions?: object;
  customOperations?: Array<dxFilterBuilderCustomOperation>;
  disabled?: boolean;
  elementAttr?: object;
  fields?: Array<dxFilterBuilderField>;
  filterOperationDescriptions?: object | {
    between?: string;
    contains?: string;
    endsWith?: string;
    equal?: string;
    greaterThan?: string;
    greaterThanOrEqual?: string;
    isBlank?: string;
    isNotBlank?: string;
    lessThan?: string;
    lessThanOrEqual?: string;
    notContains?: string;
    notEqual?: string;
    startsWith?: string;
  };
  focusStateEnabled?: boolean;
  groupOperationDescriptions?: object | {
    and?: string;
    notAnd?: string;
    notOr?: string;
    or?: string;
  };
  groupOperations?: Array<"and" | "or" | "notAnd" | "notOr">;
  height?: (() => number) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  maxGroupLevel?: number;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onEditorPrepared?: ((e: { component: dxFilterBuilder, dataField: string, disabled: boolean, editorElement: any, editorName: string, element: any, filterOperation: string, model: any, readOnly: boolean, rtlEnabled: boolean, setValue(newValue): any, updateValueTimeout: number, value: any, width: number }) => void);
  onEditorPreparing?: ((e: { cancel: boolean, component: dxFilterBuilder, dataField: string, disabled: boolean, editorElement: any, editorName: string, editorOptions: object, element: any, filterOperation: string, model: any, readOnly: boolean, rtlEnabled: boolean, setValue(newValue): any, updateValueTimeout: number, value: any, width: number }) => void);
  onFocusIn?: ((e: { component: Widget<any>, element: any, model: object }) => void);
  onFocusOut?: ((e: { component: Widget<any>, element: any, model: object }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onValueChanged?: ((e: { component: dxFilterBuilder, element: any, model: any, previousValue: object, value: object }) => void);
  rtlEnabled?: boolean;
  tabIndex?: number;
  value?: Array<any> | (() => any) | string;
  visible?: boolean;
  width?: (() => number) | number | string;
  defaultValue?: Array<any> | (() => any) | string;
  onValueChange?: (value: Array<any> | (() => any) | string) => void;
}>
class FilterBuilder extends NestedOption<IFilterBuilderProps> {
  public static OptionName = "filterBuilder";
  public static DefaultsProps = {
    defaultValue: "value"
  };
  public static ExpectedChildren = {
    customOperation: { optionName: "customOperations", isCollectionItem: true },
    field: { optionName: "fields", isCollectionItem: true },
    filterOperationDescriptions: { optionName: "filterOperationDescriptions", isCollectionItem: false },
    groupOperationDescriptions: { optionName: "groupOperationDescriptions", isCollectionItem: false }
  };
}

// owners:
// TreeList
type IFilterBuilderPopupProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  animation?: object | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: object;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string;
  contentTemplate?: ((contentElement: any) => string) | template;
  copyRootClassesToWrapper?: boolean;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  elementAttr?: any;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: (() => number) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string;
  hoverStateEnabled?: boolean;
  maxHeight?: (() => number) | number | string;
  maxWidth?: (() => number) | number | string;
  minHeight?: (() => number) | number | string;
  minWidth?: (() => number) | number | string;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onFocusIn?: ((e: { component: Widget<any>, element: any, model: object }) => void);
  onFocusOut?: ((e: { component: Widget<any>, element: any, model: object }) => void);
  onHidden?: ((e: EventInfo<any>) => void);
  onHiding?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onResize?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeEnd?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeStart?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onShowing?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onShown?: ((e: EventInfo<any>) => void);
  onTitleRendered?: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void);
  position?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  resizeEnabled?: boolean;
  restorePosition?: boolean;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  tabIndex?: number;
  title?: string;
  titleTemplate?: ((titleElement: any) => string) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: (() => number) | number | string;
  wrapperAttr?: any;
  defaultHeight?: (() => number) | number | string;
  onHeightChange?: (value: (() => number) | number | string) => void;
  defaultPosition?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  onPositionChange?: (value: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top") => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number) | number | string;
  onWidthChange?: (value: (() => number) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  contentKeyFn?: (data: any) => string;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
  titleKeyFn?: (data: any) => string;
}>
class FilterBuilderPopup extends NestedOption<IFilterBuilderPopupProps> {
  public static OptionName = "filterBuilderPopup";
  public static DefaultsProps = {
    defaultHeight: "height",
    defaultPosition: "position",
    defaultVisible: "visible",
    defaultWidth: "width"
  };
  public static TemplateProps = [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent",
    keyFn: "contentKeyFn"
  }, {
    tmplOption: "titleTemplate",
    render: "titleRender",
    component: "titleComponent",
    keyFn: "titleKeyFn"
  }];
}

// owners:
// FilterBuilder
type IFilterOperationDescriptionsProps = React.PropsWithChildren<{
  between?: string;
  contains?: string;
  endsWith?: string;
  equal?: string;
  greaterThan?: string;
  greaterThanOrEqual?: string;
  isBlank?: string;
  isNotBlank?: string;
  lessThan?: string;
  lessThanOrEqual?: string;
  notContains?: string;
  notEqual?: string;
  startsWith?: string;
}>
class FilterOperationDescriptions extends NestedOption<IFilterOperationDescriptionsProps> {
  public static OptionName = "filterOperationDescriptions";
}

// owners:
// TreeList
type IFilterPanelProps = React.PropsWithChildren<{
  customizeText?: ((e: { component: GridBase, filterValue: object, text: string }) => string);
  filterEnabled?: boolean;
  texts?: object | {
    clearFilter?: string;
    createFilter?: string;
    filterEnabledHint?: string;
  };
  visible?: boolean;
  defaultFilterEnabled?: boolean;
  onFilterEnabledChange?: (value: boolean) => void;
}>
class FilterPanel extends NestedOption<IFilterPanelProps> {
  public static OptionName = "filterPanel";
  public static DefaultsProps = {
    defaultFilterEnabled: "filterEnabled"
  };
  public static ExpectedChildren = {
    filterPanelTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// FilterPanel
type IFilterPanelTextsProps = React.PropsWithChildren<{
  clearFilter?: string;
  createFilter?: string;
  filterEnabledHint?: string;
}>
class FilterPanelTexts extends NestedOption<IFilterPanelTextsProps> {
  public static OptionName = "texts";
}

// owners:
// TreeList
type IFilterRowProps = React.PropsWithChildren<{
  applyFilter?: "auto" | "onClick";
  applyFilterText?: string;
  betweenEndText?: string;
  betweenStartText?: string;
  operationDescriptions?: object | {
    between?: string;
    contains?: string;
    endsWith?: string;
    equal?: string;
    greaterThan?: string;
    greaterThanOrEqual?: string;
    lessThan?: string;
    lessThanOrEqual?: string;
    notContains?: string;
    notEqual?: string;
    startsWith?: string;
  };
  resetOperationText?: string;
  showAllText?: string;
  showOperationChooser?: boolean;
  visible?: boolean;
}>
class FilterRow extends NestedOption<IFilterRowProps> {
  public static OptionName = "filterRow";
  public static ExpectedChildren = {
    operationDescriptions: { optionName: "operationDescriptions", isCollectionItem: false }
  };
}

// owners:
// Editing
type IFormProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  alignItemLabels?: boolean;
  alignItemLabelsInAllGroups?: boolean;
  bindingOptions?: object;
  colCount?: number | "auto";
  colCountByScreen?: object | {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
  };
  customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => void);
  disabled?: boolean;
  elementAttr?: object;
  focusStateEnabled?: boolean;
  formData?: any;
  height?: (() => number) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  labelLocation?: "left" | "right" | "top";
  labelMode?: "static" | "floating" | "hidden" | "outside";
  minColWidth?: number;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onEditorEnterKey?: ((e: { component: dxForm, dataField: string, element: any, model: any }) => void);
  onFieldDataChanged?: ((e: { component: dxForm, dataField: string, element: any, model: any, value: object }) => void);
  onFocusIn?: ((e: { component: Widget<any>, element: any, model: object }) => void);
  onFocusOut?: ((e: { component: Widget<any>, element: any, model: object }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  optionalMark?: string;
  readOnly?: boolean;
  requiredMark?: string;
  requiredMessage?: string;
  rtlEnabled?: boolean;
  screenByWidth?: (() => void);
  scrollingEnabled?: boolean;
  showColonAfterLabel?: boolean;
  showOptionalMark?: boolean;
  showRequiredMark?: boolean;
  showValidationSummary?: boolean;
  tabIndex?: number;
  validationGroup?: string;
  visible?: boolean;
  width?: (() => number) | number | string;
  defaultFormData?: any;
  onFormDataChange?: (value: any) => void;
}>
class Form extends NestedOption<IFormProps> {
  public static OptionName = "form";
  public static DefaultsProps = {
    defaultFormData: "formData"
  };
  public static ExpectedChildren = {
    colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
  };
}

// owners:
// Column
// Field
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | any) => string);
  parser?: ((value: string) => number);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
class Format extends NestedOption<IFormatProps> {
  public static OptionName = "format";
}

// owners:
// Column
type IFormItemProps = React.PropsWithChildren<{
  colSpan?: number;
  cssClass?: string;
  dataField?: string;
  editorOptions?: any;
  editorType?: "dxAutocomplete" | "dxCalendar" | "dxCheckBox" | "dxColorBox" | "dxDateBox" | "dxDropDownBox" | "dxHtmlEditor" | "dxLookup" | "dxNumberBox" | "dxRadioGroup" | "dxRangeSlider" | "dxSelectBox" | "dxSlider" | "dxSwitch" | "dxTagBox" | "dxTextArea" | "dxTextBox";
  helpText?: string;
  isRequired?: boolean;
  itemType?: "empty" | "group" | "simple" | "tabbed" | "button";
  label?: object | {
    alignment?: "center" | "left" | "right";
    location?: "left" | "right" | "top";
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string) | template;
    text?: string;
    visible?: boolean;
  };
  name?: string;
  template?: ((data: { component: dxForm, dataField: string, editorOptions: object, editorType: string, name: string }, itemElement: any) => string) | template;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class FormItem extends NestedOption<IFormItemProps> {
  public static OptionName = "formItem";
  public static ExpectedChildren = {
    AsyncRule: { optionName: "validationRules", isCollectionItem: true },
    CompareRule: { optionName: "validationRules", isCollectionItem: true },
    CustomRule: { optionName: "validationRules", isCollectionItem: true },
    EmailRule: { optionName: "validationRules", isCollectionItem: true },
    label: { optionName: "label", isCollectionItem: false },
    NumericRule: { optionName: "validationRules", isCollectionItem: true },
    PatternRule: { optionName: "validationRules", isCollectionItem: true },
    RangeRule: { optionName: "validationRules", isCollectionItem: true },
    RequiredRule: { optionName: "validationRules", isCollectionItem: true },
    StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
    validationRule: { optionName: "validationRules", isCollectionItem: true }
  };
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// Hide
type IFromProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
class From extends NestedOption<IFromProps> {
  public static OptionName = "from";
  public static ExpectedChildren = {
    position: { optionName: "position", isCollectionItem: false }
  };
}

// owners:
// FilterBuilder
type IGroupOperationDescriptionsProps = React.PropsWithChildren<{
  and?: string;
  notAnd?: string;
  notOr?: string;
  or?: string;
}>
class GroupOperationDescriptions extends NestedOption<IGroupOperationDescriptionsProps> {
  public static OptionName = "groupOperationDescriptions";
}

// owners:
// Column
// TreeList
type IHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: object, dataSource: DataSourceOptions | null }) => void) | null | Store;
  groupInterval?: number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year";
  height?: number;
  searchMode?: "contains" | "startswith" | "equals";
  width?: number;
  searchTimeout?: number;
  texts?: object | {
    cancel?: string;
    emptyValue?: string;
    ok?: string;
  };
  visible?: boolean;
}>
class HeaderFilter extends NestedOption<IHeaderFilterProps> {
  public static OptionName = "headerFilter";
}

// owners:
// Animation
type IHideProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: "bottom" | "left" | "right" | "top";
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: "css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut";
}>
class Hide extends NestedOption<IHideProps> {
  public static OptionName = "hide";
  public static ExpectedChildren = {
    from: { optionName: "from", isCollectionItem: false },
    to: { optionName: "to", isCollectionItem: false }
  };
}

// owners:
// Toolbar
type IItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  html?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => string) | template;
  name?: "addRowButton" | "applyFilterButton" | "columnChooserButton" | "revertButton" | "saveButton" | "searchPanel";
  options?: any;
  showText?: "always" | "inMenu";
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string) | template;
  text?: string;
  visible?: boolean;
  widget?: "dxAutocomplete" | "dxButton" | "dxCheckBox" | "dxDateBox" | "dxMenu" | "dxSelectBox" | "dxTabs" | "dxTextBox" | "dxButtonGroup" | "dxDropDownButton";
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent",
    keyFn: "menuItemKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// TreeList
type IKeyboardNavigationProps = React.PropsWithChildren<{
  editOnKeyPress?: boolean;
  enabled?: boolean;
  enterKeyAction?: "startEdit" | "moveFocus";
  enterKeyDirection?: "none" | "column" | "row";
}>
class KeyboardNavigation extends NestedOption<IKeyboardNavigationProps> {
  public static OptionName = "keyboardNavigation";
}

// owners:
// FormItem
type ILabelProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  location?: "left" | "right" | "top";
  showColon?: boolean;
  template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// TreeList
type ILoadPanelProps = React.PropsWithChildren<{
  enabled?: boolean | "auto";
  height?: number;
  indicatorSrc?: string;
  shading?: boolean;
  shadingColor?: string;
  showIndicator?: boolean;
  showPane?: boolean;
  text?: string;
  width?: number;
}>
class LoadPanel extends NestedOption<ILoadPanelProps> {
  public static OptionName = "loadPanel";
}

// owners:
// Column
// Field
type ILookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  calculateCellValue?: ((rowData: object) => any);
  dataSource?: Array<any> | DataSourceOptions | ((options: { data: object, key: any }) => Array<any>) | null | Store;
  displayExpr?: ((data: object) => string) | string;
  valueExpr?: string;
}>
class Lookup extends NestedOption<ILookupProps> {
  public static OptionName = "lookup";
}

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
class My extends NestedOption<IMyProps> {
  public static OptionName = "my";
}

// owners:
// FormItem
// Column
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class NumericRule extends NestedOption<INumericRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "numeric"
  };
}

// owners:
// Position
type IOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class Offset extends NestedOption<IOffsetProps> {
  public static OptionName = "offset";
}

// owners:
// FilterRow
type IOperationDescriptionsProps = React.PropsWithChildren<{
  between?: string;
  contains?: string;
  endsWith?: string;
  equal?: string;
  greaterThan?: string;
  greaterThanOrEqual?: string;
  lessThan?: string;
  lessThanOrEqual?: string;
  notContains?: string;
  notEqual?: string;
  startsWith?: string;
}>
class OperationDescriptions extends NestedOption<IOperationDescriptionsProps> {
  public static OptionName = "operationDescriptions";
}

// owners:
// TreeList
type IPagerProps = React.PropsWithChildren<{
  allowedPageSizes?: Array<number | "all" | "auto"> | "auto";
  displayMode?: "adaptive" | "compact" | "full";
  infoText?: string;
  label?: string;
  showInfo?: boolean;
  showNavigationButtons?: boolean;
  showPageSizeSelector?: boolean;
  visible?: boolean | "auto";
}>
class Pager extends NestedOption<IPagerProps> {
  public static OptionName = "pager";
}

// owners:
// TreeList
type IPagingProps = React.PropsWithChildren<{
  enabled?: boolean;
  pageIndex?: number;
  pageSize?: number;
  defaultPageIndex?: number;
  onPageIndexChange?: (value: number) => void;
  defaultPageSize?: number;
  onPageSizeChange?: (value: number) => void;
}>
class Paging extends NestedOption<IPagingProps> {
  public static OptionName = "paging";
  public static DefaultsProps = {
    defaultPageIndex: "pageIndex",
    defaultPageSize: "pageSize"
  };
}

// owners:
// FormItem
// Column
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: any | string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class PatternRule extends NestedOption<IPatternRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "pattern"
  };
}

// owners:
// Editing
type IPopupProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  animation?: object | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: object;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string;
  contentTemplate?: ((contentElement: any) => string) | template;
  copyRootClassesToWrapper?: boolean;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  elementAttr?: any;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: (() => number) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string;
  hoverStateEnabled?: boolean;
  maxHeight?: (() => number) | number | string;
  maxWidth?: (() => number) | number | string;
  minHeight?: (() => number) | number | string;
  minWidth?: (() => number) | number | string;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onFocusIn?: ((e: { component: Widget<any>, element: any, model: object }) => void);
  onFocusOut?: ((e: { component: Widget<any>, element: any, model: object }) => void);
  onHidden?: ((e: EventInfo<any>) => void);
  onHiding?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onResize?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeEnd?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeStart?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onShowing?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onShown?: ((e: EventInfo<any>) => void);
  onTitleRendered?: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void);
  position?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  resizeEnabled?: boolean;
  restorePosition?: boolean;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  tabIndex?: number;
  title?: string;
  titleTemplate?: ((titleElement: any) => string) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: (() => number) | number | string;
  wrapperAttr?: any;
  defaultHeight?: (() => number) | number | string;
  onHeightChange?: (value: (() => number) | number | string) => void;
  defaultPosition?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  onPositionChange?: (value: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top") => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number) | number | string;
  onWidthChange?: (value: (() => number) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  contentKeyFn?: (data: any) => string;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
  titleKeyFn?: (data: any) => string;
}>
class Popup extends NestedOption<IPopupProps> {
  public static OptionName = "popup";
  public static DefaultsProps = {
    defaultHeight: "height",
    defaultPosition: "position",
    defaultVisible: "visible",
    defaultWidth: "width"
  };
  public static ExpectedChildren = {
    animation: { optionName: "animation", isCollectionItem: false },
    position: { optionName: "position", isCollectionItem: false },
    toolbarItem: { optionName: "toolbarItems", isCollectionItem: true }
  };
  public static TemplateProps = [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent",
    keyFn: "contentKeyFn"
  }, {
    tmplOption: "titleTemplate",
    render: "titleRender",
    component: "titleComponent",
    keyFn: "titleKeyFn"
  }];
}

// owners:
// From
// Popup
type IPositionProps = React.PropsWithChildren<{
  at?: object | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
  };
  boundary?: any | string;
  boundaryOffset?: object | string | {
    x?: number;
    y?: number;
  };
  collision?: object | "fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit" | {
    x?: "fit" | "flip" | "flipfit" | "none";
    y?: "fit" | "flip" | "flipfit" | "none";
  };
  my?: object | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
  };
  of?: any | string;
  offset?: object | string | {
    x?: number;
    y?: number;
  };
}>
class Position extends NestedOption<IPositionProps> {
  public static OptionName = "position";
}

// owners:
// FormItem
// Column
type IRangeRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: any | number;
  message?: string;
  min?: any | number;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class RangeRule extends NestedOption<IRangeRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "range"
  };
}

// owners:
// TreeList
type IRemoteOperationsProps = React.PropsWithChildren<{
  filtering?: boolean;
  grouping?: boolean;
  sorting?: boolean;
}>
class RemoteOperations extends NestedOption<IRemoteOperationsProps> {
  public static OptionName = "remoteOperations";
}

// owners:
// FormItem
// Column
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class RequiredRule extends NestedOption<IRequiredRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "required"
  };
}

// owners:
// TreeList
type IRowDraggingProps = React.PropsWithChildren<{
  allowDropInsideItem?: boolean;
  allowReordering?: boolean;
  autoScroll?: boolean;
  boundary?: any | string;
  container?: any | string;
  cursorOffset?: object | string | {
    x?: number;
    y?: number;
  };
  data?: any;
  dragDirection?: "both" | "horizontal" | "vertical";
  dragTemplate?: ((dragInfo: { itemData: any, itemElement: any }, containerElement: any) => string) | template;
  dropFeedbackMode?: "push" | "indicate";
  filter?: string;
  group?: string;
  handle?: string;
  onAdd?: ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragChange?: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragEnd?: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragMove?: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragStart?: ((e: { cancel: boolean, component: GridBase, event: event, fromData: any, fromIndex: number, itemData: any, itemElement: any }) => void);
  onRemove?: ((e: { component: GridBase, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onReorder?: ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, promise: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  scrollSensitivity?: number;
  scrollSpeed?: number;
  showDragIcons?: boolean;
  dragRender?: (...params: any) => React.ReactNode;
  dragComponent?: React.ComponentType<any>;
  dragKeyFn?: (data: any) => string;
}>
class RowDragging extends NestedOption<IRowDraggingProps> {
  public static OptionName = "rowDragging";
  public static ExpectedChildren = {
    cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "dragTemplate",
    render: "dragRender",
    component: "dragComponent",
    keyFn: "dragKeyFn"
  }];
}

// owners:
// TreeList
type IScrollingProps = React.PropsWithChildren<{
  columnRenderingMode?: "standard" | "virtual";
  mode?: "standard" | "virtual";
  preloadEnabled?: boolean;
  renderAsync?: boolean;
  rowRenderingMode?: "standard" | "virtual";
  scrollByContent?: boolean;
  scrollByThumb?: boolean;
  showScrollbar?: "always" | "never" | "onHover" | "onScroll";
  useNative?: boolean | "auto";
}>
class Scrolling extends NestedOption<IScrollingProps> {
  public static OptionName = "scrolling";
}

// owners:
// TreeList
type ISearchPanelProps = React.PropsWithChildren<{
  highlightCaseSensitive?: boolean;
  highlightSearchText?: boolean;
  placeholder?: string;
  searchVisibleColumnsOnly?: boolean;
  text?: string;
  visible?: boolean;
  width?: number;
  defaultText?: string;
  onTextChange?: (value: string) => void;
}>
class SearchPanel extends NestedOption<ISearchPanelProps> {
  public static OptionName = "searchPanel";
  public static DefaultsProps = {
    defaultText: "text"
  };
}

// owners:
// TreeList
type ISelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  mode?: "single" | "multiple" | "none";
  recursive?: boolean;
}>
class Selection extends NestedOption<ISelectionProps> {
  public static OptionName = "selection";
}

// owners:
// Animation
type IShowProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: "bottom" | "left" | "right" | "top";
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: "css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut";
}>
class Show extends NestedOption<IShowProps> {
  public static OptionName = "show";
}

// owners:
// TreeList
type ISortingProps = React.PropsWithChildren<{
  ascendingText?: string;
  clearText?: string;
  descendingText?: string;
  mode?: "single" | "multiple" | "none";
  showSortIndexes?: boolean;
}>
class Sorting extends NestedOption<ISortingProps> {
  public static OptionName = "sorting";
}

// owners:
// TreeList
type IStateStoringProps = React.PropsWithChildren<{
  customLoad?: (() => any);
  customSave?: ((gridState: object) => void);
  enabled?: boolean;
  savingTimeout?: number;
  storageKey?: string;
  type?: "custom" | "localStorage" | "sessionStorage";
}>
class StateStoring extends NestedOption<IStateStoringProps> {
  public static OptionName = "stateStoring";
}

// owners:
// FormItem
// Column
type IStringLengthRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: number;
  message?: string;
  min?: number;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class StringLengthRule extends NestedOption<IStringLengthRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "stringLength"
  };
}

// owners:
// Editing
// ColumnFixing
// FilterPanel
// TreeListHeaderFilter
type ITextsProps = React.PropsWithChildren<{
  addRow?: string;
  addRowToNode?: string;
  cancelAllChanges?: string;
  cancelRowChanges?: string;
  confirmDeleteMessage?: string;
  confirmDeleteTitle?: string;
  deleteRow?: string;
  editRow?: string;
  saveAllChanges?: string;
  saveRowChanges?: string;
  undeleteRow?: string;
  validationCancelChanges?: string;
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  unfix?: string;
  clearFilter?: string;
  createFilter?: string;
  filterEnabledHint?: string;
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
class Texts extends NestedOption<ITextsProps> {
  public static OptionName = "texts";
}

// owners:
// Hide
type IToProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
class To extends NestedOption<IToProps> {
  public static OptionName = "to";
}

// owners:
// TreeList
type IToolbarProps = React.PropsWithChildren<{
  disabled?: boolean;
  items?: Array<dxTreeListToolbarItem | "addRowButton" | "applyFilterButton" | "columnChooserButton" | "revertButton" | "saveButton" | "searchPanel">;
  visible?: boolean;
}>
class Toolbar extends NestedOption<IToolbarProps> {
  public static OptionName = "toolbar";
  public static ExpectedChildren = {
    item: { optionName: "items", isCollectionItem: true }
  };
}

// owners:
// Popup
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  html?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => string) | template;
  options?: any;
  showText?: "always" | "inMenu";
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string) | template;
  text?: string;
  toolbar?: "bottom" | "top";
  visible?: boolean;
  widget?: "dxAutocomplete" | "dxButton" | "dxCheckBox" | "dxDateBox" | "dxMenu" | "dxSelectBox" | "dxTabs" | "dxTextBox" | "dxButtonGroup" | "dxDropDownButton";
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class ToolbarItem extends NestedOption<IToolbarItemProps> {
  public static OptionName = "toolbarItems";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent",
    keyFn: "menuItemKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// TreeList
type ITreeListHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  height?: number;
  searchTimeout?: number;
  texts?: object | {
    cancel?: string;
    emptyValue?: string;
    ok?: string;
  };
  visible?: boolean;
  width?: number;
}>
class TreeListHeaderFilter extends NestedOption<ITreeListHeaderFilterProps> {
  public static OptionName = "headerFilter";
  public static ExpectedChildren = {
    texts: { optionName: "texts", isCollectionItem: false },
    treeListHeaderFilterTexts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// TreeListHeaderFilter
type ITreeListHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
class TreeListHeaderFilterTexts extends NestedOption<ITreeListHeaderFilterTextsProps> {
  public static OptionName = "texts";
}

// owners:
// FormItem
// Column
type IValidationRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  ignoreEmptyValue?: boolean;
  max?: any | number;
  min?: any | number;
  reevaluate?: boolean;
  validationCallback?: ((options: { column: object, data: object, formItem: object, rule: object, validator: object, value: string | number }) => boolean);
  comparisonTarget?: (() => object);
  comparisonType?: "!=" | "!==" | "<" | "<=" | "==" | "===" | ">" | ">=";
  pattern?: any | string;
}>
class ValidationRule extends NestedOption<IValidationRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "required"
  };
}

export default TreeList;
export {
  TreeList,
  ITreeListOptions,
  Animation,
  IAnimationProps,
  AsyncRule,
  IAsyncRuleProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Button,
  IButtonProps,
  Change,
  IChangeProps,
  ColCountByScreen,
  IColCountByScreenProps,
  Collision,
  ICollisionProps,
  Column,
  IColumnProps,
  ColumnChooser,
  IColumnChooserProps,
  ColumnFixing,
  IColumnFixingProps,
  ColumnFixingTexts,
  IColumnFixingTextsProps,
  ColumnHeaderFilter,
  IColumnHeaderFilterProps,
  ColumnLookup,
  IColumnLookupProps,
  CompareRule,
  ICompareRuleProps,
  CursorOffset,
  ICursorOffsetProps,
  CustomOperation,
  ICustomOperationProps,
  CustomRule,
  ICustomRuleProps,
  Editing,
  IEditingProps,
  EditingTexts,
  IEditingTextsProps,
  EmailRule,
  IEmailRuleProps,
  Field,
  IFieldProps,
  FieldLookup,
  IFieldLookupProps,
  FilterBuilder,
  IFilterBuilderProps,
  FilterBuilderPopup,
  IFilterBuilderPopupProps,
  FilterOperationDescriptions,
  IFilterOperationDescriptionsProps,
  FilterPanel,
  IFilterPanelProps,
  FilterPanelTexts,
  IFilterPanelTextsProps,
  FilterRow,
  IFilterRowProps,
  Form,
  IFormProps,
  Format,
  IFormatProps,
  FormItem,
  IFormItemProps,
  From,
  IFromProps,
  GroupOperationDescriptions,
  IGroupOperationDescriptionsProps,
  HeaderFilter,
  IHeaderFilterProps,
  Hide,
  IHideProps,
  Item,
  IItemProps,
  KeyboardNavigation,
  IKeyboardNavigationProps,
  Label,
  ILabelProps,
  LoadPanel,
  ILoadPanelProps,
  Lookup,
  ILookupProps,
  My,
  IMyProps,
  NumericRule,
  INumericRuleProps,
  Offset,
  IOffsetProps,
  OperationDescriptions,
  IOperationDescriptionsProps,
  Pager,
  IPagerProps,
  Paging,
  IPagingProps,
  PatternRule,
  IPatternRuleProps,
  Popup,
  IPopupProps,
  Position,
  IPositionProps,
  RangeRule,
  IRangeRuleProps,
  RemoteOperations,
  IRemoteOperationsProps,
  RequiredRule,
  IRequiredRuleProps,
  RowDragging,
  IRowDraggingProps,
  Scrolling,
  IScrollingProps,
  SearchPanel,
  ISearchPanelProps,
  Selection,
  ISelectionProps,
  Show,
  IShowProps,
  Sorting,
  ISortingProps,
  StateStoring,
  IStateStoringProps,
  StringLengthRule,
  IStringLengthRuleProps,
  Texts,
  ITextsProps,
  To,
  IToProps,
  Toolbar,
  IToolbarProps,
  ToolbarItem,
  IToolbarItemProps,
  TreeListHeaderFilter,
  ITreeListHeaderFilterProps,
  TreeListHeaderFilterTexts,
  ITreeListHeaderFilterTextsProps,
  ValidationRule,
  IValidationRuleProps
};
import type * as TreeListTypes from 'devextreme/ui/tree_list_types';
export { TreeListTypes };

