import * as React from "react";
import * as ReactDOM from "react-dom";

import * as events from "devextreme/events";

const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

export default class Component<P> extends React.PureComponent<P, any> {

  protected _WidgetClass: any;
  protected _instance: any;
  protected readonly _defaults: Record<string, string>;

  protected _templateProps: Array<{
    tmplOption: string
    render: string
    component: string
  }> = [];

  private readonly _guards: Record<string, number> = {};
  private _element: any;
  private _updatingProps: boolean;

  constructor(props: P) {
    super(props);
    this._optionChangedHandler = this._optionChangedHandler.bind(this);
    this._extractDefaultsValues = this._extractDefaultsValues.bind(this);
    this.state = {
      templates: {}
    };
  }

  public componentWillUpdate(nextProps: P) {
    const props: Record<string, any> = this._extractDefaultsValues(nextProps).options;
    const prevProps: Record<string, any> = this.props;

    this._processChangedValues(props, prevProps);
  }

  public render() {
      const args: any[] = [
        "div",
        { ref: (element: any) => this._element = element }
      ];
      if (!!this.props.children) {
        args.push(this.props.children);
      }
      const templates = Object.getOwnPropertySymbols(this.state.templates);
      if (templates.length) {
        args.push(templates.map((m: any) => this.state.templates[m]()));
      }
      return React.createElement.apply(this, args);
  }

  public componentDidMount() {
    const props: Record<string, any> = this.props;
    const splitProps = this._extractDefaultsValues(props);

    const options: Record<string, any> = {
      ...splitProps.defaults,
      ...splitProps.options,
      ...this._getIntegrationOptions()
    };

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

  private _extractDefaultsValues(props: Record<string, any>): {
    defaults: Record<string, any>,
    options: Record<string, any>
  } {
    const defaults: Record<string, any> = {};
    const options: Record<string, any> = {};

    Object.keys(props).forEach((key) => {
      const gaurdedOptionName = this._defaults ? this._defaults[key] : false;

      if (gaurdedOptionName) {
        defaults[gaurdedOptionName] = props[key];
      } else {
        options[key] = this._wrapEventHandler(props, key);
      }
    });

    return { defaults, options };
  }

  private _wrapEventHandler(options: any, key: string): any {
    if (key.substr(0, 2) === "on" && typeof options[key] === "function") {
      return (...args: any[]) => {
        if (!this._updatingProps) {
          options[key](...args);
        }
      };
    }

    return options[key];
  }

  private _processChangedValues(props: any, prevProps: any): void {
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

  private _getIntegrationOptions(): any {
    const result: any = {
      integrationOptions: {
        templates: {}
      }
    };

    const options: Record<string, any> = this.props;
    this._templateProps.forEach((m) => {
      if (options[m.component]) {
        result[m.tmplOption] = m.tmplOption;
        result.integrationOptions.templates[m.tmplOption] =
          this._fillTemplate(React.createElement.bind(this, options[m.component]));
      }
      if (options[m.render]) {
        result[m.tmplOption] = m.tmplOption;
        result.integrationOptions.templates[m.tmplOption] =
          this._fillTemplate(options[m.render].bind(this));
      }
    });

    return result;
  }

  private _fillTemplate(tmplFn: any): object {
    return {
      render: (data: any) => {
        const element = document.createElement("div");
        element.className = DX_TEMPLATE_WRAPPER_CLASS;
        data.container.appendChild(element);

        const elementSymbol = Symbol();
        events.one(element, DX_REMOVE_EVENT, () => {
          this.setState((state: any) => {
            const updatedTemplates = {...state.templates};
            delete updatedTemplates[elementSymbol];
            return {
              templates : updatedTemplates
            };
          });
        });

        const portal: any = () => ReactDOM.createPortal(tmplFn(data.model), element);

        this.setState((state: any) => {
          const updatedTemplates = {...state.templates};
          updatedTemplates[elementSymbol] = portal;
          return {
            templates : updatedTemplates
          };
        });
        return element;
      }
    };
  }
}
