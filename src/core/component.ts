import * as React from "react";

import { ComponentBase, IHtmlOptions } from "./component-base";
import { ExtensionComponent } from "./extension-component";

class Component<P> extends ComponentBase<P> {
  private _extensions: Array<(element: Element) => void> = [];

  constructor(props: P) {
    super(props);

    this.registerExtension = this.registerExtension.bind(this);
  }

  public componentDidMount() {
    super.componentDidMount();
    this._createWidget();
    this._extensions.forEach((extension) => extension.call(this, this._element));
  }

  protected renderChildren() {
    return React.Children.map(
      this.props.children,
      (child) => {
        if (child && ExtensionComponent.isPrototypeOf((child as any).type)) {
          return React.cloneElement(
            child as any,
            { onMounted: this.registerExtension}
          );
        }

        return child;
      }
    );
  }

  private registerExtension(callback: any) {
    this._extensions.push(callback);
  }
}

export {
  Component,
  IHtmlOptions
};
