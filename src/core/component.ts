import * as React from "react";
import * as ReactDOM from "react-dom";

import * as events from "devextreme/events";

const ROLLBACK_DELAY: number = 0;
const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";

interface IDictionary<TValue = any> {
  [index: string]: TValue;
}

export default class Component<P> extends React.PureComponent<P, any> {

  protected WidgetClass: any;
  protected _instance: any; // tslint:disable-line:variable-name
  protected readonly defaults: { [index: string]: string };

  protected templateProps: Array<{
    tmplOption: string
    render: string
    component: string
  }> = [];

  private readonly guards: { [optionName: string]: number } = {};
  private element: any;
  private updatingProps: boolean;

  constructor(props: P) {
    super(props);
    this.optionChangedHandler = this.optionChangedHandler.bind(this);
    this.extractDefaultsValues = this.extractDefaultsValues.bind(this);
    this.state = {
      templates: {}
    };
  }

  public componentWillUpdate(nextProps: P) {
    const props: IDictionary = this.extractDefaultsValues(nextProps).options;
    const prevProps: IDictionary = this.props;

    this._processChangedValues(props, prevProps);
  }

  public render() {
      const args: any[] = [
        "div",
        { ref: (element: any) => this.element = element }
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
    const props: IDictionary = this.props;
    const splitProps = this.extractDefaultsValues(props);

    const options: any = {
      ...splitProps.defaults,
      ...splitProps.options,
      ...this.getIntegrationOptions()
    };

    this._instance = new this.WidgetClass(this.element, options);
    this._instance.on("optionChanged", this.optionChangedHandler);
  }

  public componentWillUnmount() {
    this._instance.dispose();
  }

  private optionChangedHandler(e: any) {
    const optionName = e.name;
    const optionValue = (this.props as any)[optionName];

    if (this.updatingProps) {
      return;
    }

    if (optionValue === undefined || optionValue === null) {
      return;
    }

    if (this.guards[optionName] !== undefined) {
      return;
    }

    const guardId = window.setTimeout(() => {
      this._instance.option(optionName, optionValue);
      window.clearTimeout(guardId);
      delete this.guards[optionName];
    }, ROLLBACK_DELAY);

    this.guards[optionName] = guardId;
  }

  private extractDefaultsValues(props: IDictionary): { defaults: IDictionary, options: IDictionary } {
    const defaults: any = {};
    const options: any = {};

    Object.keys(props).forEach((key) => {
      const gaurdedOptionName = this.defaults ? this.defaults[key] : false;

      if (gaurdedOptionName) {
        defaults[gaurdedOptionName] = props[key];
      } else {
        options[key] = this.wrapEventHandler(props, key);
      }
    });

    return { defaults, options };
  }

  private wrapEventHandler(options: any, key: string): any {
    if (key.substr(0, 2) === "on" && typeof options[key] === "function") {
      return (...args: any[]) => {
        if (!this.updatingProps) {
          options[key](...args);
        }
      };
    }

    return options[key];
  }

  private _processChangedValues(props: any, prevProps: any): void {
    this.updatingProps = false;

    for (const optionName of Object.keys(props)) {
      if (props[optionName] !== prevProps[optionName]) {
        if (this.guards[optionName]) {
          window.clearTimeout(this.guards[optionName]);
          delete this.guards[optionName];
        }

        if (!this.updatingProps) {
          this._instance.beginUpdate();
          this.updatingProps = true;
        }
        this._instance.option(optionName, props[optionName]);
      }
    }

    if (this.updatingProps) {
      this.updatingProps = false;
      this._instance.endUpdate();
    }
  }

  private getIntegrationOptions(): any {
    const result: any = {
      integrationOptions: {
        templates: {}
      }
    };

    const options: IDictionary = this.props;
    this.templateProps.forEach((m) => {
      if (options[m.component]) {
        result[m.tmplOption] = m.tmplOption;
        result.integrationOptions.templates[m.tmplOption] =
          this.fillTemplate(React.createElement.bind(this, options[m.component]));
      }
      if (options[m.render]) {
        result[m.tmplOption] = m.tmplOption;
        result.integrationOptions.templates[m.tmplOption] =
          this.fillTemplate(options[m.render].bind(this));
      }
    });

    return result;
  }

  private fillTemplate(tmplFn: any): object {
    return {
      render: (data: any) => {
        const element = document.createElement("div");
        element.className = DX_TEMPLATE_WRAPPER_CLASS;
        data.container.appendChild(element);

        const elementSymbol = Symbol();
        events.one(element, "dxremove", () => {
          this.setState((state: any) => {
            const updatedTemplates = {...state.templates};
            delete updatedTemplates[elementSymbol];
            return {
              templates : updatedTemplates
            };
          });
        });

        const portal: any = () => ReactDOM.createPortal(tmplFn({...data.model}), element);

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
