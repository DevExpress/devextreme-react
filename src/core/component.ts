import * as events from "devextreme/events";
import * as React from "react";

import { createConfigurationComponent } from "./nested-option";
import OptionsManager from "./options-manager";
import { separateProps } from "./widget-config";

import {
  ITemplateMeta,
  Template
} from "./template";

import {
  IDxTemplate,
  ITemplateInfo,
  IWrappedTemplateInfo,
  TemplateHelper
} from "./template-helper";

import {
  addPrefixToKeys
} from "./helpers";

const DX_REMOVE_EVENT = "dxremove";

interface INestedOption {
  type: {
    IsCollectionItem: boolean;
    OwnerType: any;
    OptionName: string;
    DefaultsProps: Record<string, string>;
  };
  props: object;
}

interface IWidgetConfig {
    defaults: Record<string, any>;
    options: Record<string, any>;
    templates: Record<string, any>;
    nestedTemplates: Record<string, any>;
}

interface IState {
  templates: Record<string, IWrappedTemplateInfo>;
}

abstract class ComponentBase<P> extends React.PureComponent<P, IState> {
  protected _WidgetClass: any;
  protected _instance: any;
  protected _element: any;

  protected readonly _defaults: Record<string, string>;

  protected readonly _templateProps: ITemplateMeta[] = [];

  private readonly _templateHelper: TemplateHelper;
  private readonly _optionsManager: OptionsManager;

  constructor(props: P) {
    super(props);
    this._prepareProps = this._prepareProps.bind(this);

    this.state = {
      templates: {}
    };

    this._optionsManager = new OptionsManager((name) => this.props[name]);
    this._templateHelper = new TemplateHelper(this);
  }

  public componentWillUpdate(nextProps: P) {
    const preparedProps = this._prepareProps(nextProps);
    const options: Record<string, any> = {
      ...preparedProps.options,
      ...this._getIntegrationOptions(preparedProps.templates, preparedProps.nestedTemplates)
    };

    this._optionsManager.processChangedValues(options, this.props);
  }

  public render() {
      const args: any[] = [
        "div",
        { ref: (element: any) => this._element = element }
      ];

      let nestedTemplates: Record<string, any> = {};
      if (!!this.props.children) {
          React.Children.forEach(this.props.children, (child: React.ReactElement<any>) => {
            nestedTemplates = {
              ...nestedTemplates,
              ...this.findNestedTemplate(child)
            };
            args.push(this._preprocessChild(child) || child);
          });
      }

      const templates = Object.getOwnPropertyNames(this.state.templates);
      if (templates.length) {
        templates.forEach((t) => {
          const templateDto = this.state.templates[t];
          const targetProps: Record<string, any> = templateDto.isNested
            ? nestedTemplates[templateDto.name]
            : this.props;
          args.push(templateDto.createWrapper(
            this._templateHelper.getContentProvider(targetProps[templateDto.prop], templateDto.isComponent)
          ));
        });
      }

      return React.createElement.apply(this, args);
  }

  public componentWillUnmount() {
    if (this._instance) {
      events.triggerHandler(this._element, DX_REMOVE_EVENT);
      this._instance.dispose();
    }
  }

  protected abstract _preprocessChild(component: React.ReactElement<any>): React.ReactElement<any>;

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
      ...this._getIntegrationOptions(preparedProps.templates, preparedProps.nestedTemplates)
    };

    this._instance = new this._WidgetClass(element, options);
    this._optionsManager.setInstance(this._instance);
    this._instance.on("optionChanged", this._optionsManager.handleOptionChange);
  }

  protected _registerNestedOption(component: React.ReactElement<any>): any {
    const configComponent = component as any as INestedOption;
    if (
      configComponent && configComponent.type &&
      configComponent.type.OptionName &&
      configComponent.type.OwnerType && this instanceof configComponent.type.OwnerType
    ) {
      const optionName = configComponent.type.OptionName;

      this._optionsManager.addNestedOption(
          optionName,
          component,
          configComponent.type.DefaultsProps,
          configComponent.type.IsCollectionItem
      );

      return createConfigurationComponent(
        component,
        (newProps, prevProps) => {
          const newOptions = separateProps(newProps, configComponent.type.DefaultsProps, []).options;
          this._optionsManager.processChangedValues(
            addPrefixToKeys(newOptions, optionName + "."),
            addPrefixToKeys(prevProps, optionName + ".")
          );
        }
      );
    }

    return null;
  }

  private _prepareProps(rawProps: Record<string, any>): IWidgetConfig {
    const separatedProps = separateProps(rawProps, this._defaults, this._templateProps);
    let options = separatedProps.options;

    if (separatedProps.options) {
        options = {};
        Object.keys(separatedProps.options).forEach((key) => {
            options[key] = this._wrapEventHandler(separatedProps.options[key], key);
        });
    }

    let nestedTemplates: Record<string, any> = {};
    if (rawProps.children) {
        React.Children.forEach(rawProps.children, (child: React.ReactElement<any>) => {
            nestedTemplates = {
              ...nestedTemplates,
              ...this.findNestedTemplate(child)
            };
        });
    }

    return {
        ...separatedProps,
        options,
        nestedTemplates
    };
  }

  private findNestedTemplate(child: React.ReactElement<any>): Record<string, { render: any, component: any }> {
    if (child.type !== Template) {
        return {};
    }
    const result: Record<string, any> = {};

    result[child.props.name] = {
        render: child.props.render,
        component: child.props.component
    };

    return result;
  }

  private _wrapEventHandler(optionValue: any, optionName: string): any {
      if (optionName.substr(0, 2) === "on" && typeof optionValue === "function") {
          return (...args: any[]) => {
              if (!this._optionsManager.updatingProps) {
                  optionValue(...args);
              }
          };
      }

      return optionValue;
  }

  private _getIntegrationOptions(options: Record<string, any>, nestedOptions: Record<string, any>): any {
    const templates: Record<string, IDxTemplate> = {};
    const result = {
      integrationOptions: {
        templates
      }
    };

    this._templateProps.forEach((m) => {
      if (options[m.component] || options[m.render]) {
        const templateInfo: ITemplateInfo = {
          name: m.tmplOption,
          prop: options[m.component] ? m.component : m.render,
          isComponent: !!options[m.component],
          isNested: false
        };
        result[m.tmplOption] = m.tmplOption;
        templates[m.tmplOption] = this._templateHelper.wrapTemplate(templateInfo);
      }
    });

    Object.keys(nestedOptions).forEach((name) => {
        const templateInfo: ITemplateInfo = {
          name,
          prop: !!nestedOptions[name].component ? "component" : "render",
          isComponent: !!nestedOptions[name].component,
          isNested: true
        };
        templates[name] = this._templateHelper.wrapTemplate(templateInfo);
    });

    if (Object.keys(templates).length > 0) {
      return result;
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
class Component<P> extends ComponentBase<P> {
  private readonly _extensions: Array<(element: Element) => void> = [];

  public componentDidMount() {
    this._createWidget();
    this._extensions.forEach((extension) => extension.call(this, this._element));
  }

  protected _preprocessChild(component: React.ReactElement<any>) {
    return this._registerExtension(component) || this._registerNestedOption(component) || component;
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

  protected _preprocessChild(component: React.ReactElement<any>) {
    return component;
  }
}

export {
  IState,
  ComponentBase,
  Component,
  ExtensionComponent
};
