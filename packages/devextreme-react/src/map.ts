import dxMap, {
    Properties
} from "devextreme/ui/map";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

type IMapOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultCenter?: Array<number> | object | string;
  defaultMarkers?: Array<object>;
  defaultRoutes?: Array<object>;
  defaultZoom?: number;
  onCenterChange?: (value: Array<number> | object | string) => void;
  onMarkersChange?: (value: Array<object>) => void;
  onRoutesChange?: (value: Array<object>) => void;
  onZoomChange?: (value: number) => void;
}>

class Map extends BaseComponent<React.PropsWithChildren<IMapOptions>> {

  public get instance(): dxMap {
    return this._instance;
  }

  protected _WidgetClass = dxMap;

  protected subscribableOptions = ["center","markers","routes","zoom"];

  protected independentEvents = ["onClick","onDisposing","onInitialized","onMarkerAdded","onMarkerRemoved","onReady","onRouteAdded","onRouteRemoved"];

  protected _defaults = {
    defaultCenter: "center",
    defaultMarkers: "markers",
    defaultRoutes: "routes",
    defaultZoom: "zoom"
  };

  protected _expectedChildren = {
    apiKey: { optionName: "apiKey", isCollectionItem: false },
    center: { optionName: "center", isCollectionItem: false },
    marker: { optionName: "markers", isCollectionItem: true },
    route: { optionName: "routes", isCollectionItem: true }
  };
}
(Map as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  apiKey: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  autoAdjust: PropTypes.bool,
  center: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  controls: PropTypes.bool,
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
  markerIconSrc: PropTypes.string,
  markers: PropTypes.array,
  onClick: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onMarkerAdded: PropTypes.func,
  onMarkerRemoved: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onReady: PropTypes.func,
  onRouteAdded: PropTypes.func,
  onRouteRemoved: PropTypes.func,
  provider: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bing",
      "google",
      "googleStatic"])
  ]),
  routes: PropTypes.array,
  rtlEnabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "hybrid",
      "roadmap",
      "satellite"])
  ]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  zoom: PropTypes.number
};


// owners:
// Map
type IApiKeyProps = React.PropsWithChildren<{
  bing?: string;
  google?: string;
  googleStatic?: string;
}>
class ApiKey extends NestedOption<IApiKeyProps> {
  public static OptionName = "apiKey";
}

// owners:
// Map
type ICenterProps = React.PropsWithChildren<{
  lat?: number;
  lng?: number;
}>
class Center extends NestedOption<ICenterProps> {
  public static OptionName = "center";
}

// owners:
// Marker
// Route
type ILocationProps = React.PropsWithChildren<{
  lat?: number;
  lng?: number;
}>
class Location extends NestedOption<ILocationProps> {
  public static OptionName = "location";
}

// owners:
// Map
type IMarkerProps = React.PropsWithChildren<{
  iconSrc?: string;
  location?: Array<number> | object | string | {
    lat?: number;
    lng?: number;
  }[];
  onClick?: (() => void);
  tooltip?: object | string | {
    isShown?: boolean;
    text?: string;
  };
}>
class Marker extends NestedOption<IMarkerProps> {
  public static OptionName = "markers";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    location: { optionName: "location", isCollectionItem: false },
    tooltip: { optionName: "tooltip", isCollectionItem: false }
  };
}

// owners:
// Map
type IRouteProps = React.PropsWithChildren<{
  color?: string;
  locations?: Array<object> | {
    lat?: number;
    lng?: number;
  }[];
  mode?: "driving" | "walking";
  opacity?: number;
  weight?: number;
}>
class Route extends NestedOption<IRouteProps> {
  public static OptionName = "routes";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    location: { optionName: "locations", isCollectionItem: true }
  };
}

// owners:
// Marker
type ITooltipProps = React.PropsWithChildren<{
  isShown?: boolean;
  text?: string;
}>
class Tooltip extends NestedOption<ITooltipProps> {
  public static OptionName = "tooltip";
}

export default Map;
export {
  Map,
  IMapOptions,
  ApiKey,
  IApiKeyProps,
  Center,
  ICenterProps,
  Location,
  ILocationProps,
  Marker,
  IMarkerProps,
  Route,
  IRouteProps,
  Tooltip,
  ITooltipProps
};
import type * as MapTypes from 'devextreme/ui/map_types';
export { MapTypes };

