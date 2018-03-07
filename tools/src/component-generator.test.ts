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

it("generates widget with several templates", () => {
    //#region EXPECTED
    const EXPECTED = `
import Widget, { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface ICLASS_NAMEOptions extends IOptions {
    optionRender?: (props: any) => React.ReactNode;
    optionComponent?: React.ComponentType<any>;
    anotherOptionRender?: (props: any) => React.ReactNode;
    anotherOptionComponent?: React.ComponentType<any>;
}
class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  constructor(props: ICLASS_NAMEOptions) {
    super(props);
    this.WidgetClass = Widget;

    this.templateProps = [{
        tmplOption: "optionTemplate",
        render: "optionRender",
        component: "optionComponent"
    }, {
        tmplOption: "anotherOptionTemplate",
        render: "anotherOptionRender",
        component: "anotherOptionComponent"
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
            templates: ["optionTemplate", "anotherOptionTemplate"]
        })
    ).toBe(EXPECTED);
});

it("generates widget with subscribable prop", () => {
    //#region EXPECTED
    const EXPECTED = `
import Widget, { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface ICLASS_NAMEOptions extends IOptions {
    defaultOption1?: someType;
}
class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  protected defaults = {
    defaultOption1: "option1"
  };

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
            dxExportPath: "DX/WIDGET/PATH",
            subscribableOptions: [
                { name: "option1", type: "someType" }
            ]
        })
    ).toBe(EXPECTED);
});

it("generates widget with several subscribable props", () => {
    //#region EXPECTED
    const EXPECTED = `
import Widget, { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface ICLASS_NAMEOptions extends IOptions {
    defaultOption1?: someType;
    defaultOption2?: anotherType;
}
class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  protected defaults = {
    defaultOption1: "option1",
    defaultOption2: "option2"
  };

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
            dxExportPath: "DX/WIDGET/PATH",
            subscribableOptions: [
                { name: "option1", type: "someType" },
                { name: "option2", type: "anotherType" }
            ]
        })
    ).toBe(EXPECTED);
});
