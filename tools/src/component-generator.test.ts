import generate from "./component-generator";

it("generates", () => {

//#region EXPECTED
    const EXPECTED = `
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

    expect(
        generate({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            dxExportPath: "DX/WIDGET/PATH"
        })
    ).toBe(EXPECTED);
});

it("generates widget with template", () => {
//#region EXPECTED
    const EXPECTED = `
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

    expect(
        generate({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            dxExportPath: "DX/WIDGET/PATH",
            templates: ["optionTemplate"]
        })
    ).toBe(EXPECTED);
});
