import { ComponentBase, IHtmlOptions } from "./component-base";

class Component<P> extends ComponentBase<P> {
  public componentDidMount() {
    super.componentDidMount();
    this._createWidget();
    this._extensions.forEach((extension) => extension.call(this, this._element));
  }
}

export {
  Component,
  IHtmlOptions
};
