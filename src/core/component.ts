import * as React from "react";
import * as ReactDOM from "react-dom";

export default class Component<P> extends React.Component<P, any> {

  protected WidgetClass: any;
  protected instance: any;

  protected templateProps: Array<{
    tmplOption: string
    render: string
    component: string
  }> = [];

  private element: any;

  public render() {
    if (!!this.props.children) {
      return React.createElement("div", { ref: (element) => this.element = element }, this.props.children);
    } else {
      return React.createElement("div", { ref: (element) => this.element = element });
    }
  }

  public componentDidMount() {
    const options: any = {
      ...this.props as object,
      ...this.getIntegrationOptions()
    };

    this.instance = new this.WidgetClass(this.element, options);
  }

  public componentWillUnmount() {
    this.instance.dispose();
  }

  public componentDidUpdate(prevProps: P) {
    let updateStarted = false;
    const updateOption = (path: string, value: any): void => {
      if (!updateStarted) {
        this.instance.beginUpdate();
        updateStarted = true;
      }

      this.instance.option(path, value);
    };

    this.processChangedValues(this.props, prevProps, updateOption, []);

    if (updateStarted) {
      this.instance.endUpdate();
    }
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
