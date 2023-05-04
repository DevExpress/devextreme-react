export { ExplicitTypes } from "devextreme/ui/list";
import dxList, {
    Properties
} from "devextreme/ui/list";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxListItem } from "devextreme/ui/list";
import type { dxButtonOptions } from "devextreme/ui/button";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";
import type { event, EventInfo, NativeEventInfo } from "devextreme/events/index";
import type { Component } from "devextreme/core/component";
import type { dxTextEditorButton } from "devextreme/ui/text_box/ui.text_editor.base";

import type dxSortable from "devextreme/ui/sortable";
import type dxDraggable from "devextreme/ui/draggable";
import type DOMComponent from "devextreme/core/dom_component";
import type dxButton from "devextreme/ui/button";
import type Editor from "devextreme/ui/editor/editor";

type IListOptions<TItem = any, TKey = any> = React.PropsWithChildren<Properties<TItem, TKey> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  groupRender?: (...params: any) => React.ReactNode;
  groupComponent?: React.ComponentType<any>;
  groupKeyFn?: (data: any) => string;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<any | dxListItem | string>;
  defaultSelectedItemKeys?: Array<any>;
  defaultSelectedItems?: Array<any>;
  onItemsChange?: (value: Array<any | dxListItem | string>) => void;
  onSelectedItemKeysChange?: (value: Array<any>) => void;
  onSelectedItemsChange?: (value: Array<any>) => void;
}>

class List<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<IListOptions<TItem, TKey>>> {

  public get instance(): dxList<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxList;

  protected subscribableOptions = ["items","selectedItemKeys","selectedItems"];

  protected independentEvents = ["onContentReady","onDisposing","onGroupRendered","onInitialized","onItemClick","onItemContextMenu","onItemDeleted","onItemDeleting","onItemHold","onItemRendered","onItemReordered","onItemSwipe","onPageLoading","onPullRefresh","onScroll","onSelectAllValueChanged"];

  protected _defaults = {
    defaultItems: "items",
    defaultSelectedItemKeys: "selectedItemKeys",
    defaultSelectedItems: "selectedItems"
  };

  protected _expectedChildren = {
    item: { optionName: "items", isCollectionItem: true },
    itemDragging: { optionName: "itemDragging", isCollectionItem: false },
    menuItem: { optionName: "menuItems", isCollectionItem: true },
    searchEditorOptions: { optionName: "searchEditorOptions", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "groupTemplate",
    render: "groupRender",
    component: "groupComponent",
    keyFn: "groupKeyFn"
  }, {
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}
(List as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowItemDeleting: PropTypes.bool,
  bounceEnabled: PropTypes.bool,
  collapsibleGroups: PropTypes.bool,
  disabled: PropTypes.bool,
  displayExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  grouped: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  indicateLoading: PropTypes.bool,
  itemDeleteMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "context",
      "slideButton",
      "slideItem",
      "static",
      "swipe",
      "toggle"])
  ]),
  itemDragging: PropTypes.object,
  itemHoldTimeout: PropTypes.number,
  items: PropTypes.array,
  keyExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  menuItems: PropTypes.array,
  menuMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "context",
      "slide"])
  ]),
  nextButtonText: PropTypes.string,
  noDataText: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onGroupRendered: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemDeleted: PropTypes.func,
  onItemDeleting: PropTypes.func,
  onItemHold: PropTypes.func,
  onItemRendered: PropTypes.func,
  onItemReordered: PropTypes.func,
  onItemSwipe: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onPageLoading: PropTypes.func,
  onPullRefresh: PropTypes.func,
  onScroll: PropTypes.func,
  onSelectAllValueChanged: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  pageLoadingText: PropTypes.string,
  pageLoadMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "nextButton",
      "scrollBottom"])
  ]),
  pulledDownText: PropTypes.string,
  pullingDownText: PropTypes.string,
  pullRefreshEnabled: PropTypes.bool,
  refreshingText: PropTypes.string,
  repaintChangesOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  scrollByContent: PropTypes.bool,
  scrollByThumb: PropTypes.bool,
  scrollingEnabled: PropTypes.bool,
  searchEditorOptions: PropTypes.object,
  searchEnabled: PropTypes.bool,
  searchExpr: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.string
  ]),
  searchMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "contains",
      "startswith",
      "equals"])
  ]),
  searchTimeout: PropTypes.number,
  searchValue: PropTypes.string,
  selectAllMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "allPages",
      "page"])
  ]),
  selectAllText: PropTypes.string,
  selectByClick: PropTypes.bool,
  selectedItemKeys: PropTypes.array,
  selectedItems: PropTypes.array,
  selectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple",
      "all",
      "none"])
  ]),
  showScrollbar: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "always",
      "never",
      "onHover",
      "onScroll"])
  ]),
  showSelectionControls: PropTypes.bool,
  tabIndex: PropTypes.number,
  useNativeScrolling: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// SearchEditorOptions
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
// ItemDragging
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class CursorOffset extends NestedOption<ICursorOffsetProps> {
  public static OptionName = "cursorOffset";
}

