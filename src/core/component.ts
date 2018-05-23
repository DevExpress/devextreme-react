import * as React from "react";

import * as events from "devextreme/events";

import { addPrefixToKeys } from "./helpers";
import { createConfigurationComponent } from "./nested-option";
import { OptionCollection } from "./nested-option-collection";
import { OptionsSyncer } from "./options-syncer";
import { ITemplateMeta, Template } from "./template";
import { ITemplate, TemplateHelper } from "./template-helper";
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

  private readonly _templateHelper: TemplateHelper;
  private readonly _nestedOptions: OptionCollection = new OptionCollection();
  private readonly _syncer: OptionsSyncer;

  private _element: any;

  constructor(props: P) {
    super(props);
    this._prepareProps = this._prepareProps.bind(this);

    this.state = {
      templates: {}
    };

    this._syncer = new OptionsSyncer(this._nestedOptions, (name) => this.props[name]);
    this._templateHelper = new TemplateHelper(this);
  }

  public componentWillUpdate(nextProps: P) {
    const preparedProps = this._prepareProps(nextProps);
    const options: Record<string, any> = {
      ...preparedProps.options,
      ...this._getIntegrationOptions(preparedProps.templates, preparedProps.nestedTemplates)
    };

    this._syncer.processChangedValues(options, this.props);
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
    this._syncer.instance = this._instance;
    this._instance.on("optionChanged", this._syncer.optionChangedHandler);
  }

  public componentWillUnmount() {
    events.triggerHandler(this._element, DX_REMOVE_EVENT);
    this._instance.dispose();
  }

  private _prepareProps(rawProps: Record<string, any>): IWidgetConfig {
    const separatedProps = separateProps(rawProps, this._defaults, this._templateProps);
    let options = separatedProps.options;

    if (separatedProps.options) {
        options = {};
        Object.keys(separatedProps.options).forEach((key) => {
            options[key] = this._syncer.wrapEventHandler(separatedProps.options[key], key);
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

  private _getIntegrationOptions(options: Record<string, any>, nestedOptions: Record<string, any>): any {
    const templates: Record<string, ITemplate> = {};
    const result = {
      integrationOptions: {
        templates
      }
    };

    this._templateProps.forEach((m) => {
      if (options[m.component] || options[m.render]) {
        result[m.tmplOption] = m.tmplOption;
        templates[m.tmplOption] = this._templateHelper.wrapTemplate(options[m.component], options[m.render]);
      }
    });

    Object.keys(nestedOptions).forEach((name) => {
        templates[name] = this._templateHelper.wrapTemplate(nestedOptions[name].component, nestedOptions[name].render);
    });

    if (Object.keys(templates).length > 0) {
      return result;
    }
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
          this._syncer.processChangedValues(
            addPrefixToKeys(newOptions, optionName + "."),
            addPrefixToKeys(prevProps, optionName + ".")
          );
        }
      );
    }

    return component;
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

        nestedOptions[o.name] = o.isCollectionItem ? options : options[options.length - 1];
    });

    return nestedOptions;
  }
}

export default Component;
export { IState, ITemplateMeta };
