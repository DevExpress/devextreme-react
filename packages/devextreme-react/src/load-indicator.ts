import dxLoadIndicator, {
    Properties
} from "devextreme/ui/load_indicator";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

type ILoadIndicatorOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class LoadIndicator extends BaseComponent<React.PropsWithChildren<ILoadIndicatorOptions>> {

  public get instance(): dxLoadIndicator {
    return this._instance;
  }

  protected _WidgetClass = dxLoadIndicator;

  protected independentEvents = ["onContentReady","onDisposing","onInitialized"];
}
(LoadIndicator as any).propTypes = {
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  indicatorSrc: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};
export default LoadIndicator;
export {
  LoadIndicator,
  ILoadIndicatorOptions
};
import type * as LoadIndicatorTypes from 'devextreme/ui/load_indicator_types';
export { LoadIndicatorTypes };

