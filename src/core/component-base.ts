import * as events from "devextreme/events";

import * as React from "react";

import { deferUpdate } from "devextreme/core/utils/common";
import OptionsManager, { INestedOption } from "./options-manager";
import { findProps as findNestedTemplateProps, ITemplateMeta } from "./template";
import TemplatesManager from "./templates-manager";
import { ITemplatesStore, TemplatesStore } from "./templates-store";
import { elementPropNames, getClassName, separateProps } from "./widget-config";

const DX_REMOVE_EVENT = "dxremove";

interface IWidgetConfig {
    defaults: Record<string, any>;
    options: Record<string, any>;
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

  protected readonly _defaults: Record<string, string>;
  protected readonly _templateProps: ITemplateMeta[] = [];
  protected readonly _expectedChildren: Record<string, INestedOption>;

  private readonly _templatesManager: TemplatesManager;
  private readonly _templatesStore: ITemplatesStore;
  private readonly _optionsManager: OptionsManager;
  private _updateScheduled: boolean = false;

  constructor(props: P) {
    super(props);
    this._prepareProps = this._prepareProps.bind(this);
    this._scheduleUpdate = this._scheduleUpdate.bind(this);

    this._templatesStore = new TemplatesStore(this._scheduleUpdate);
    this._templatesManager = new TemplatesManager(this._templatesStore);
    this._optionsManager = new OptionsManager((name) => this.props[name], this._templatesManager);
  }

  public render() {
    return React.createElement(
      "div",
      this._getElementProps(),
      ...this._prepareChildren(),
      ...this._templatesStore.listWrappers()
    );
  }

  public componentDidMount() {
    this._updateCssClasses(null, this.props);
  }

  public componentDidUpdate(prevProps: P) {
    this._updateCssClasses(prevProps, this.props);

    const preparedProps = this._prepareProps(this.props);
    const options: Record<string, any> = {
      ...preparedProps.options,
      ...this._templatesManager.options
    };
    this._optionsManager.processChangedValues(options, prevProps);
  }

  public componentWillUnmount() {
    if (this._instance) {
      events.triggerHandler(this._element, DX_REMOVE_EVENT);
      this._instance.dispose();
    }
    this._optionsManager.dispose();
  }

  protected _prepareChildren(args: any[] = []): any[] {
    this._optionsManager.resetNestedElements();

    React.Children.forEach(this.props.children, (child: React.ReactElement<any>) => {
      if (child) {
        args.push(this._preprocessChild(child) || child);
      }
    });

    return args;
  }

  protected _preprocessChild(component: React.ReactElement<any>): React.ReactElement<any> {
    const nestedTemplate = findNestedTemplateProps(component);
    if (nestedTemplate) {
      this._templatesManager.addNested(nestedTemplate);
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
      ...this._templatesManager.options
    };

    this._optionsManager.wrapEventHandlers(options);

    this._instance = new this._WidgetClass(element, options);
    this._optionsManager.setInstance(this._instance);
    this._instance.on("optionChanged", this._optionsManager.handleOptionChange);
  }

  private _scheduleUpdate() {
    if (this._updateScheduled) {
      return;
    }

    this._updateScheduled = true;

    deferUpdate(() => {
      this.forceUpdate();
      this._updateScheduled = false;
    });
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

    this._templatesManager.add({
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
  IHtmlOptions,
  ComponentBase,
  DX_REMOVE_EVENT
};
