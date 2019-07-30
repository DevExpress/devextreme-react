import { ComponentBase, IHtmlOptions } from "./component-base";

interface IExtensionOptions {
  onMounted(callback: (element: Element) => void): void;
}

class ExtensionComponent<P extends IHtmlOptions & IExtensionOptions> extends ComponentBase<P> {
  public componentDidMount() {
    const onMounted = this.props.onMounted;
    if (onMounted) {
      onMounted(this._createWidget);
    } else {
      this._createWidget();
    }
  }
}

export {
  ExtensionComponent
};
