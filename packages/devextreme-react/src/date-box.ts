import dxDateBox, {
    Properties
} from "devextreme/ui/date_box";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ChangeEvent, ClosedEvent, ContentReadyEvent, CopyEvent, CutEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, KeyDownEvent, KeyUpEvent, OpenedEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/date_box";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, OptionChangedEvent as ButtonOptionChangedEvent, ClickEvent } from "devextreme/ui/button";
import type { DisposingEvent as CalendarDisposingEvent, InitializedEvent as CalendarInitializedEvent, ValueChangedEvent as CalendarValueChangedEvent, DisabledDate, OptionChangedEvent } from "devextreme/ui/calendar";
import type { AnimationConfig, AnimationState } from "devextreme/animation/fx";
import type { template } from "devextreme/core/templates/template";
import type { event, EventInfo } from "devextreme/events/index";
import type { Component } from "devextreme/core/component";
import type { PositionConfig } from "devextreme/animation/position";
import type { dxPopupToolbarItem } from "devextreme/ui/popup";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

import type dxOverlay from "devextreme/ui/overlay";
import type DOMComponent from "devextreme/core/dom_component";
import type dxPopup from "devextreme/ui/popup";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IDateBoxOptionsNarrowedEvents = {
  onChange?: ((e: ChangeEvent) => any);
  onClosed?: ((e: ClosedEvent) => any);
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
  onOpened?: ((e: OpenedEvent) => any);
  onPaste?: ((e: PasteEvent) => any);
  onValueChanged?: ((e: ValueChangedEvent) => any);
}

type IDateBoxOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IDateBoxOptionsNarrowedEvents> & IHtmlOptions & {
  dropDownButtonRender?: (...params: any) => React.ReactNode;
  dropDownButtonComponent?: React.ComponentType<any>;
  dropDownButtonKeyFn?: (data: any) => string;
  defaultOpened?: boolean;
  defaultValue?: any | number | string;
  onOpenedChange?: (value: boolean) => void;
  onValueChange?: (value: any | number | string) => void;
}>

class DateBox extends BaseComponent<React.PropsWithChildren<IDateBoxOptions>> {

  public get instance(): dxDateBox {
    return this._instance;
  }

  protected _WidgetClass = dxDateBox;

  protected useRequestAnimationFrameFlag = true;

  protected subscribableOptions = ["opened","value"];

  protected independentEvents = ["onChange","onClosed","onContentReady","onCopy","onCut","onDisposing","onEnterKey","onFocusIn","onFocusOut","onInitialized","onInput","onKeyDown","onKeyUp","onOpened","onPaste","onValueChanged"];

  protected _defaults = {
    defaultOpened: "opened",
    defaultValue: "value"
  };

  protected _expectedChildren = {
    button: { optionName: "buttons", isCollectionItem: true },
    calendarOptions: { optionName: "calendarOptions", isCollectionItem: false },
    displayFormat: { optionName: "displayFormat", isCollectionItem: false },
    dropDownOptions: { optionName: "dropDownOptions", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "dropDownButtonTemplate",
    render: "dropDownButtonRender",
    component: "dropDownButtonComponent",
    keyFn: "dropDownButtonKeyFn"
  }];
}
(DateBox as any).propTypes = {
  acceptCustomValue: PropTypes.bool,
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  adaptivityEnabled: PropTypes.bool,
  applyButtonText: PropTypes.string,
  applyValueMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "instantly",
      "useButtons"])
  ]),
  buttons: PropTypes.array,
  calendarOptions: PropTypes.object,
  cancelButtonText: PropTypes.string,
  dateOutOfRangeMessage: PropTypes.string,
  dateSerializationFormat: PropTypes.string,
  deferRendering: PropTypes.bool,
  disabled: PropTypes.bool,
  disabledDates: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func
  ]),
  displayFormat: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.string
  ]),
  dropDownOptions: PropTypes.object,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  interval: PropTypes.number,
  invalidDateMessage: PropTypes.string,
  isValid: PropTypes.bool,
  label: PropTypes.string,
  labelMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "static",
      "floating",
      "hidden"])
  ]),
  maxLength: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  onClosed: PropTypes.func,
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
  onOpened: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onPaste: PropTypes.func,
  onValueChanged: PropTypes.func,
  opened: PropTypes.bool,
  openOnFieldClick: PropTypes.bool,
  pickerType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "calendar",
      "list",
      "native",
      "rollers"])
  ]),
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  showAnalogClock: PropTypes.bool,
  showClearButton: PropTypes.bool,
  showDropDownButton: PropTypes.bool,
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
  todayButtonText: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "date",
      "datetime",
      "time"])
  ]),
  useMaskBehavior: PropTypes.bool,
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
      "top",
      "auto"])
  ]),
  validationStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "valid",
      "invalid",
      "pending"])
  ]),
  valueChangeEvent: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// DropDownOptions
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
// DateBox
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
// DateBox
type ICalendarOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  cellTemplate?: ((itemData: { date: any, text: string, view: string }, itemIndex: number, itemElement: any) => any) | template;
  dateSerializationFormat?: string;
  disabled?: boolean;
  disabledDates?: Array<any> | ((data: DisabledDate) => any);
  elementAttr?: Record<string, any>;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  focusStateEnabled?: boolean;
  height?: (() => any) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  isValid?: boolean;
  max?: any | number | string;
  maxZoomLevel?: "century" | "decade" | "month" | "year";
  min?: any | number | string;
  minZoomLevel?: "century" | "decade" | "month" | "year";
  name?: string;
  onDisposing?: ((e: CalendarDisposingEvent) => any);
  onInitialized?: ((e: CalendarInitializedEvent) => any);
  onOptionChanged?: ((e: OptionChangedEvent) => any);
  onValueChanged?: ((e: CalendarValueChangedEvent) => any);
  readOnly?: boolean;
  rtlEnabled?: boolean;
  showTodayButton?: boolean;
  showWeekNumbers?: boolean;
  tabIndex?: number;
  validationError?: any;
  validationErrors?: Array<any>;
  validationMessageMode?: "always" | "auto";
  validationMessagePosition?: "bottom" | "left" | "right" | "top";
  validationStatus?: "valid" | "invalid" | "pending";
  value?: any | number | string;
  visible?: boolean;
  weekNumberRule?: "auto" | "firstDay" | "fullWeek" | "firstFourDays";
  width?: (() => any) | number | string;
  zoomLevel?: "century" | "decade" | "month" | "year";
  defaultValue?: any | number | string;
  onValueChange?: (value: any | number | string) => void;
  defaultZoomLevel?: "century" | "decade" | "month" | "year";
  onZoomLevelChange?: (value: "century" | "decade" | "month" | "year") => void;
  cellRender?: (...params: any) => React.ReactNode;
  cellComponent?: React.ComponentType<any>;
  cellKeyFn?: (data: any) => string;
}>
class CalendarOptions extends NestedOption<ICalendarOptionsProps> {
  public static OptionName = "calendarOptions";
  public static DefaultsProps = {
    defaultValue: "value",
    defaultZoomLevel: "zoomLevel"
  };
  public static TemplateProps = [{
    tmplOption: "cellTemplate",
    render: "cellRender",
    component: "cellComponent",
    keyFn: "cellKeyFn"
  }];
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
// DateBox
type IDisplayFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | any) => any);
  parser?: ((value: string) => any);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
