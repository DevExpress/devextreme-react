import * as React from "react";

import * as events from "devextreme/events";

import { addPrefixToKeys, getNestedValue } from "./helpers";
import { createConfigurationComponent } from "./nested-option";
import { splitProps } from "./props-preprocessor";
import { ITemplateMeta } from "./template";
import { ITemplateWrapper, wrapTemplate } from "./template-wrapper";

const DX_REMOVE_EVENT = "dxremove";

interface IChildComponent {
  type: {
    IsCollectionItem: boolean;
    OwnerType: any;
    OptionName: string;
    DefaultsProps: Record<string, string>;
  };
  props: object;
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
        if (Array.isArray(this.props.children)) {
          this.props.children.forEach((c) => args.push(this.wrapConfigComponent(c)));
        } else {
          args.push(this.wrapConfigComponent(this.props.children));
        }
      }

      const templates = Object.getOwnPropertyNames(this.state.templates);
      if (templates.length) {
        templates.forEach((t) => args.push(this.state.templates[t]()));
      }

      return React.createElement.apply(this, args);
  }

  public componentDidMount() {
    const props = this.getActualProps({ includeDefaults: true });

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

  private _optionChangedHandler(e: { fullName: string, value: any }) {
    if (this._updatingProps) {
      return;
    }

    const optionName = e.fullName;
    const optionValue = getNestedValue(this.getActualProps({ includeDefaults: false }), optionName.split("."));

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

  private _prepareProps(rawProps: Record<string, any>): {
    defaults: Record<string, any>,
    options: Record<string, any>,
    templates: Record<string, any>,
    nestedTemplates: Record<string, any>
  } {
    const props = splitProps(rawProps, this._defaults, this._templateProps);
    const options = props.options;
    props.options = {};

    if (options) {
      Object.keys(options).forEach((key) => {
        props.options[key] = this._wrapEventHandler(options[key], key);
      });
    }

    return props;
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

  private wrapConfigComponent(component: any): any {
    const configComponent = component as IChildComponent;
    if (
      configComponent && configComponent.type &&
      configComponent.type.OptionName &&
      configComponent.type.OwnerType && this instanceof configComponent.type.OwnerType
    ) {
      const optionName = configComponent.type.OptionName;
      return createConfigurationComponent(
        component,
        (newProps, prevProps) => {
          const newOptions = splitProps(newProps, configComponent.type.DefaultsProps, []).options;
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

  private getActualProps(options: {
    includeDefaults: boolean
  }): Record<string, any> {

    const nestedOptions: Record<string, any> = {};
    const children: any = this.props.children;
    if (!!children) {

      const nested: IChildComponent[] = Array.isArray(children)
        ? children as IChildComponent[]
        : [children as IChildComponent];

      nested.forEach((child) => {
        if (child && child.type && child.type.OwnerType && this instanceof child.type.OwnerType) {

          const props = splitProps(child.props, child.type.DefaultsProps, []);
          const childOptions = {
            ...(options.includeDefaults ? props.defaults : undefined),
            ...props.options
          };

          if (child.type.IsCollectionItem) {

            if (nestedOptions[child.type.OptionName] === null || nestedOptions[child.type.OptionName] === undefined) {
              nestedOptions[child.type.OptionName] = [];
            }

            nestedOptions[child.type.OptionName].push(childOptions);
          } else {
            nestedOptions[child.type.OptionName] = childOptions;
          }
        }
      });
    }

    return {
      ...(this.props as Record<string, any>),
      ...nestedOptions
    };
  }
}

export default Component;
export { IState, ITemplateMeta };
