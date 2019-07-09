import { ComponentBase } from "./component-base";
import { IWidgetContext, WidgetContext } from "./widget-context";

class ExtensionComponent<P> extends ComponentBase<P> {
  protected static contextType = WidgetContext;
  public context!: IWidgetContext | null;

  public componentDidMount() {
    if (this.context && this.context.registerExtension) {
      this.context.registerExtension(
        (element: any) => {
          this._createWidget(element);
        });
    }
  }
}

export {
  ExtensionComponent
};
