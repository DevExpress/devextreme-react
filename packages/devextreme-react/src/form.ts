import dxForm, {
  Properties,
} from 'devextreme/ui/form';

import * as PropTypes from 'prop-types';

import type { dxButtonOptions } from 'devextreme/ui/button';
import type { event, EventInfo } from 'devextreme/events/index';
import type { Component } from 'devextreme/core/component';
import type { template } from 'devextreme/core/templates/template';
import type {
  dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem,
} from 'devextreme/ui/form';
import type { CollectionWidgetItem } from 'devextreme/ui/collection/ui.collection_widget.base';
import type { dxTabPanelOptions, dxTabPanelItem } from 'devextreme/ui/tab_panel';
import type { DataSourceOptions } from 'devextreme/data/data_source';
import type { Store } from 'devextreme/data/abstract_store';

import type dxButton from 'devextreme/ui/button';
import type DOMComponent from 'devextreme/core/dom_component';
import type DataSource from 'devextreme/data/data_source';
import type CollectionWidget from 'devextreme/ui/collection/ui.collection_widget.base';
import type dxTabPanel from 'devextreme/ui/tab_panel';

import type * as CommonTypes from 'devextreme/common';
import type * as FormTypes from 'devextreme/ui/form_types';
import NestedOption from './core/nested-option';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type IFormOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultFormData?: any;
  onFormDataChange?: (value: any) => void;
}>;

class Form extends BaseComponent<React.PropsWithChildren<IFormOptions>> {
  public get instance(): dxForm {
    return this._instance;
  }

  protected _WidgetClass = dxForm;

  protected subscribableOptions = ['formData'];

  protected independentEvents = ['onContentReady', 'onDisposing', 'onEditorEnterKey', 'onInitialized'];

  protected _defaults = {
    defaultFormData: 'formData',
  };

  protected _expectedChildren = {
    ButtonItem: { optionName: 'items', isCollectionItem: true },
    colCountByScreen: { optionName: 'colCountByScreen', isCollectionItem: false },
    EmptyItem: { optionName: 'items', isCollectionItem: true },
    GroupItem: { optionName: 'items', isCollectionItem: true },
    item: { optionName: 'items', isCollectionItem: true },
    SimpleItem: { optionName: 'items', isCollectionItem: true },
    TabbedItem: { optionName: 'items', isCollectionItem: true },
  };
}
(Form as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  alignItemLabels: PropTypes.bool,
  alignItemLabelsInAllGroups: PropTypes.bool,
  colCount: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([
        'auto']),
    ]),
  ]),
  colCountByScreen: PropTypes.object,
  customizeItem: PropTypes.func,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  items: PropTypes.array,
  labelLocation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'left',
      'right',
      'top']),
  ]),
  labelMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'static',
      'floating',
      'hidden',
      'outside']),
  ]),
  minColWidth: PropTypes.number,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onEditorEnterKey: PropTypes.func,
  onFieldDataChanged: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  optionalMark: PropTypes.string,
  readOnly: PropTypes.bool,
  requiredMark: PropTypes.string,
  requiredMessage: PropTypes.string,
  rtlEnabled: PropTypes.bool,
  screenByWidth: PropTypes.func,
  scrollingEnabled: PropTypes.bool,
  showColonAfterLabel: PropTypes.bool,
  showOptionalMark: PropTypes.bool,
  showRequiredMark: PropTypes.bool,
  showValidationSummary: PropTypes.bool,
  tabIndex: PropTypes.number,
  validationGroup: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
};

// owners:
// SimpleItem
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
  validationCallback?: ((options: { column: object, data: object, formItem: object, rule: object, validator: object, value: string | number }) => any);
}>;
class AsyncRule extends NestedOption<IAsyncRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'async',
  };
}

