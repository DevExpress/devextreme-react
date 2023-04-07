import dxDeferRendering, {
    Properties
} from "devextreme/ui/defer_rendering";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { AnimationConfig, AnimationState } from "devextreme/animation/fx";
import type { PositionConfig } from "devextreme/animation/position";

type IDeferRenderingOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class DeferRendering extends BaseComponent<React.PropsWithChildren<IDeferRenderingOptions>> {

  public get instance(): dxDeferRendering {
    return this._instance;
  }

  protected _WidgetClass = dxDeferRendering;

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onRendered","onShown"];

  protected _expectedChildren = {
    animation: { optionName: "animation", isCollectionItem: false }
  };
}
(DeferRendering as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  animation: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string
  ]),
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onRendered: PropTypes.func,
  onShown: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  showLoadIndicator: PropTypes.bool,
  staggerItemSelector: PropTypes.string,
  tabIndex: PropTypes.number,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// DeferRendering
type IAnimationProps = React.PropsWithChildren<{
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
class Animation extends NestedOption<IAnimationProps> {
  public static OptionName = "animation";
  public static ExpectedChildren = {
    from: { optionName: "from", isCollectionItem: false },
    to: { optionName: "to", isCollectionItem: false }
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
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: "fit" | "flip" | "flipfit" | "none";
  y?: "fit" | "flip" | "flipfit" | "none";
}>
class Collision extends NestedOption<ICollisionProps> {
  public static OptionName = "collision";
}

// owners:
// Animation
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
// From
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
  public static ExpectedChildren = {
    at: { optionName: "at", isCollectionItem: false },
    boundaryOffset: { optionName: "boundaryOffset", isCollectionItem: false },
    collision: { optionName: "collision", isCollectionItem: false },
    my: { optionName: "my", isCollectionItem: false },
    offset: { optionName: "offset", isCollectionItem: false }
  };
}

// owners:
// Animation
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

export default DeferRendering;
export {
  DeferRendering,
  IDeferRenderingOptions,
  Animation,
  IAnimationProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Collision,
  ICollisionProps,
  From,
  IFromProps,
  My,
  IMyProps,
  Offset,
  IOffsetProps,
  Position,
  IPositionProps,
  To,
  IToProps
};
import type * as DeferRenderingTypes from 'devextreme/ui/defer_rendering_types';
export { DeferRenderingTypes };

