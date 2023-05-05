import dxValidationSummary, {
  Properties,
} from 'devextreme/ui/validation_summary';

import * as PropTypes from 'prop-types';

import type { CollectionWidgetItem } from 'devextreme/ui/collection/ui.collection_widget.base';
import type { template } from 'devextreme/core/templates/template';
import type * as ValidationSummaryTypes from 'devextreme/ui/validation_summary_types';
import NestedOption from './core/nested-option';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

export { ExplicitTypes } from 'devextreme/ui/validation_summary';

type IValidationSummaryOptions<TItem = any, TKey = any> = React.PropsWithChildren<Properties<TItem, TKey> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>['dataSource'];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<any | CollectionWidgetItem | string>;
  onItemsChange?: (value: Array<any | CollectionWidgetItem | string>) => void;
}>;

class ValidationSummary<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<IValidationSummaryOptions<TItem, TKey>>> {
  public get instance(): dxValidationSummary<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxValidationSummary;

  protected subscribableOptions = ['items'];

  protected independentEvents = ['onContentReady', 'onDisposing', 'onInitialized', 'onItemClick'];

  protected _defaults = {
    defaultItems: 'items',
  };

  protected _expectedChildren = {
    item: { optionName: 'items', isCollectionItem: true },
  };

  protected _templateProps = [{
    tmplOption: 'itemTemplate',
    render: 'itemRender',
    component: 'itemComponent',
    keyFn: 'itemKeyFn',
  }];
}
(ValidationSummary as any).propTypes = {
  elementAttr: PropTypes.object,
  hoverStateEnabled: PropTypes.bool,
  items: PropTypes.array,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onOptionChanged: PropTypes.func,
  validationGroup: PropTypes.string,
};

// owners:
// ValidationSummary
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  html?: string;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>;
class Item extends NestedOption<IItemProps> {
  public static OptionName = 'items';

  public static IsCollectionItem = true;

  public static TemplateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];
}

export default ValidationSummary;
export {
  ValidationSummary,
  IValidationSummaryOptions,
  Item,
  IItemProps,
};
export { ValidationSummaryTypes };