// owners:
// Form
type IButtonItemProps = React.PropsWithChildren<{
  buttonOptions?: dxButtonOptions;
  colSpan?: number;
  cssClass?: string;
  horizontalAlignment?: 'center' | 'left' | 'right';
  itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
  name?: string;
  verticalAlignment?: 'bottom' | 'center' | 'top';
  visible?: boolean;
  visibleIndex?: number;
}>;
class ButtonItem extends NestedOption<IButtonItemProps> {
  public static OptionName = 'items';

  public static IsCollectionItem = true;

  public static ExpectedChildren = {
    buttonOptions: { optionName: 'buttonOptions', isCollectionItem: false },
  };

  public static PredefinedProps = {
    itemType: 'button',
  };
}

// owners:
// ButtonItem
type IButtonOptionsProps = React.PropsWithChildren<{
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
class ButtonOptions extends NestedOption<IButtonOptionsProps> {
  public static OptionName = 'buttonOptions';

  public static TemplateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];
}

// owners:
// Form
// GroupItem
// Tab
type IColCountByScreenProps = React.PropsWithChildren<{
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
}>;
class ColCountByScreen extends NestedOption<IColCountByScreenProps> {
  public static OptionName = 'colCountByScreen';
}

// owners:
// SimpleItem
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => object);
  comparisonType?: '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}>;
class CompareRule extends NestedOption<ICompareRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'compare',
  };
}

// owners:
// SimpleItem
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
  validationCallback?: ((options: { column: object, data: object, formItem: object, rule: object, validator: object, value: string | number }) => boolean);
}>;
class CustomRule extends NestedOption<ICustomRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'custom',
  };
}

// owners:
// SimpleItem
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}>;
class EmailRule extends NestedOption<IEmailRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'email',
  };
}

// owners:
// Form
type IEmptyItemProps = React.PropsWithChildren<{
  colSpan?: number;
  cssClass?: string;
  itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
  name?: string;
  visible?: boolean;
  visibleIndex?: number;
}>;
class EmptyItem extends NestedOption<IEmptyItemProps> {
  public static OptionName = 'items';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    itemType: 'empty',
  };
}

// owners:
// Form
type IGroupItemProps = React.PropsWithChildren<{
  alignItemLabels?: boolean;
  caption?: string;
  colCount?: number;
  colCountByScreen?: object | {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
  };
  colSpan?: number;
  cssClass?: string;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
  name?: string;
  template?: ((data: { component: dxForm, formData: object }, itemElement: any) => string) | template;
  visible?: boolean;
  visibleIndex?: number;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>;
class GroupItem extends NestedOption<IGroupItemProps> {
  public static OptionName = 'items';

  public static IsCollectionItem = true;

  public static ExpectedChildren = {
    colCountByScreen: { optionName: 'colCountByScreen', isCollectionItem: false },
  };

  public static TemplateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];

  public static PredefinedProps = {
    itemType: 'group',
  };
}

// owners:
// TabPanelOptions
// Form
type IItemProps = React.PropsWithChildren<{
  badge?: string;
  disabled?: boolean;
  html?: string;
  icon?: string;
  tabTemplate?: (() => string) | template;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string) | template;
  text?: string;
  title?: string;
  colSpan?: number;
  cssClass?: string;
  dataField?: string;
  editorOptions?: any;
  editorType?: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';
  helpText?: string;
  isRequired?: boolean;
  itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
  label?: object | {
    alignment?: 'center' | 'left' | 'right';
    location?: 'left' | 'right' | 'top';
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string) | template;
    text?: string;
    visible?: boolean;
  };
  name?: string;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number;
  alignItemLabels?: boolean;
  caption?: string;
  colCount?: number;
  colCountByScreen?: object | {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
  };
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  tabPanelOptions?: dxTabPanelOptions;
  tabs?: Array<object> | {
    alignItemLabels?: boolean;
    badge?: string;
    colCount?: number;
    colCountByScreen?: object | {
      lg?: number;
      md?: number;
      sm?: number;
      xs?: number;
    };
    disabled?: boolean;
    icon?: string;
    items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
    tabTemplate?: ((tabData: object, tabIndex: number, tabElement: any) => any) | template;
    template?: ((tabData: object, tabIndex: number, tabElement: any) => any) | template;
    title?: string;
  }[];
  buttonOptions?: dxButtonOptions;
  horizontalAlignment?: 'center' | 'left' | 'right';
  verticalAlignment?: 'bottom' | 'center' | 'top';
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  tabKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>;
class Item extends NestedOption<IItemProps> {
  public static OptionName = 'items';