// owners:
// List
type IItemProps = React.PropsWithChildren<{
  badge?: string;
  disabled?: boolean;
  html?: string;
  icon?: string;
  key?: string;
  showChevron?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
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
// List
type IItemDraggingProps = React.PropsWithChildren<{
  allowDropInsideItem?: boolean;
  allowReordering?: boolean;
  autoScroll?: boolean;
  bindingOptions?: object;
  boundary?: any | string;
  container?: any | string;
  cursorOffset?: object | string | {
    x?: number;
    y?: number;
  };
  data?: any;
  dragDirection?: "both" | "horizontal" | "vertical";
  dragTemplate?: ((dragInfo: { fromIndex: number, itemData: any, itemElement: any }, containerElement: any) => string) | template;
  dropFeedbackMode?: "push" | "indicate";
  elementAttr?: object;
  filter?: string;
  group?: string;
  handle?: string;
  height?: (() => number) | number | string;
  itemOrientation?: "horizontal" | "vertical";
  moveItemOnDrop?: boolean;
  onAdd?: ((e: { component: dxSortable, dropInsideItem: boolean, element: any, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, model: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onDragChange?: ((e: { cancel: boolean, component: dxSortable, dropInsideItem: boolean, element: any, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, model: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragEnd?: ((e: { cancel: boolean, component: dxSortable, dropInsideItem: boolean, element: any, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, model: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragMove?: ((e: { cancel: boolean, component: dxSortable, dropInsideItem: boolean, element: any, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, model: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragStart?: ((e: { cancel: boolean, component: dxSortable, element: any, event: event, fromData: any, fromIndex: number, itemData: any, itemElement: any, model: any }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onRemove?: ((e: { component: dxSortable, element: any, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, model: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onReorder?: ((e: { component: dxSortable, dropInsideItem: boolean, element: any, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, model: any, promise: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  rtlEnabled?: boolean;
  scrollSensitivity?: number;
  scrollSpeed?: number;
  width?: (() => number) | number | string;
  dragRender?: (...params: any) => React.ReactNode;
  dragComponent?: React.ComponentType<any>;
  dragKeyFn?: (data: any) => string;
}>
class ItemDragging extends NestedOption<IItemDraggingProps> {
  public static OptionName = "itemDragging";
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
// List
type IMenuItemProps = React.PropsWithChildren<{
  action?: ((itemElement: any, itemData: object) => void);
  text?: string;
}>
class MenuItem extends NestedOption<IMenuItemProps> {
  public static OptionName = "menuItems";
  public static IsCollectionItem = true;
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
  stylingMode?: "text" | "outlined" | "contained";
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string) | template;
  text?: string;
  type?: "back" | "danger" | "default" | "normal" | "success";
  useSubmitBehavior?: boolean;
  validationGroup?: string;
  visible?: boolean;
  width?: (() => number) | number | string;
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

// owners:
// List
type ISearchEditorOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  bindingOptions?: object;
  buttons?: Array<dxTextEditorButton | string | "clear">;
  disabled?: boolean;
  elementAttr?: object;
  focusStateEnabled?: boolean;
  height?: (() => number) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  inputAttr?: any;
  isValid?: boolean;
  label?: string;
  labelMode?: "static" | "floating" | "hidden";
  mask?: string;
  maskChar?: string;
  maskInvalidMessage?: string;
  maskRules?: any;
  maxLength?: number | string;
  mode?: "email" | "password" | "search" | "tel" | "text" | "url";
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
  showMaskMode?: "always" | "onFocus";
  spellcheck?: boolean;
  stylingMode?: "outlined" | "underlined" | "filled";
  tabIndex?: number;
  text?: string;
  useMaskedValue?: boolean;
  validationError?: any;
  validationErrors?: Array<any>;
  validationMessageMode?: "always" | "auto";
  validationMessagePosition?: "bottom" | "left" | "right" | "top";
  validationStatus?: "valid" | "invalid" | "pending";
  value?: string;
  valueChangeEvent?: string;
  visible?: boolean;
  width?: (() => number) | number | string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>
class SearchEditorOptions extends NestedOption<ISearchEditorOptionsProps> {
  public static OptionName = "searchEditorOptions";
  public static DefaultsProps = {
    defaultValue: "value"
  };
  public static ExpectedChildren = {
    button: { optionName: "buttons", isCollectionItem: true }
  };
}

export default List;
export {
  List,
  IListOptions,
  Button,
  IButtonProps,
  CursorOffset,
  ICursorOffsetProps,
  Item,
  IItemProps,
  ItemDragging,
  IItemDraggingProps,
  MenuItem,
  IMenuItemProps,
  Options,
  IOptionsProps,
  SearchEditorOptions,
  ISearchEditorOptionsProps
};
import type * as ListTypes from 'devextreme/ui/list_types';
export { ListTypes };

