import * as events from "devextreme/events";
import * as React from "react";

import OptionsManager, { INestedOption } from "./options-manager";
import { findProps as findNestedTemplateProps, ITemplateMeta } from "./template";
import { elementPropNames, getClassName, separateProps } from "./widget-config";

import TemplateHost from "./template-host";

const DX_REMOVE_EVENT = "dxremove";

interface IWidgetConfig {
    defaults: Record<string, any>;
    options: Record<string, any>;
}

interface IState {
  templates: Record<string, () => void>;
}

interface IHtmlOptions {
  id?: string;
  className?: string;
  style?: any;
}

abstract class ComponentBase<P extends IHtmlOptions> extends React.PureComponent<P, IState> {
  protected _WidgetClass: any;
  protected _instance: any;
  protected _element: HTMLDivElement;

  protected readonly _defaults: Record<string, string>;
  protected readonly _templateProps: ITemplateMeta[] = [];
  protected readonly _expectedChildren: Record<string, INestedOption>;

  private _templateCallbacks: any[] = [];
  private _templateTimeout: any;

  private readonly _templateHost: TemplateHost;
  private readonly _optionsManager: OptionsManager;

  constructor(props: P) {
    super(props);
    this._prepareProps = this._prepareProps.bind(this);
    this._updateTemplatesState = this._updateTemplatesState.bind(this);

    this.state = {
      templates: {}
    };

    this._templateHost = new TemplateHost(this._updateTemplatesState);
    this._optionsManager = new OptionsManager((name) => this.props[name], this._templateHost);
  }

  public render() {
    return React.createElement("div", this._getElementProps(), ...this._prepareChildren());
  }

  public componentDidMount() {
    this._updateCssClasses(null, this.props);
  }

  public componentDidUpdate(prevProps: P) {
    this._updateCssClasses(prevProps, this.props);

    const preparedProps = this._prepareProps(this.props);
    const options: Record<string, any> = {
      ...preparedProps.options,
      ...this._templateHost.options
    };

    this._optionsManager.processChangedValues(options, prevProps);
  }

  public componentWillUnmount() {
    this._clearTemplates();
    if (this._instance) {
      events.triggerHandler(this._element, DX_REMOVE_EVENT);
      this._instance.dispose();
    }
  }

  protected _prepareChildren(args: any[] = []): any[] {
    this._optionsManager.resetNestedElements();

    React.Children.forEach(this.props.children, (child: React.ReactElement<any>) => {
      args.push(this._preprocessChild(child) || child);
    });

    const templates = Object.getOwnPropertyNames(this.state.templates) || [];

    templates.forEach((t) => {
      args.push(this.state.templates[t]());
    });

    return args;
  }

  protected _preprocessChild(component: React.ReactElement<any>): React.ReactElement<any> {
    const nestedTemplate = findNestedTemplateProps(component);
    if (nestedTemplate) {
      this._templateHost.addNested(nestedTemplate);
    }
    return this._optionsManager.registerNestedOption(component, this._expectedChildren) || component;
  }

  protected _createWidget(element?: Element) {
    element = element || this._element;
    const nestedProps = this._optionsManager.getNestedOptionsObjects();
    const props = {
        ...(this.props as any),
        ...nestedProps
    };

    const preparedProps = this._prepareProps(props);

    const options: Record<string, any> = {
      templatesRenderAsynchronously: true,
      ...preparedProps.defaults,
      ...preparedProps.options,
      ...this._templateHost.options
    };

    this._optionsManager.wrapEventHandlers(options);

    this._instance = new this._WidgetClass(element, options);
    this._optionsManager.setInstance(this._instance);
    this._instance.on("optionChanged", this._optionsManager.handleOptionChange);
  }

  private _updateTemplatesState(callback: any) {
    if (!this._templateTimeout) {
      this._templateCallbacks.push(callback);
      this._templateTimeout = setTimeout(() => {
        this.setState((state: IState) => {
            const templates = { ...state.templates };
            for (const cb of this._templateCallbacks) {
              cb(templates);
            }
            this._clearTemplates();
            return {
                templates
            };
        });
      });
    } else {
      this._templateCallbacks.push(callback);
    }
  }

  private _clearTemplates() {
    this._templateCallbacks.length = 0;
    if (this._templateTimeout) {
      clearTimeout(this._templateTimeout);
      this._templateTimeout = undefined;
    }
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

  private _prepareProps(rawProps: Record<string, any>): IWidgetConfig {
    const separatedProps = separateProps(rawProps, this._defaults, this._templateProps);

    this._templateHost.add({
      useChildren: () => false,
      ownerName: "",
      templateProps: this._templateProps,
      props: separatedProps.templates,
      propsGetter: (prop) => this.props[prop]
    });

    return {
        options: separatedProps.options,
        defaults: separatedProps.defaults
    };
  }
}

export {
  IState,
  IHtmlOptions,
  ComponentBase
};