  public static IsCollectionItem = true;

  public static TemplateProps = [{
    tmplOption: 'tabTemplate',
    render: 'tabRender',
    component: 'tabComponent',
    keyFn: 'tabKeyFn',
  }, {
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];
}

// owners:
// SimpleItem
type ILabelProps = React.PropsWithChildren<{
  alignment?: 'center' | 'left' | 'right';
  location?: 'left' | 'right' | 'top';
  showColon?: boolean;
  template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>;
class Label extends NestedOption<ILabelProps> {
  public static OptionName = 'label';

  public static TemplateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];
}

// owners:
// SimpleItem
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}>;
class NumericRule extends NestedOption<INumericRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'numeric',
  };
}

// owners:
// SimpleItem
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: any | string;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}>;
class PatternRule extends NestedOption<IPatternRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'pattern',
  };
}

// owners:
// SimpleItem
type IRangeRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: any | number;
  message?: string;
  min?: any | number;
  reevaluate?: boolean;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}>;
class RangeRule extends NestedOption<IRangeRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'range',
  };
}

// owners:
// SimpleItem
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}>;
class RequiredRule extends NestedOption<IRequiredRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'required',
  };
}

// owners:
// Form
type ISimpleItemProps = React.PropsWithChildren<{
  colSpan?: number;
  cssClass?: string;
  dataField?: string;
  editorOptions?: any;
  editorType?: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';
  helpText?: string;
  isRequired?: boolean;
  itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
  label?: object | {
    alignment?: 'center' | 'left' | 'right';
    location?: 'left' | 'right' | 'top';
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
}>;
class SimpleItem extends NestedOption<ISimpleItemProps> {
  public static OptionName = 'items';

  public static IsCollectionItem = true;

  public static ExpectedChildren = {
    AsyncRule: { optionName: 'validationRules', isCollectionItem: true },
    CompareRule: { optionName: 'validationRules', isCollectionItem: true },
    CustomRule: { optionName: 'validationRules', isCollectionItem: true },
    EmailRule: { optionName: 'validationRules', isCollectionItem: true },
    label: { optionName: 'label', isCollectionItem: false },
    NumericRule: { optionName: 'validationRules', isCollectionItem: true },
    PatternRule: { optionName: 'validationRules', isCollectionItem: true },
    RangeRule: { optionName: 'validationRules', isCollectionItem: true },
    RequiredRule: { optionName: 'validationRules', isCollectionItem: true },
    StringLengthRule: { optionName: 'validationRules', isCollectionItem: true },
    validationRule: { optionName: 'validationRules', isCollectionItem: true },
  };

  public static TemplateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];

  public static PredefinedProps = {
    itemType: 'simple',
  };
}

// owners:
// SimpleItem
type IStringLengthRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: number;
  message?: string;
  min?: number;
  trim?: boolean;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}>;
class StringLengthRule extends NestedOption<IStringLengthRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'stringLength',
  };
}

