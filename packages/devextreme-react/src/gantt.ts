import dxGantt, {
    Properties
} from "devextreme/ui/gantt";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxTreeListColumn, dxTreeListRowObject } from "devextreme/ui/tree_list";
import type { template } from "devextreme/core/templates/template";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/abstract_store";
import type { dxGanttContextMenuItem, dxGanttFilterRowOperationDescriptions, dxGanttHeaderFilterTexts, dxGanttToolbarItem } from "devextreme/ui/gantt";
import type { dxContextMenuItem } from "devextreme/ui/context_menu";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

import type dxTreeList from "devextreme/ui/tree_list";
import type DataSource from "devextreme/data/data_source";

import type * as LocalizationTypes from "devextreme/localization";

type IGanttOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  taskContentRender?: (...params: any) => React.ReactNode;
  taskContentComponent?: React.ComponentType<any>;
  taskContentKeyFn?: (data: any) => string;
  taskProgressTooltipContentRender?: (...params: any) => React.ReactNode;
  taskProgressTooltipContentComponent?: React.ComponentType<any>;
  taskProgressTooltipContentKeyFn?: (data: any) => string;
  taskTimeTooltipContentRender?: (...params: any) => React.ReactNode;
  taskTimeTooltipContentComponent?: React.ComponentType<any>;
  taskTimeTooltipContentKeyFn?: (data: any) => string;
  taskTooltipContentRender?: (...params: any) => React.ReactNode;
  taskTooltipContentComponent?: React.ComponentType<any>;
  taskTooltipContentKeyFn?: (data: any) => string;
}>

class Gantt extends BaseComponent<React.PropsWithChildren<IGanttOptions>> {

  public get instance(): dxGantt {
    return this._instance;
  }

  protected _WidgetClass = dxGantt;

  protected independentEvents = ["onContentReady","onContextMenuPreparing","onCustomCommand","onDependencyDeleted","onDependencyDeleting","onDependencyInserted","onDependencyInserting","onDisposing","onInitialized","onResourceAssigned","onResourceAssigning","onResourceDeleted","onResourceDeleting","onResourceInserted","onResourceInserting","onResourceManagerDialogShowing","onResourceUnassigned","onResourceUnassigning","onScaleCellPrepared","onTaskClick","onTaskDblClick","onTaskDeleted","onTaskDeleting","onTaskEditDialogShowing","onTaskInserted","onTaskInserting","onTaskMoving","onTaskUpdated","onTaskUpdating"];