class DisplayFormat extends NestedOption<IDisplayFormatProps> {
  public static OptionName = "displayFormat";
}

// owners:
// DateBox
type IDropDownOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => any);
  container?: any | string;
  contentTemplate?: ((contentElement: any) => any) | template;
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
  height?: (() => any) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => any);
  hideOnParentScroll?: boolean;
  hint?: string;
  hoverStateEnabled?: boolean;
  maxHeight?: (() => any) | number | string;
  maxWidth?: (() => any) | number | string;
  minHeight?: (() => any) | number | string;
  minWidth?: (() => any) | number | string;
  onContentReady?: ((e: EventInfo<any>) => any);
  onDisposing?: ((e: EventInfo<any>) => any);
  onHidden?: ((e: EventInfo<any>) => any);
  onHiding?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => any);
  onInitialized?: ((e: { component: Component<any>, element: any }) => any);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => any);
  onResize?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => any);
  onResizeEnd?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => any);
  onResizeStart?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => any);
  onShowing?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => any);
  onShown?: ((e: EventInfo<any>) => any);
  onTitleRendered?: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => any);
  position?: (() => any) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  resizeEnabled?: boolean;
  restorePosition?: boolean;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  tabIndex?: number;
  title?: string;
  titleTemplate?: ((titleElement: any) => any) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: (() => any) | number | string;
  wrapperAttr?: any;
  defaultHeight?: (() => any) | number | string;
  onHeightChange?: (value: (() => any) | number | string) => void;
  defaultPosition?: (() => any) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  onPositionChange?: (value: (() => any) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top") => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => any) | number | string;
  onWidthChange?: (value: (() => any) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  contentKeyFn?: (data: any) => string;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
  titleKeyFn?: (data: any) => string;
}>
class DropDownOptions extends NestedOption<IDropDownOptionsProps> {
  public static OptionName = "dropDownOptions";
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
// Animation
type IHideProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => any);
  delay?: number;
  direction?: "bottom" | "left" | "right" | "top";
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => any);
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
// Position
type IMyProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
class My extends NestedOption<IMyProps> {
  public static OptionName = "my";
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
  onOptionChanged?: ((e: ButtonOptionChangedEvent) => any);
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

// owners:
// From
// DropDownOptions
type IPositionProps = React.PropsWithChildren<{
  at?: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
  };
  boundary?: any | string;
  boundaryOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  collision?: Record<string, any> | "fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit" | {
    x?: "fit" | "flip" | "flipfit" | "none";
    y?: "fit" | "flip" | "flipfit" | "none";
  };
  my?: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
  };
  of?: any | string;
  offset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
}>
class Position extends NestedOption<IPositionProps> {
  public static OptionName = "position";
}

// owners:
// Animation
type IShowProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => any);
  delay?: number;
  direction?: "bottom" | "left" | "right" | "top";
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => any);
  to?: AnimationState;
  type?: "css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut";
}>
class Show extends NestedOption<IShowProps> {
  public static OptionName = "show";
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
// DropDownOptions
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  html?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => any) | template;
  options?: any;
  showText?: "always" | "inMenu";
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => any) | template;
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

export default DateBox;
export {
  DateBox,
  IDateBoxOptions,
  Animation,
  IAnimationProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Button,
  IButtonProps,
  CalendarOptions,
  ICalendarOptionsProps,
  Collision,
  ICollisionProps,
  DisplayFormat,
  IDisplayFormatProps,
  DropDownOptions,
  IDropDownOptionsProps,
  From,
  IFromProps,
  Hide,
  IHideProps,
  My,
  IMyProps,
  Offset,
  IOffsetProps,
  Options,
  IOptionsProps,
  Position,
  IPositionProps,
  Show,
  IShowProps,
  To,
  IToProps,
  ToolbarItem,
  IToolbarItemProps
};
import type * as DateBoxTypes from 'devextreme/ui/date_box_types';
export { DateBoxTypes };

