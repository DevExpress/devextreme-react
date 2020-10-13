import { ComponentBase } from './component-base';

class ExtensionComponent<P> extends ComponentBase<P> {
  public componentDidMount(): void {
    const onMounted = (this.props as any).onMounted;
    if (onMounted) {
      onMounted(this._createWidget);
    } else {
      this._createWidget();
    }
  }
}

export {
  ExtensionComponent,
};
