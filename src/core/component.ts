import * as React from "react";

import * as events from "devextreme/events";

import { addPrefixToKeys, getNestedValue } from "./helpers";
import { createConfigurationComponent } from "./nested-option";
import { OptionCollection } from "./nested-option-collection";
import { ITemplateMeta, Template } from "./template";
import { ITemplateWrapper, wrapTemplate } from "./template-wrapper";
import { separateProps } from "./widget-config";

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
  templates: {};
}

class Component<P> extends React.PureComponent<P, IState> {

  protected _WidgetClass: any;
  protected _instance: any;
  protected readonly _defaults: Record<string, string>;

  protected readonly _templateProps: ITemplateMeta[] = [];
  protected _nestedOptionIdPrefix: string;

  private readonly _guards: Record<string, number> = {};
  private readonly _nestedOptions: OptionCollection = new OptionCollection();

  private _element: any;
  private _updatingProps: boolean;

  constructor(props: P) {
    super(props);
    this._optionChangedHandler = this._optionChangedHandler.bind(this);
    this._prepareProps = this._prepareProps.bind(this);
    this._setTemplatesState = this._setTemplatesState.bind(this);

    this.state = {
      templates: {}
    };
  }

  public componentWillUpdate(nextProps: P) {
    const preparedProps = this._prepareProps(nextProps);
    const options: Record<string, any> = {
      ...preparedProps.options,
      ...this._getIntegrationOptions(preparedProps.templates, preparedProps.nestedTemplates)
    };

    this._processChangedValues(options, this.props);
  }

  public render() {
      const args: any[] = [
        "div",
        { ref: (element: any) => this._element = element }
      ];

      if (!!this.props.children) {
          React.Children.forEach(this.props.children, (c) => {
            args.push(this._registerNestedOption(c as React.ReactElement<any>));
          });
      }

      const templates = Object.getOwnPropertyNames(this.state.templates);
      if (templates.length) {
        templates.forEach((t) => args.push(this.state.templates[t]()));
      }

      return React.createElement.apply(this, args);
  }

  public componentDidMount() {
    const nestedProps = this.getNestedProps();
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

    this._instance = new this._WidgetClass(this._element, options);
    this._instance.on("optionChanged", this._optionChangedHandler);
  }

  public componentWillUnmount() {
    events.triggerHandler(this._element, DX_REMOVE_EVENT);
    this._instance.dispose();
  }

  private _optionChangedHandler(e: { name: string, fullName: string, value: any }) {
    if (this._updatingProps) {
      return;
    }

    const optionName = e.fullName;
    let optionValue = this.props[e.name];

    const nestedOption = this._nestedOptions.get(e.name);
    if (nestedOption && !nestedOption.isCollectionItem) {
        const separatedProps = separateProps(nestedOption.elements[0].props, nestedOption.defaults, []);

        optionValue = getNestedValue(separatedProps.options, e.fullName.split(".").slice(1));
    }

    if (optionValue === undefined || optionValue === null) {
      return;
    }

    if (this._guards[optionName] !== undefined) {
      return;
    }

    const guardId = window.setTimeout(() => {
      this._instance.option(optionName, optionValue);
      window.clearTimeout(guardId);
      delete this._guards[optionName];
    });

    this._guards[optionName] = guardId;
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

    const nestedTemplates: Record<string, any> = {};
    if (rawProps.children) {
        React.Children.forEach(rawProps.children, (child: React.ReactElement<any>) => {
            if (child.type !== Template) {
                return;
            }

            nestedTemplates[child.props.name] = {
                render: child.props.render,
                component: child.props.component
            };
        });
    }

    return {
        ...separatedProps,
        options,
        nestedTemplates
    };
  }

  private _processChangedValues(newProps: Record<string, any>, prevProps: Record<string, any>): void {
    this._updatingProps = false;

    for (const optionName of Object.keys(newProps)) {
      if (newProps[optionName] !== prevProps[optionName]) {
        if (this._guards[optionName]) {
          window.clearTimeout(this._guards[optionName]);
          delete this._guards[optionName];
        }

        if (!this._updatingProps) {
          this._instance.beginUpdate();
          this._updatingProps = true;
        }
        this._instance.option(optionName, newProps[optionName]);
      }
    }

    if (this._updatingProps) {
      this._updatingProps = false;
      this._instance.endUpdate();
    }
  }

  private _getIntegrationOptions(options: Record<string, any>, nestedOptions: Record<string, any>): any {
    const templates: Record<string, ITemplateWrapper> = {};
    const result = {
      integrationOptions: {
        templates
      }
    };

    this._templateProps.forEach((m) => {
      if (options[m.component] || options[m.render]) {
        result[m.tmplOption] = m.tmplOption;
        templates[m.tmplOption] = this._getTemplate(options[m.component], options[m.render]);
      }
    });

    Object.keys(nestedOptions).forEach((name) => {
        templates[name] = this._getTemplate(nestedOptions[name].component, nestedOptions[name].render);
    });

    if (Object.keys(templates).length > 0) {
      return result;
    }
  }

  private _getTemplate(component: any, render: any): ITemplateWrapper {
    const templateProp = !!component
      ? React.createElement.bind(this, component)
      : render.bind(this);

    return wrapTemplate(templateProp, this._setTemplatesState);
  }

  private _setTemplatesState(callback: (templates: Record<string, any>) => void) {
    this.setState((state: IState) => {
      const templates = { ...state.templates };
      callback(templates);
      return {
        templates
      };
    });
  }

  private _registerNestedOption(component: React.ReactElement<any>): any {
    const configComponent = component as any as INestedOption;
    if (
      configComponent && configComponent.type &&
      configComponent.type.OptionName &&
      configComponent.type.OwnerType && this instanceof configComponent.type.OwnerType
    ) {
      const optionName = configComponent.type.OptionName;

      this._nestedOptions.add(
          optionName,
          component,
          configComponent.type.DefaultsProps,
          configComponent.type.IsCollectionItem
      );

      return createConfigurationComponent(
        component,
        (newProps, prevProps) => {
          const newOptions = separateProps(newProps, configComponent.type.DefaultsProps, []).options;
          this._updateNested(optionName, newOptions, prevProps);
        }
      );
    }

    return component;
  }

  private _updateNested(
    optionName: string,
    newProps: Record<string, any>,
    prevProps: Record<string, any>
  ): void {
    this._processChangedValues(
      addPrefixToKeys(newProps, optionName + "."),
      addPrefixToKeys(prevProps, optionName + ".")
    );
  }

  private _wrapEventHandler(optionValue: any, optionName: string): any {
    if (optionName.substr(0, 2) === "on" && typeof optionValue === "function") {
      return (...args: any[]) => {
        if (!this._updatingProps) {
          optionValue(...args);
        }
      };
    }

    return optionValue;
  }

  private getNestedProps(): Record<string, any> {

    const nestedOptions: Record<string, any> = {};

    this._nestedOptions.forEach((o) => {
        const options = o.elements.map((e) => {
            const props = separateProps(e.props, o.defaults, []);
            return {
                ...props.defaults,
                ...props.options
            };
        });

        if (o.isCollectionItem) {
            nestedOptions[o.name] = options;
        } else {
            nestedOptions[o.name] = options[options.length - 1];
        }
    });

    return nestedOptions;
  }
}

export default Component;
export { IState, ITemplateMeta };
