import * as events from "devextreme/events";
import * as React from "react";

import OptionsManager from "./options-manager";
import { findProps as findNestedTemplateProps, ITemplateMeta } from "./template";
import { elementPropNames, separateProps } from "./widget-config";

import {
  getTemplateOptions,
  TemplateGetter
} from "./template-helper";

const DX_REMOVE_EVENT = "dxremove";

interface IWidgetConfig {
    defaults: Record<string, any>;
    options: Record<string, any>;
    integrationOptions: Record<string, any>;
}

interface IState {
  templates: Record<string, TemplateGetter>;
}

interface IHtmlOptions {
  id?: string;
  className?: string;
  style?: any;
}

abstract class ComponentBase<P extends IHtmlOptions> extends React.PureComponent<P, IState> {
  protected _WidgetClass: any;
  protected _instance: any;
  protected _element: any;

  protected readonly _defaults: Record<string, string>;

  protected readonly _templateProps: ITemplateMeta[] = [];

  private readonly _optionsManager: OptionsManager;

  constructor(props: P) {
    super(props);
    this._prepareProps = this._prepareProps.bind(this);
    this._updateTemplatesState = this._updateTemplatesState.bind(this);

    this.state = {
      templates: {}
    };

    this._optionsManager = new OptionsManager((name) => this.props[name]);
  }

  public componentWillUpdate(nextProps: P) {
    const preparedProps = this._prepareProps(nextProps);
    const options: Record<string, any> = {
      ...preparedProps.options,
      ...preparedProps.integrationOptions
    };

    this._optionsManager.processChangedValues(options, this.props);
  }

  public render() {
      const elementProps = { ref: (element: any) => this._element = element };
      elementPropNames.forEach((name) => {
        if (name in this.props) {
          elementProps[name] = this.props[name];
        }
      });
      const args: any[] = [
        "div",
        elementProps
      ];
      this._optionsManager.resetNestedElements();
      let nestedTemplates: Record<string, any> = {};
      React.Children.forEach(this.props.children, (child: React.ReactElement<any>) => {
        nestedTemplates = {
          ...nestedTemplates,
          ...findNestedTemplateProps(child)
        };
        args.push(this._preprocessChild(child) || child);
      });

      const templates = Object.getOwnPropertyNames(this.state.templates) || [];

      templates.forEach((t) => {
        args.push(this.state.templates[t](nestedTemplates));
      });

      return React.createElement.apply(this, args);
  }

  public componentWillUnmount() {
    if (this._instance) {
      events.triggerHandler(this._element, DX_REMOVE_EVENT);
      this._instance.dispose();
    }
  }

  protected _preprocessChild(component: React.ReactElement<any>): React.ReactElement<any> {
    return this._optionsManager.registerNestedOption(component, this) || component;
  }

  protected _createWidget(element?: Element) {
    element = element || this._element;
    const nestedProps = this._optionsManager.getNestedOptionsObjects(this._updateTemplatesState);
    const props = {
        ...(this.props as any),
        ...nestedProps
    };

    const preparedProps = this._prepareProps(props);

    const options: Record<string, any> = {
      templatesRenderAsynchronously: true,
      ...preparedProps.defaults,
      ...preparedProps.options,
      ...preparedProps.integrationOptions
    };

    this._instance = new this._WidgetClass(element, options);
    this._optionsManager.setInstance(this._instance);
    this._instance.on("optionChanged", this._optionsManager.handleOptionChange);
  }

  private _updateTemplatesState(callback) {
    this.setState((state: IState) => {
        const templates = { ...state.templates };
        callback(templates);
        return {
            templates
        };
    });
  }

  private _prepareProps(rawProps: Record<string, any>): IWidgetConfig {
    const separatedProps = separateProps(rawProps, this._defaults, this._templateProps);

    const options: Record<string, any> = {};
    Object.keys(separatedProps.options).forEach((key) => {
        options[key] = this._optionsManager.wrapEventHandler(separatedProps.options[key], key);
    });

    const templateOptions = getTemplateOptions({
      templateProps: this._templateProps,
      options: separatedProps.templates,
      nestedOptions: getNestedTemplates(rawProps),
      stateUpdater: this._updateTemplatesState,
      propsGetter: (prop) => this.props[prop]
    });

    const integrationOptions = Object.keys(templateOptions.templates).length ? {
      integrationOptions: {
        templates: templateOptions.templates
      },
      ...templateOptions.templateStubs
    } : undefined;

    return {
        options,
        defaults: separatedProps.defaults,
        integrationOptions
    };
  }
}

function getNestedTemplates(rawProps: Record<string, any>): Record<string, any> {
  let nestedTemplates: Record<string, any> = {};
  React.Children.forEach(rawProps.children, (child: React.ReactElement<any>) => {
      nestedTemplates = {
        ...nestedTemplates,
        ...findNestedTemplateProps(child)
      };
  });

  return nestedTemplates;
}

// tslint:disable-next-line:max-classes-per-file
class Component<P extends IHtmlOptions> extends ComponentBase<P> {
  private readonly _extensions: Array<(element: Element) => void> = [];

  public componentDidMount() {
    this._createWidget();
    this._extensions.forEach((extension) => extension.call(this, this._element));
  }

  protected _preprocessChild(component: React.ReactElement<any>) {
    return this._registerExtension(component) || super._preprocessChild(component);
  }

  private _registerExtension(component: React.ReactElement<any>) {
    if (!ExtensionComponent.isPrototypeOf(component.type)) {
      return null;
    }

    return React.cloneElement(component, {
      onMounted: (callback: any) => {
        this._extensions.push(callback);
      }
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class ExtensionComponent<P> extends ComponentBase<P> {
  public componentDidMount() {
    const onMounted = (this.props as Record<string, any>).onMounted;
    if (onMounted) {
      onMounted((element) => {
        this._createWidget(element);
      });
    }
  }
}

export {
  IState,
  IHtmlOptions,
  ComponentBase,
  Component,
  ExtensionComponent
};
