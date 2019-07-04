import * as React from "react";

import { deferUpdate } from "devextreme/core/utils/common";
import { IOptionNodeDescriptor } from "./configuration/node";
import { IntegrationManager } from "./integration-manager";
import { INestedOption } from "./options-manager";
import { ITemplateMeta } from "./template";
import { TemplatesRenderer } from "./templates-renderer";
import { elementPropNames, getClassName } from "./widget-config";

const DX_REMOVE_EVENT = "dxremove";

interface IHtmlOptions {
  id?: string;
  className?: string;
  style?: any;
}

abstract class ComponentBase<P extends IHtmlOptions> extends React.PureComponent<P> {
  protected _WidgetClass: any;
  protected _instance: any;
  protected _element: HTMLDivElement;

  protected readonly _defaults: Record<string, string>;
  protected readonly _templateProps: ITemplateMeta[] = [];
  protected readonly _expectedChildren: Record<string, INestedOption>;

  private _updateScheduled: boolean = false;

  private _integrationManager: IntegrationManager;
  private _templatesRendererRef: TemplatesRenderer | null;

  constructor(props: P) {
    super(props);

    this.scheduleUpdate = this.scheduleUpdate.bind(this);
    this._setTemplatesRendererRef = this._setTemplatesRendererRef.bind(this);
    this._integrationManager = new IntegrationManager(this);
  }

  public get descriptor(): IOptionNodeDescriptor {
    return {
      name: "",
      isCollection: false,
      templates: this._templateProps,
      initialValueProps: this._defaults,
      predefinedValues: {}
    };
  }

  public get templatesRenderer() {
    return this._templatesRendererRef;
  }

  public get widgetClass(): any {
    return this._WidgetClass;
  }

  public render() {
    return React.createElement(
      "div",
      this._getElementProps(),
      this.props.children,
      React.createElement(
        TemplatesRenderer,
        {
          templatesStore: this._integrationManager.templatesStore,
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
    this._integrationManager.updateOptions();
  }

  public componentWillUnmount() {
    // if (this._instance) {
    //   events.triggerHandler(this._element, DX_REMOVE_EVENT);
    //   this._instance.dispose();
    // }
    // this._optionsManager.dispose();
  }

  // DO WE NEED THIS?
  public scheduleUpdate() {
    if (this._updateScheduled) {
      return;
    }

    this._updateScheduled = true;

    deferUpdate(() => {
      this.forceUpdate();
      this._updateScheduled = false;
    });
  }

  protected _createWidget(element?: Element) {
    this._integrationManager.createWidget(this._element);

    // this._optionsManager.wrapEventHandlers(options);
    // this._instance.on("optionChanged", this._optionsManager.handleOptionChange);
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
