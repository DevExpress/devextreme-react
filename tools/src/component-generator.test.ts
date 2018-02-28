import generate from "./component-generator";

it("generates", () => {
    expect(
        generate({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            dxExportPath: "DX/WIDGET/PATH"
        })
    ).toBe(EXPECTED_RENDERS_WITH_PROPS);
});

//#region EXPECTED_RENDERS_WITH_PROPS
const EXPECTED_RENDERS_WITH_PROPS = `
import Widget, { IOptions as ICLASS_NAMEOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  constructor(props: ICLASS_NAMEOptions) {
    super(props);
    this.WidgetClass = Widget;
  }
}
export { CLASS_NAME, ICLASS_NAMEOptions };
`.trimLeft();
//#endregion

it("generates widget with template", () => {
    expect(
        generate({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            dxExportPath: "DX/WIDGET/PATH",
            templates: ["optionTemplate"]
        })
    ).toBe(EXPECTED_RENDERS_WIDGET_WITH_TEMPLATE);
});

//#region EXPECTED_RENDERS_WIDGET_WITH_TEMPLATE
const EXPECTED_RENDERS_WIDGET_WITH_TEMPLATE = `
import Widget, { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface ICLASS_NAMEOptions extends IOptions {
    optionRender?: (props: any) => React.ReactNode;
    optionComponent?: React.ComponentType<any>;
}
class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  constructor(props: ICLASS_NAMEOptions) {
    super(props);
    this.WidgetClass = Widget;

    this.templateProps = [{
        tmplOption: "optionTemplate",
        render: "optionRender",
        component: "optionComponent"
    }];
  }
}
export { CLASS_NAME, ICLASS_NAMEOptions };
`.trimLeft();
//#endregion