// owners:
// TabbedItem
type ITabProps = React.PropsWithChildren<{
  alignItemLabels?: boolean;
  badge?: string;
  colCount?: number;
  colCountByScreen?: object | {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
  };
  disabled?: boolean;
  icon?: string;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  tabTemplate?: ((tabData: object, tabIndex: number, tabElement: any) => any) | template;
  template?: ((tabData: object, tabIndex: number, tabElement: any) => any) | template;
  title?: string;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  tabKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>;
class Tab extends NestedOption<ITabProps> {
  public static OptionName = 'tabs';

  public static IsCollectionItem = true;

  public static ExpectedChildren = {
    colCountByScreen: { optionName: 'colCountByScreen', isCollectionItem: false },
  };

  public static TemplateProps = [{
    tmplOption: 'tabTemplate',
    render: 'tabRender',
    component: 'tabComponent',
    keyFn: 'tabKeyFn',
  }, {
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];
}

// owners:
// Form
type ITabbedItemProps = React.PropsWithChildren<{
  colSpan?: number;
  cssClass?: string;
  itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
  name?: string;
  tabPanelOptions?: dxTabPanelOptions;
  tabs?: Array<object> | {
    alignItemLabels?: boolean;
    badge?: string;
    colCount?: number;
    colCountByScreen?: object | {
      lg?: number;
      md?: number;
      sm?: number;
      xs?: number;
    };
    disabled?: boolean;
    icon?: string;
    items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
    tabTemplate?: ((tabData: object, tabIndex: number, tabElement: any) => any) | template;
    template?: ((tabData: object, tabIndex: number, tabElement: any) => any) | template;
    title?: string;
  }[];
  visible?: boolean;
  visibleIndex?: number;
}>;
class TabbedItem extends NestedOption<ITabbedItemProps> {
  public static OptionName = 'items';

  public static IsCollectionItem = true;

  public static ExpectedChildren = {
    tab: { optionName: 'tabs', isCollectionItem: true },
    tabPanelOptions: { optionName: 'tabPanelOptions', isCollectionItem: false },
  };

  public static PredefinedProps = {
    itemType: 'tabbed',
  };
}

// owners:
// TabbedItem
type ITabPanelOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  animationEnabled?: boolean;
  bindingOptions?: object;
  dataSource?: Array<any | dxTabPanelItem | string> | DataSource | DataSourceOptions | null | Store | string;
  deferRendering?: boolean;
  disabled?: boolean;
  elementAttr?: object;
  focusStateEnabled?: boolean;
  height?: (() => number) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  itemHoldTimeout?: number;
  items?: Array<any | dxTabPanelItem | string>;
  itemTemplate?: ((itemData: object, itemIndex: number, itemElement: any) => string) | template;
  itemTitleTemplate?: ((itemData: object, itemIndex: number, itemElement: any) => string) | template;
  loop?: boolean;
  noDataText?: string;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onItemClick?: ((e: { component: CollectionWidget<any>, element: any, event: event, itemData: object, itemElement: any, itemIndex: number, model: any }) => void);
  onItemContextMenu?: ((e: { component: CollectionWidget<any>, element: any, event: event, itemData: object, itemElement: any, itemIndex: number, model: any }) => void);
  onItemHold?: ((e: { component: CollectionWidget<any>, element: any, event: event, itemData: object, itemElement: any, itemIndex: number, model: any }) => void);
  onItemRendered?: ((e: { component: CollectionWidget<any>, element: any, itemData: object, itemElement: any, itemIndex: number, model: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onSelectionChanged?: ((e: { addedItems: Array<any>, component: CollectionWidget<any>, element: any, model: any, removedItems: Array<any> }) => void);
  onTitleClick?: ((e: { component: dxTabPanel, element: any, event: event, itemData: object, itemElement: any, model: any }) => void);
  onTitleHold?: ((e: { component: dxTabPanel, element: any, event: event, itemData: object, itemElement: any, model: any }) => void);
  onTitleRendered?: ((e: { component: dxTabPanel, element: any, itemData: object, itemElement: any, model: any }) => void);
  repaintChangesOnly?: boolean;
  rtlEnabled?: boolean;
  scrollByContent?: boolean;
  scrollingEnabled?: boolean;
  selectedIndex?: number;
  selectedItem?: any;
  showNavButtons?: boolean;
  swipeEnabled?: boolean;
  tabIndex?: number;
  visible?: boolean;
  width?: (() => number) | number | string;
  defaultItems?: Array<any | dxTabPanelItem | string>;
  onItemsChange?: (value: Array<any | dxTabPanelItem | string>) => void;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (value: number) => void;
  defaultSelectedItem?: any;
  onSelectedItemChange?: (value: any) => void;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  itemTitleRender?: (...params: any) => React.ReactNode;
  itemTitleComponent?: React.ComponentType<any>;
  itemTitleKeyFn?: (data: any) => string;
}>;
class TabPanelOptions extends NestedOption<ITabPanelOptionsProps> {
  public static OptionName = 'tabPanelOptions';

  public static DefaultsProps = {
    defaultItems: 'items',
    defaultSelectedIndex: 'selectedIndex',
    defaultSelectedItem: 'selectedItem',
  };

  public static ExpectedChildren = {
    item: { optionName: 'items', isCollectionItem: true },
    tabPanelOptionsItem: { optionName: 'items', isCollectionItem: true },
  };

  public static TemplateProps = [{
    tmplOption: 'itemTemplate',
    render: 'itemRender',
    component: 'itemComponent',
    keyFn: 'itemKeyFn',
  }, {
    tmplOption: 'itemTitleTemplate',
    render: 'itemTitleRender',
    component: 'itemTitleComponent',
    keyFn: 'itemTitleKeyFn',
  }];
}

// owners:
// TabPanelOptions
type ITabPanelOptionsItemProps = React.PropsWithChildren<{
  badge?: string;
  disabled?: boolean;
  html?: string;
  icon?: string;
  tabTemplate?: (() => string) | template;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string) | template;
  text?: string;
  title?: string;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  tabKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>;
class TabPanelOptionsItem extends NestedOption<ITabPanelOptionsItemProps> {
  public static OptionName = 'items';

  public static IsCollectionItem = true;

  public static TemplateProps = [{
    tmplOption: 'tabTemplate',
    render: 'tabRender',
    component: 'tabComponent',
    keyFn: 'tabKeyFn',
  }, {
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];
}

// owners:
// SimpleItem
type IValidationRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
  ignoreEmptyValue?: boolean;
  max?: any | number;
  min?: any | number;
  reevaluate?: boolean;
  validationCallback?: ((options: { column: object, data: object, formItem: object, rule: object, validator: object, value: string | number }) => boolean);
  comparisonTarget?: (() => object);
  comparisonType?: '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';
  pattern?: any | string;
}>;
class ValidationRule extends NestedOption<IValidationRuleProps> {
  public static OptionName = 'validationRules';

  public static IsCollectionItem = true;

  public static PredefinedProps = {
    type: 'required',
  };
}

export default Form;
export {
  Form,
  IFormOptions,
  AsyncRule,
  IAsyncRuleProps,
  ButtonItem,
  IButtonItemProps,
  ButtonOptions,
  IButtonOptionsProps,
  ColCountByScreen,
  IColCountByScreenProps,
  CompareRule,
  ICompareRuleProps,
  CustomRule,
  ICustomRuleProps,
  EmailRule,
  IEmailRuleProps,
  EmptyItem,
  IEmptyItemProps,
  GroupItem,
  IGroupItemProps,
  Item,
  IItemProps,
  Label,
  ILabelProps,
  NumericRule,
  INumericRuleProps,
  PatternRule,
  IPatternRuleProps,
  RangeRule,
  IRangeRuleProps,
  RequiredRule,
  IRequiredRuleProps,
  SimpleItem,
  ISimpleItemProps,
  StringLengthRule,
  IStringLengthRuleProps,
  Tab,
  ITabProps,
  TabbedItem,
  ITabbedItemProps,
  TabPanelOptions,
  ITabPanelOptionsProps,
  TabPanelOptionsItem,
  ITabPanelOptionsItemProps,
  ValidationRule,
  IValidationRuleProps,
};
export { FormTypes };
