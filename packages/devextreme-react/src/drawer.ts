import dxDrawer, {
  Properties,
} from 'devextreme/ui/drawer';

import * as PropTypes from 'prop-types';
import type * as DrawerTypes from 'devextreme/ui/drawer_types';
import { Component as BaseComponent, IHtmlOptions } from './core/component';

type IDrawerOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
  defaultOpened?: boolean;
  onOpenedChange?: (value: boolean) => void;
}>;

class Drawer extends BaseComponent<React.PropsWithChildren<IDrawerOptions>> {
  public get instance(): dxDrawer {
    return this._instance;
  }

  protected _WidgetClass = dxDrawer;

  protected subscribableOptions = ['opened'];

  protected independentEvents = ['onDisposing', 'onInitialized'];

  protected _defaults = {
    defaultOpened: 'opened',
  };

  protected _templateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];
}
(Drawer as any).propTypes = {
  activeStateEnabled: PropTypes.bool,
  animationDuration: PropTypes.number,
  animationEnabled: PropTypes.bool,
  closeOnOutsideClick: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  opened: PropTypes.bool,
  openedStateMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'overlap',
      'shrink',
      'push']),
  ]),
  position: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'left',
      'right',
      'top',
      'bottom',
      'before',
      'after']),
  ]),
  revealMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'slide',
      'expand']),
  ]),
  rtlEnabled: PropTypes.bool,
  shading: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]),
};
export default Drawer;
export {
  Drawer,
  IDrawerOptions,
};
export { DrawerTypes };
