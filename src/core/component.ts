import * as React from "react";
import * as ReactDOM from "react-dom";

import * as events from "devextreme/events";

const ROLLBACK_DELAY: number = 0;
const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

interface IDictionary<TValue = any> {
  [index: string]: TValue;
}

export default class Component<P> extends React.PureComponent<P, any> {

  protected _WidgetClass: any; // tslint:disable-line:variable-name
  protected _instance: any; // tslint:disable-line:variable-name
  protected readonly _defaults: { [index: string]: string }; // tslint:disable-line:variable-name

  protected _templateProps: Array<{ // tslint:disable-line:variable-name
    tmplOption: string
    render: string
    component: string
  }> = [];

  private readonly _guards: { [optionName: string]: number } = {}; // tslint:disable-line:variable-name
  private _element: any; // tslint:disable-line:variable-name
  private _updatingProps: boolean; // tslint:disable-line:variable-name

  constructor(props: P) {
    super(props);
    this._optionChangedHandler = this._optionChangedHandler.bind(this);
    this._extractDefaultsValues = this._extractDefaultsValues.bind(this);
    this.state = {
      templates: {}
    };
  }

  public componentWillUpdate(nextProps: P) {
    const props: IDictionary = this._extractDefaultsValues(nextProps).options;
    const prevProps: IDictionary = this.props;

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
    const props: IDictionary = this.props;
    const splitProps = this._extractDefaultsValues(props);

    const options: any = {
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

  private _optionChangedHandler(e: any) {
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
    }, ROLLBACK_DELAY);

    this._guards[optionName] = guardId;
  }

  private _extractDefaultsValues(props: IDictionary): { defaults: IDictionary, options: IDictionary } {
    const defaults: any = {};
    const options: any = {};

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

    const options: IDictionary = this.props;
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
