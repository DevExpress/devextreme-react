import dxScrollView, {
  Properties,
} from 'devextreme/ui/scroll_view';

import * as PropTypes from 'prop-types';
import type * as ScrollViewTypes from 'devextreme/ui/scroll_view_types';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type IScrollViewOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>;

class ScrollView extends BaseComponent<React.PropsWithChildren<IScrollViewOptions>> {
  public get instance(): dxScrollView {
    return this._instance;
  }

  protected _WidgetClass = dxScrollView;

  protected independentEvents = ['onDisposing', 'onInitialized', 'onPullDown', 'onReachBottom', 'onScroll', 'onUpdated'];
}
(ScrollView as any).propTypes = {
  bounceEnabled: PropTypes.bool,
  direction: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'both',
      'horizontal',
      'vertical']),
  ]),
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onPullDown: PropTypes.func,
  onReachBottom: PropTypes.func,
  onScroll: PropTypes.func,
  onUpdated: PropTypes.func,
  pulledDownText: PropTypes.string,
  pullingDownText: PropTypes.string,
  reachBottomText: PropTypes.string,
  refreshingText: PropTypes.string,
  rtlEnabled: PropTypes.bool,
  scrollByContent: PropTypes.bool,
  scrollByThumb: PropTypes.bool,
  showScrollbar: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'onScroll',
      'onHover',
      'always',
      'never']),
  ]),
  useNative: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
};
export default ScrollView;
export {
  ScrollView,
  IScrollViewOptions,
};
export { ScrollViewTypes };
