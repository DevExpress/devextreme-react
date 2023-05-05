import dxSparkline, {
  Properties,
} from 'devextreme/viz/sparkline';

import * as PropTypes from 'prop-types';

import type { template } from 'devextreme/core/templates/template';

import type * as BaseWidgetTypes from 'devextreme/viz/core/base_widget';
import type * as LocalizationTypes from 'devextreme/localization';
import type * as SparklineTypes from 'devextreme/viz/sparkline_types';
import NestedOption from './core/nested-option';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type ISparklineOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>;

class Sparkline extends BaseComponent<React.PropsWithChildren<ISparklineOptions>> {
  public get instance(): dxSparkline {
    return this._instance;
  }

  protected _WidgetClass = dxSparkline;

  protected independentEvents = ['onDisposing', 'onDrawn', 'onExported', 'onExporting', 'onFileSaving', 'onIncidentOccurred', 'onInitialized', 'onTooltipHidden', 'onTooltipShown'];

  protected _expectedChildren = {
    margin: { optionName: 'margin', isCollectionItem: false },
    size: { optionName: 'size', isCollectionItem: false },
    tooltip: { optionName: 'tooltip', isCollectionItem: false },
  };
}
(Sparkline as any).propTypes = {
  argumentField: PropTypes.string,
  barNegativeColor: PropTypes.string,
  barPositiveColor: PropTypes.string,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  firstLastColor: PropTypes.string,
  ignoreEmptyPoints: PropTypes.bool,
  lineColor: PropTypes.string,
  lineWidth: PropTypes.number,
  lossColor: PropTypes.string,
  margin: PropTypes.object,
  maxColor: PropTypes.string,
  maxValue: PropTypes.number,
  minColor: PropTypes.string,
  minValue: PropTypes.number,
  onDisposing: PropTypes.func,
  onDrawn: PropTypes.func,
  onExported: PropTypes.func,
  onExporting: PropTypes.func,
  onFileSaving: PropTypes.func,
  onIncidentOccurred: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onTooltipHidden: PropTypes.func,
  onTooltipShown: PropTypes.func,
  pathModified: PropTypes.bool,
  pointColor: PropTypes.string,
  pointSize: PropTypes.number,
  pointSymbol: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'circle',
      'cross',
      'polygon',
      'square',
      'triangle',
      'triangleDown',
      'triangleUp']),
  ]),
  rtlEnabled: PropTypes.bool,
  showFirstLast: PropTypes.bool,
  showMinMax: PropTypes.bool,
  size: PropTypes.object,
  theme: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'generic.dark',
      'generic.light',
      'generic.contrast',
      'generic.carmine',
      'generic.darkmoon',
      'generic.darkviolet',
      'generic.greenmist',
      'generic.softblue',
      'material.blue.light',
      'material.lime.light',
      'material.orange.light',
      'material.purple.light',
      'material.teal.light']),
  ]),
  tooltip: PropTypes.object,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'area',
      'bar',
      'line',
      'spline',
      'splinearea',
      'steparea',
      'stepline',
      'winloss']),
  ]),
  valueField: PropTypes.string,
  winColor: PropTypes.string,
  winlossThreshold: PropTypes.number,
};

// owners:
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
  opacity?: number;
  visible?: boolean;
  width?: number;
}>;
class Border extends NestedOption<IBorderProps> {
  public static OptionName = 'border';
}

// owners:
// Tooltip
type IFontProps = React.PropsWithChildren<{
  color?: string;
  family?: string;
  opacity?: number;
  size?: number | string;
  weight?: number;
}>;
class Font extends NestedOption<IFontProps> {
  public static OptionName = 'font';
}

// owners:
// Tooltip
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | any) => string);
  parser?: ((value: string) => number);
  precision?: number;
  type?: 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';
  useCurrencyAccountingStyle?: boolean;
}>;
class Format extends NestedOption<IFormatProps> {
  public static OptionName = 'format';
}

// owners:
// Sparkline
type IMarginProps = React.PropsWithChildren<{
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
}>;
class Margin extends NestedOption<IMarginProps> {
  public static OptionName = 'margin';
}

// owners:
// Tooltip
type IShadowProps = React.PropsWithChildren<{
  blur?: number;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
}>;
class Shadow extends NestedOption<IShadowProps> {
  public static OptionName = 'shadow';
}

// owners:
// Sparkline
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>;
class Size extends NestedOption<ISizeProps> {
  public static OptionName = 'size';
}

// owners:
// Sparkline
type ITooltipProps = React.PropsWithChildren<{
  arrowLength?: number;
  border?: object | {
    color?: string;
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  container?: any | string;
  contentTemplate?: ((pointsInfo: object, element: any) => string) | template;
  cornerRadius?: number;
  customizeTooltip?: ((pointsInfo: object) => object);
  enabled?: boolean;
  font?: BaseWidgetTypes.Font;
  format?: LocalizationTypes.Format;
  interactive?: boolean;
  opacity?: number;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  shadow?: object | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  zIndex?: number;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  contentKeyFn?: (data: any) => string;
}>;
class Tooltip extends NestedOption<ITooltipProps> {
  public static OptionName = 'tooltip';

  public static ExpectedChildren = {
    border: { optionName: 'border', isCollectionItem: false },
    font: { optionName: 'font', isCollectionItem: false },
    format: { optionName: 'format', isCollectionItem: false },
    shadow: { optionName: 'shadow', isCollectionItem: false },
  };

  public static TemplateProps = [{
    tmplOption: 'contentTemplate',
    render: 'contentRender',
    component: 'contentComponent',
    keyFn: 'contentKeyFn',
  }];
}

export default Sparkline;
export {
  Sparkline,
  ISparklineOptions,
  Border,
  IBorderProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  Margin,
  IMarginProps,
  Shadow,
  IShadowProps,
  Size,
  ISizeProps,
  Tooltip,
  ITooltipProps,
};
export { SparklineTypes };