  protected _expectedChildren = {
    column: { optionName: "columns", isCollectionItem: true },
    contextMenu: { optionName: "contextMenu", isCollectionItem: false },
    dependencies: { optionName: "dependencies", isCollectionItem: false },
    editing: { optionName: "editing", isCollectionItem: false },
    filterRow: { optionName: "filterRow", isCollectionItem: false },
    ganttHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
    headerFilter: { optionName: "headerFilter", isCollectionItem: false },
    resourceAssignments: { optionName: "resourceAssignments", isCollectionItem: false },
    resources: { optionName: "resources", isCollectionItem: false },
    scaleTypeRange: { optionName: "scaleTypeRange", isCollectionItem: false },
    sorting: { optionName: "sorting", isCollectionItem: false },
    stripLine: { optionName: "stripLines", isCollectionItem: true },
    tasks: { optionName: "tasks", isCollectionItem: false },
    toolbar: { optionName: "toolbar", isCollectionItem: false },
    validation: { optionName: "validation", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "taskContentTemplate",
    render: "taskContentRender",
    component: "taskContentComponent",
    keyFn: "taskContentKeyFn"
  }, {
    tmplOption: "taskProgressTooltipContentTemplate",
    render: "taskProgressTooltipContentRender",
    component: "taskProgressTooltipContentComponent",
    keyFn: "taskProgressTooltipContentKeyFn"
  }, {
    tmplOption: "taskTimeTooltipContentTemplate",
    render: "taskTimeTooltipContentRender",
    component: "taskTimeTooltipContentComponent",
    keyFn: "taskTimeTooltipContentKeyFn"
  }, {
    tmplOption: "taskTooltipContentTemplate",
    render: "taskTooltipContentRender",
    component: "taskTooltipContentComponent",
    keyFn: "taskTooltipContentKeyFn"
  }];
}
(Gantt as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowSelection: PropTypes.bool,
  columns: PropTypes.array,
  contextMenu: PropTypes.object,
  dependencies: PropTypes.object,
  disabled: PropTypes.bool,
  editing: PropTypes.object,
  elementAttr: PropTypes.object,
  filterRow: PropTypes.object,
  firstDayOfWeek: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([
      0,
      1,
      2,
      3,
      4,
      5,
      6])
  ]),
  focusStateEnabled: PropTypes.bool,
  headerFilter: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  onContentReady: PropTypes.func,
  onContextMenuPreparing: PropTypes.func,
  onCustomCommand: PropTypes.func,
  onDependencyDeleted: PropTypes.func,
  onDependencyDeleting: PropTypes.func,
  onDependencyInserted: PropTypes.func,
  onDependencyInserting: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onResourceAssigned: PropTypes.func,
  onResourceAssigning: PropTypes.func,
  onResourceDeleted: PropTypes.func,
  onResourceDeleting: PropTypes.func,
  onResourceInserted: PropTypes.func,
  onResourceInserting: PropTypes.func,
  onResourceManagerDialogShowing: PropTypes.func,
  onResourceUnassigned: PropTypes.func,
  onResourceUnassigning: PropTypes.func,
  onScaleCellPrepared: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  onTaskClick: PropTypes.func,
  onTaskDblClick: PropTypes.func,
  onTaskDeleted: PropTypes.func,
  onTaskDeleting: PropTypes.func,
  onTaskEditDialogShowing: PropTypes.func,
  onTaskInserted: PropTypes.func,
  onTaskInserting: PropTypes.func,
  onTaskMoving: PropTypes.func,
  onTaskUpdated: PropTypes.func,
  onTaskUpdating: PropTypes.func,
  resourceAssignments: PropTypes.object,
  resources: PropTypes.object,
  scaleType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto",
      "minutes",
      "hours",
      "sixHours",
      "days",
      "weeks",
      "months",
      "quarters",
      "years"])
  ]),
  scaleTypeRange: PropTypes.object,
  showDependencies: PropTypes.bool,
  showResources: PropTypes.bool,
  showRowLines: PropTypes.bool,
  sorting: PropTypes.object,
  stripLines: PropTypes.array,
  tabIndex: PropTypes.number,
  taskListWidth: PropTypes.number,
  tasks: PropTypes.object,
  taskTitlePosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "inside",
      "outside",
      "none"])
  ]),
  toolbar: PropTypes.object,
  validation: PropTypes.object,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// Gantt
type IColumnProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  allowEditing?: any;
  allowFiltering?: boolean;
  allowFixing?: any;
  allowHeaderFiltering?: boolean;
  allowHiding?: any;
  allowReordering?: any;
  allowResizing?: any;
  allowSearch?: any;
  allowSorting?: boolean;
  buttons?: any;
  calculateCellValue?: ((rowData: object) => any);
  calculateDisplayValue?: ((rowData: object) => any) | string;
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string);
  calculateSortValue?: ((rowData: object) => any) | string;
  caption?: string;
  cellTemplate?: ((cellElement: any, cellInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList, data: object, displayValue: any, oldValue: any, row: dxTreeListRowObject, rowIndex: number, rowType: string, text: string, value: any, watch: (() => void) }) => any) | template;
  columns?: any;
  cssClass?: string;
  customizeText?: ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string);
  dataField?: string;
  dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
  editCellTemplate?: template;
  editorOptions?: any;
  encodeHtml?: boolean;
  falseText?: string;
  filterOperations?: Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | "anyof" | "noneof" | string>;
  filterType?: "exclude" | "include";
  filterValue?: any;
  filterValues?: Array<any>;
  fixed?: any;
  fixedPosition?: any;
  format?: LocalizationTypes.Format;
  formItem?: any;
  headerCellTemplate?: ((columnHeader: any, headerInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList }) => any) | template;
  headerFilter?: object | {
    allowSearch?: boolean;
    dataSource?: Array<any> | DataSourceOptions | ((options: { component: object, dataSource: DataSourceOptions | null }) => void) | null | Store;
    groupInterval?: number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year";
    height?: number;
    searchMode?: "contains" | "startswith" | "equals";
    width?: number;
  };
  hidingPriority?: any;
  isBand?: any;
  lookup?: any | {
    allowClearing?: boolean;
    calculateCellValue?: ((rowData: object) => any);
    dataSource?: Array<any> | DataSourceOptions | ((options: { data: object, key: any }) => Array<any>) | null | Store;
    displayExpr?: ((data: object) => string) | string;
    valueExpr?: string;
  };
  minWidth?: number;
  name?: any;
  ownerBand?: any;
  renderAsync?: any;
  selectedFilterOperation?: "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith";
  setCellValue?: any;
  showEditorAlways?: any;
  showInColumnChooser?: any;
  sortIndex?: number;
  sortingMethod?: ((value1: any, value2: any) => number);
  sortOrder?: "asc" | "desc";
  trueText?: string;
  type?: any;
  validationRules?: any;
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
    columnHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    headerFilter: { optionName: "headerFilter", isCollectionItem: false },
    lookup: { optionName: "lookup", isCollectionItem: false }
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
// Gantt
type IContextMenuProps = React.PropsWithChildren<{
  enabled?: boolean;
  items?: Array<dxGanttContextMenuItem | "undo" | "redo" | "expandAll" | "collapseAll" | "addTask" | "deleteTask" | "zoomIn" | "zoomOut" | "deleteDependency" | "taskDetails" | "resourceManager">;
}>
class ContextMenu extends NestedOption<IContextMenuProps> {
  public static OptionName = "contextMenu";
  public static ExpectedChildren = {
    contextMenuItem: { optionName: "items", isCollectionItem: true },
    item: { optionName: "items", isCollectionItem: true }
  };
}

