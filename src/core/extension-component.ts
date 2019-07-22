import { ComponentBase } from "./component-base";

class ExtensionComponent<P> extends ComponentBase<P> {
  public componentDidMount() {
    const onMounted = (this.props as Record<string, any>).onMounted;
    if (onMounted) {
      onMounted((element) => {
        this._createWidget(element);
      });
    }
  }
}

export {
  ExtensionComponent
};
