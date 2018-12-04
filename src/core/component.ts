import * as React from "react";

import { ComponentBase, IHtmlOptions } from "./component-base";
import { ExtensionComponent } from "./extension-component";

class Component<P> extends ComponentBase<P> {
  private readonly _extensions: Array<(element: Element) => void> = [];

  public componentDidMount() {
    super.componentDidMount();
    this._createWidget();
    this._extensions.forEach((extension) => extension.call(this, this._element));
  }

  protected _prepareChildren(): any[] {
    const args: any[] = [];
    if (isOneTextNode(this.props.children)) {
      args.push(React.Fragment);
    }

    return super._prepareChildren(args);
  }

  protected _preprocessChild(component: React.ReactElement<any>) {
    return this._registerExtension(component) || super._preprocessChild(component);
  }

  private _registerExtension(component: React.ReactElement<any>) {
    if (!ExtensionComponent.isPrototypeOf(component.type)) {
      return null;
    }

    return React.cloneElement(component, {
      onMounted: (callback: any) => {
        this._extensions.push(callback);
      }
    });
  }
}

function isOneTextNode(input: React.ReactNode) {
  const children = React.Children.toArray(input);
  return children.length === 1 && typeof children[0] === "string";
}

export {
  Component,
  IHtmlOptions
};
