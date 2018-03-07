import * as React from "react";
import * as ReactDOM from "react-dom";

const ROLLBACK_DELAY: number = 0;

export default class Component<P> extends React.Component<P, any> {

  protected WidgetClass: any;
  protected instance: any;
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
  }

  public t(callback: () => void) {
    window.setTimeout(callback, 10);
  }

  public componentWillReceiveProps(nextProps: P) {
    const prevProps = this.props;

    Object.keys(this.guards).forEach((optionName) => {
      if ((nextProps as any)[optionName] !== (this.props as any)[optionName]) {
        window.clearTimeout(this.guards[optionName]);
        delete this.guards[optionName];
      }
    });

    this.updatingProps = false;
    const updateOption = (optionPath: string, value: any): void => {
      if (!this.updatingProps) {
        this.instance.beginUpdate();
        this.updatingProps = true;
      }
      this.instance.option(optionPath, value);
    };

    this.processChangedValues(nextProps, prevProps, updateOption, []);

    if (this.updatingProps) {
      this.updatingProps = false;
      this.instance.endUpdate();
    }
  }

  public shouldComponentUpdate() {
    return false;
  }

  public render() {
    if (!!this.props.children) {
      return React.createElement("div", { ref: (element) => this.element = element }, this.props.children);
    } else {
      return React.createElement("div", { ref: (element) => this.element = element });
    }
  }

  public componentDidMount() {
    const props = this.props as { [index: string]: any };
    const splitProps = this.extractDefaultsValues(props);

    const options: any = {
      ...splitProps.options,
      ...splitProps.defaults,
      ...this.getIntegrationOptions()
    };

    Object.keys(props).forEach((optionName) => {

      if (optionName.substr(0, 2) === "on" && typeof props[optionName] === "function") {

        options[optionName] = (...args: any[]) => {
          if (!this.updatingProps) {
            props[optionName](...args);
          }
        };
        return;
      }
    });

    this.instance = new this.WidgetClass(this.element, options);
    this.instance.on("optionChanged", this.optionChangedHandler);
  }

  public componentWillUnmount() {
    this.instance.dispose();
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
      this.instance.option(optionName, optionValue);
      window.clearTimeout(guardId);
      delete this.guards[optionName];
    }, ROLLBACK_DELAY);

    this.guards[optionName] = guardId;
  }

  private extractDefaultsValues(props: any): { defaults: object, options: object } {
    const defaults: any = {};
    const options: any = {};
    if (!this.defaults) {
      return { defaults, options: props };
    }

    Object.keys(props).forEach((key) => {
      const gaurdedOptionName = this.defaults[key];

      if (gaurdedOptionName) {
        defaults[gaurdedOptionName] = props[key];
      } else {
        options[key] = props[key];
      }
    });

    return { defaults, options };
  }

  private processChangedValues(
    value: any,
    prevValue: any,
    callback: (path: string, value: any) => void,
    path: string[]
  ): void {
    if (!this.isContainer(value)) {
      if (value !== prevValue) {
        callback(path.join("."), value);
      }

      return;
    }

    for (const key of Object.keys(value)) {
      this.processChangedValues(value[key], prevValue[key], callback, [...path, key]);
    }
  }

  private isContainer(option: any): boolean {
    return (option instanceof Object && !Array.isArray(option));
  }

  private getIntegrationOptions(): any {
    const result: any = {
      integrationOptions: {
        templates: {}
      }
    };

    const options: {[index: string]: any} = this.props;
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
        const result = this.getTemplateContent(tmplFn, {...data.model});
        data.container.appendChild(result);
        return result;
      }
    };
  }

  private getTemplateContent(tmplFn: any, tmplProps: any): any {
    const element = document.createElement("div");
    const tmplWithData = tmplFn(tmplProps);
    ReactDOM.render(tmplWithData, element);
    return element;
  }
}
