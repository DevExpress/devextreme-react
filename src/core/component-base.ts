import * as events from "devextreme/events";
import * as React from "react";

import { OptionsManager } from "./options-manager";
import { ITemplateMeta } from "./template";
import TemplatesManager from "./templates-manager";
import { TemplatesRenderer } from "./templates-renderer";
import { TemplatesStore } from "./templates-store";

import { ConfigNode } from "./configuration/config-node";
import { buildOptionsTree } from "./configuration/options-tree";
import { createChildNodes } from "./configuration/react-node";

import { elementPropNames, getClassName } from "./widget-config";
import { WidgetContext } from "./widget-context";

const DX_REMOVE_EVENT = "dxremove";

interface INestedOption {
  optionName: string;
  isCollectionItem: boolean;
}

interface IHtmlOptions {
  id?: string;
  className?: string;
  style?: any;
}

abstract class ComponentBase<P extends IHtmlOptions> extends React.PureComponent<P> {
  protected _WidgetClass: any;
  protected _instance: any;
  protected _element: HTMLDivElement;
  protected _extensions: Array<(element: Element) => void> = [];

  protected readonly _defaults: Record<string, string>;
  protected readonly _templateProps: ITemplateMeta[] = [];
  protected readonly _expectedChildren: Record<string, INestedOption>;

  private _templatesRendererRef: TemplatesRenderer | null;

  private _templatesStore: TemplatesStore;
  private _templatesManager: TemplatesManager;
  private _optionsManager: OptionsManager;

  private _contextValue = {
    registerExtension: (callback: any) => { this._extensions.push(callback); }
  };

  constructor(props: P) {
    super(props);

    this._setTemplatesRendererRef = this._setTemplatesRendererRef.bind(this);

    this._templatesStore = new TemplatesStore(() => {
      if (this._templatesRendererRef) {
        this._templatesRendererRef.scheduleUpdate();
      }
    });
    this._templatesManager = new TemplatesManager(this._templatesStore);
    this._optionsManager = new OptionsManager(this._templatesManager);
  }

  public render() {
    return React.createElement(
      "div",
      this._getElementProps(),
      this.renderChildren(),
      React.createElement(
        TemplatesRenderer,
        {
          templatesStore: this._templatesStore,
          ref: this._setTemplatesRendererRef
        }
      )
    );
  }

  public componentDidMount() {
    this._updateCssClasses(null, this.props);
  }

  public componentDidUpdate(prevProps: P) {
    this._updateCssClasses(prevProps, this.props);

    const config = this._getConfig();
    this._optionsManager.update(config);
  }

  public componentWillUnmount() {
    if (this._instance) {
      events.triggerHandler(this._element, DX_REMOVE_EVENT);
      this._instance.dispose();
    }
    // this._optionsManager.dispose();
  }

  protected _createWidget(element?: Element) {
    element = element || this._element;

    const config = this._getConfig();
    this._instance = new this._WidgetClass(
      element,
      {
        templatesRenderAsynchronously: true,
        ...this._optionsManager.getInitialOptions(config)
      }
    );

    this._optionsManager.setInstance(this._instance, config);
    // this._optionsManager.wrapEventHandlers(options);
    this._instance.on("optionChanged", this._optionsManager.onOptionChanged);
  }

  private renderChildren() {
    return React.createElement(
      WidgetContext.Provider,
      {
        value: this._contextValue
      },
      this.props.children
    );
  }

  private _getConfig(): ConfigNode {
    const config = new ConfigNode(
      {
        name: "",
        isCollection: false,
        templates: this._templateProps,
        initialValueProps: this._defaults,
        predefinedValues: {}
      },
      this.props,
      ""
    );

    createChildNodes(this.props.children).map(
      (childNode) => {
        buildOptionsTree(childNode, config);
      }
    );

    return config;
  }

  private _setTemplatesRendererRef(instance: TemplatesRenderer | null) {
    this._templatesRendererRef = instance;
  }

  private _getElementProps(): Record<string, any> {
    const elementProps: Record<string, any> = {
      ref: (element: HTMLDivElement) => this._element = element
    };

    elementPropNames.forEach((name) => {
      if (name in this.props) {
        elementProps[name] = this.props[name];
      }
    });
    return elementProps;
  }

  private _updateCssClasses(prevProps: P | null, newProps: P) {
    const prevClassName = prevProps ? getClassName(prevProps) : undefined;
    const newClassName = getClassName(newProps);

    if (prevClassName === newClassName) { return; }

    if (prevClassName) {
      const classNames = prevClassName.split(" ").filter((c) => c);
      if (classNames.length) {
        this._element.classList.remove(...classNames);
      }
    }

    if (newClassName) {
      const classNames = newClassName.split(" ").filter((c) => c);
      if (classNames.length) {
        this._element.classList.add(...classNames);
      }
    }
  }
}

export {
  IHtmlOptions,
  ComponentBase,
  DX_REMOVE_EVENT
};