// owners:
// ContextMenu
type IContextMenuItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  html?: string;
  icon?: string;
  items?: Array<dxContextMenuItem>;
  name?: "undo" | "redo" | "expandAll" | "collapseAll" | "addTask" | "deleteTask" | "zoomIn" | "zoomOut" | "deleteDependency" | "taskDetails" | "resourceManager";
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class ContextMenuItem extends NestedOption<IContextMenuItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// Gantt
type IDependenciesProps = React.PropsWithChildren<{
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  keyExpr?: (() => void) | string;
  predecessorIdExpr?: (() => void) | string;
  successorIdExpr?: (() => void) | string;
  typeExpr?: (() => void) | string;
}>
class Dependencies extends NestedOption<IDependenciesProps> {
  public static OptionName = "dependencies";
}

// owners:
// Gantt
type IEditingProps = React.PropsWithChildren<{
  allowDependencyAdding?: boolean;
  allowDependencyDeleting?: boolean;
  allowResourceAdding?: boolean;
  allowResourceDeleting?: boolean;
  allowResourceUpdating?: boolean;
  allowTaskAdding?: boolean;
  allowTaskDeleting?: boolean;
  allowTaskResourceUpdating?: boolean;
  allowTaskUpdating?: boolean;
  enabled?: boolean;
}>
class Editing extends NestedOption<IEditingProps> {
  public static OptionName = "editing";
}

// owners:
// Gantt
type IFilterRowProps = React.PropsWithChildren<{
  betweenEndText?: string;
  betweenStartText?: string;
  operationDescriptions?: dxGanttFilterRowOperationDescriptions;
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
// Column
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
// Gantt
type IGanttHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  height?: number;
  searchTimeout?: number;
  texts?: dxGanttHeaderFilterTexts;
  visible?: boolean;
  width?: number;
}>
class GanttHeaderFilter extends NestedOption<IGanttHeaderFilterProps> {
  public static OptionName = "headerFilter";
  public static ExpectedChildren = {
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// Column
// Gantt
type IHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: object, dataSource: DataSourceOptions | null }) => void) | null | Store;
  groupInterval?: number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year";
  height?: number;
  searchMode?: "contains" | "startswith" | "equals";
  width?: number;
  searchTimeout?: number;
  texts?: dxGanttHeaderFilterTexts;
  visible?: boolean;
}>
class HeaderFilter extends NestedOption<IHeaderFilterProps> {
  public static OptionName = "headerFilter";
}

// owners:
// ContextMenu
// Toolbar
type IItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  html?: string;
  icon?: string;
  items?: Array<dxContextMenuItem>;
  name?: "undo" | "redo" | "expandAll" | "collapseAll" | "addTask" | "deleteTask" | "zoomIn" | "zoomOut" | "deleteDependency" | "taskDetails" | "resourceManager";
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string) | template;
  text?: string;
  visible?: boolean;
  cssClass?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => string) | template;
  options?: any;
  showText?: "always" | "inMenu";
  widget?: "dxAutocomplete" | "dxButton" | "dxCheckBox" | "dxDateBox" | "dxMenu" | "dxSelectBox" | "dxTabs" | "dxTextBox" | "dxButtonGroup" | "dxDropDownButton";
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }, {
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent",
    keyFn: "menuItemKeyFn"
  }];
}

// owners:
// Column
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
// Gantt
type IResourceAssignmentsProps = React.PropsWithChildren<{
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  keyExpr?: (() => void) | string;
  resourceIdExpr?: (() => void) | string;
  taskIdExpr?: (() => void) | string;
}>
class ResourceAssignments extends NestedOption<IResourceAssignmentsProps> {
  public static OptionName = "resourceAssignments";
}

