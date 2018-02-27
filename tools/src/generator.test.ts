import { generateComponent } from "./generator";

it("renders", () => {
    expect(
        generateComponent({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            dxExportPath: "DX/WIDGET/PATH"
        })
    ).toBe(EXPECTED_RENDERS_WITH_PROPS);
});

//#region EXPECTED_RENDERS_WITH_PROPS
const EXPECTED_RENDERS_WITH_PROPS = `
import Widget, { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

export default class CLASS_NAME extends BaseComponent<IOptions> {

  constructor(props: IOptions) {
    super(props);
    this.WidgetClass = Widget;
  }
}
export { IOptions };
`.trimLeft();
//#endregion

it("renders with templates", () => {
    expect(
        generateComponent({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            dxExportPath: "DX/WIDGET/PATH",
            templates: [{
                name: "optionTemplate",
                render: "optionRender",
                component: "optionComponent"
            }]
        })
    ).toBe(EXPECTED_RENDERS_WITH_TEMPLATES);
});

//#region EXPECTED_RENDERS_WITH_TEMPLATES
const EXPECTED_RENDERS_WITH_TEMPLATES = `
import Widget, { IOptions as WidgetOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface IOptions extends WidgetOptions {
    optionRender?: (props: any) => React.ReactNode;
    optionComponent?: React.ComponentType<any>;
}
export default class CLASS_NAME extends BaseComponent<IOptions> {

  constructor(props: IOptions) {
    super(props);
    this.WidgetClass = Widget;

    this.templateProps = [{
      tmplOption: "optionTemplate",
      render: "optionRender",
      component: "optionComponent"
    }];
  }
}
export { IOptions };
`.trimLeft();
//#endregion
