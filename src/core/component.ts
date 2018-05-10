import * as React from "react";

import * as events from "devextreme/events";

import { ReactElement } from "react";
import { Template } from "./template";
import { prepareTemplate } from "./template-provider";

const DX_REMOVE_EVENT = "dxremove";

interface ITemplateMeta {
  tmplOption: string;
  render: string;
  component: string;
}

class Component<P> extends React.PureComponent<P, any> {

  protected _WidgetClass: any;
  protected _instance: any;
  protected readonly _defaults: Record<string, string>;

  protected _templateProps: ITemplateMeta[] = [];
  protected _nestedOptionIdPrefix: string;

  private readonly _guards: Record<string, number> = {};
  private _element: any;
  private _updatingProps: boolean;

  constructor(props: P) {
    super(props);
    this._optionChangedHandler = this._optionChangedHandler.bind(this);
    this._splitComponentProps = this._splitComponentProps.bind(this);
    this.state = {
      templates: {}
    };
  }

  public componentWillUpdate(nextProps: P) {
    const splitProps = this._splitComponentProps(nextProps);
    const options: Record<string, any> = {
      ...splitProps.options,
      ...this._getIntegrationOptions(splitProps.templates, splitProps.nestedTemplates)
    };

    this._processChangedValues(options, this.props);
  }

  public render() {
      const args: any[] = [
        "div",
        { ref: (element: any) => this._element = element }
      ];
      if (!!this.props.children) {
        args.push(this.props.children);
      }
      const templates = Object.getOwnPropertyNames(this.state.templates);
      if (templates.length) {
        args.push(templates.map((m: any) => this.state.templates[m]()));
      }
      return React.createElement.apply(this, args);
  }

  public componentDidMount() {
    const props: Record<string, any> = this.props;
    const splitProps = this._splitComponentProps(props);

    const options: Record<string, any> = {
      templatesRenderAsynchronously: true,
      ...splitProps.defaults,
      ...splitProps.options,
      ...this._getIntegrationOptions(splitProps.templates, splitProps.nestedTemplates)
    };

    if (!!this.props.children) {
      const child = this.props.children as { type: { OptionId: string } , props: object };
      if (child && child.type && child.type.OptionId) {
        if (child.type.OptionId.indexOf(this._nestedOptionIdPrefix) === 0) {
          const optionName = child.type.OptionId.substr(this._nestedOptionIdPrefix.length);
          options[optionName] = child.props;
        }
      }
    }

    this._instance = new this._WidgetClass(this._element, options);
    this._instance.on("optionChanged", this._optionChangedHandler);
  }

  public componentWillUnmount() {
    events.triggerHandler(this._element, DX_REMOVE_EVENT);
    this._instance.dispose();
  }

  private _optionChangedHandler(e: { name: string, value: any }) {
    const optionName = e.name;
    const optionValue = (this.props as any)[optionName];

    if (this._updatingProps) {
      return;
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

  private _splitComponentProps(props: Record<string, any>): {
    defaults: Record<string, any>,
    options: Record<string, any>,
    templates: Record<string, any>,
    nestedTemplates: Record<string, any>
  } {
    const defaults: Record<string, any> = {};
    const options: Record<string, any> = {};
    const templates: Record<string, any> = {};
    const nestedTemplates: Record<string, any> = {};

    const knownTemplates: Record<string, any> = {};

    this._templateProps.forEach((value) => {
      knownTemplates[value.component] = true;
      knownTemplates[value.render] = true;
    });

    Object.keys(props).forEach((key) => {
      const defaultOptionName = this._defaults ? this._defaults[key] : null;

      if (defaultOptionName) {
        defaults[defaultOptionName] = props[key];
      } else if (knownTemplates[key]) {
        templates[key] = props[key];
      } else if (key === "children") {
        React.Children.forEach(props[key], (child: ReactElement<any>) => {
            if (child.type === Template) {
                nestedTemplates[child.props.name] = {
                    render: child.props.render,
                    component: child.props.component
                };
            }
        });
      } else {
        options[key] = this._wrapEventHandler(props, key);
      }
    });

    return { defaults, options, templates, nestedTemplates };
  }

  private _wrapEventHandler(options: Record<string, any>, key: string): any {
    if (key.substr(0, 2) === "on" && typeof options[key] === "function") {
      return (...args: any[]) => {
        if (!this._updatingProps) {
          options[key](...args);
        }
      };
    }

    return options[key];
  }

  private _processChangedValues(props: Record<string, any>, prevProps: Record<string, any>): void {
    this._updatingProps = false;

    for (const optionName of Object.keys(props)) {
      if (props[optionName] !== prevProps[optionName]) {
        if (this._guards[optionName]) {
          window.clearTimeout(this._guards[optionName]);
          delete this._guards[optionName];
        }

        if (!this._updatingProps) {
          this._instance.beginUpdate();
          this._updatingProps = true;
        }
        this._instance.option(optionName, props[optionName]);
      }
    }

    if (this._updatingProps) {
      this._updatingProps = false;
      this._instance.endUpdate();
    }
  }

  private _getIntegrationOptions(options: Record<string, any>, nestedOptions: Record<string, any>): any {
    const templates: Record<string, any> = {};
    const result: Record<string, any> = {
      integrationOptions: {
        templates
      }
    };

    const getTemplate = (component: any, render: any) => {
        const templateProp = !!component ?
          React.createElement.bind(this, component) :
          render.bind(this);

        return prepareTemplate(templateProp, this);
    };

    this._templateProps.forEach((m) => {
      if (options[m.component] || options[m.render]) {
        result[m.tmplOption] = m.tmplOption;
        templates[m.tmplOption] = getTemplate(options[m.component], options[m.render]);
      }
    });

    Object.keys(nestedOptions).forEach((name) => {
        templates[name] = getTemplate(nestedOptions[name].component, nestedOptions[name].render);
    });

    if (Object.keys(templates).length > 0) {
      return result;
    }
  }
}

export default Component;
export { ITemplateMeta };