// owners:
// Gantt
type IResourcesProps = React.PropsWithChildren<{
  colorExpr?: (() => void) | string;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  keyExpr?: (() => void) | string;
  textExpr?: (() => void) | string;
}>
class Resources extends NestedOption<IResourcesProps> {
  public static OptionName = "resources";
}

// owners:
// Gantt
type IScaleTypeRangeProps = React.PropsWithChildren<{
  max?: "auto" | "minutes" | "hours" | "sixHours" | "days" | "weeks" | "months" | "quarters" | "years";
  min?: "auto" | "minutes" | "hours" | "sixHours" | "days" | "weeks" | "months" | "quarters" | "years";
}>
class ScaleTypeRange extends NestedOption<IScaleTypeRangeProps> {
  public static OptionName = "scaleTypeRange";
}

// owners:
// Gantt
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
// Gantt
type IStripLineProps = React.PropsWithChildren<{
  cssClass?: string;
  end?: any | (() => any) | number | string;
  start?: any | (() => any) | number | string;
  title?: string;
}>
class StripLine extends NestedOption<IStripLineProps> {
  public static OptionName = "stripLines";
  public static IsCollectionItem = true;
}

// owners:
// Gantt
type ITasksProps = React.PropsWithChildren<{
  colorExpr?: (() => void) | string;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  endExpr?: (() => void) | string;
  keyExpr?: (() => void) | string;
  parentIdExpr?: (() => void) | string;
  progressExpr?: (() => void) | string;
  startExpr?: (() => void) | string;
  titleExpr?: (() => void) | string;
}>
class Tasks extends NestedOption<ITasksProps> {
  public static OptionName = "tasks";
}

// owners:
// GanttHeaderFilter
type ITextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
class Texts extends NestedOption<ITextsProps> {
  public static OptionName = "texts";
}

// owners:
// Gantt
type IToolbarProps = React.PropsWithChildren<{
  items?: Array<dxGanttToolbarItem | "separator" | "undo" | "redo" | "expandAll" | "collapseAll" | "addTask" | "deleteTask" | "zoomIn" | "zoomOut" | "taskDetails" | "fullScreen" | "resourceManager" | "showResources" | "showDependencies">;
}>
class Toolbar extends NestedOption<IToolbarProps> {
  public static OptionName = "toolbar";
  public static ExpectedChildren = {
    item: { optionName: "items", isCollectionItem: true },
    toolbarItem: { optionName: "items", isCollectionItem: true }
  };
}

// owners:
// Toolbar
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  html?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => string) | template;
  name?: "separator" | "undo" | "redo" | "expandAll" | "collapseAll" | "addTask" | "deleteTask" | "zoomIn" | "zoomOut" | "taskDetails" | "fullScreen" | "resourceManager" | "showResources" | "showDependencies";
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
class ToolbarItem extends NestedOption<IToolbarItemProps> {
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
// Gantt
type IValidationProps = React.PropsWithChildren<{
  autoUpdateParentTasks?: boolean;
  enablePredecessorGap?: boolean;
  validateDependencies?: boolean;
}>
class Validation extends NestedOption<IValidationProps> {
  public static OptionName = "validation";
}

export default Gantt;
export {
  Gantt,
  IGanttOptions,
  Column,
  IColumnProps,
  ColumnHeaderFilter,
  IColumnHeaderFilterProps,
  ContextMenu,
  IContextMenuProps,
  ContextMenuItem,
  IContextMenuItemProps,
  Dependencies,
  IDependenciesProps,
  Editing,
  IEditingProps,
  FilterRow,
  IFilterRowProps,
  Format,
  IFormatProps,
  GanttHeaderFilter,
  IGanttHeaderFilterProps,
  HeaderFilter,
  IHeaderFilterProps,
  Item,
  IItemProps,
  Lookup,
  ILookupProps,
  OperationDescriptions,
  IOperationDescriptionsProps,
  ResourceAssignments,
  IResourceAssignmentsProps,
  Resources,
  IResourcesProps,
  ScaleTypeRange,
  IScaleTypeRangeProps,
  Sorting,
  ISortingProps,
  StripLine,
  IStripLineProps,
  Tasks,
  ITasksProps,
  Texts,
  ITextsProps,
  Toolbar,
  IToolbarProps,
  ToolbarItem,
  IToolbarItemProps,
  Validation,
  IValidationProps
};
import type * as GanttTypes from 'devextreme/ui/gantt_types';
export { GanttTypes };

