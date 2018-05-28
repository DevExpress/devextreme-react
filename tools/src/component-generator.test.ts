import generate from "./component-generator";

it("generates", () => {
    //#region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME,
       { IOptions as ICLASS_NAMEOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    //#endregion

    expect(
        generate({
            name: "CLASS_NAME",
            baseComponentPath: "BASE_COMPONENT_PATH",
            configComponentPath: null,
            dxExportPath: "DX/WIDGET/PATH"
        })
    ).toBe(EXPECTED);
});

describe("template-props generation", () => {

    it("processes option", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface ICLASS_NAMEOptions extends IOptions {
  optionRender?: (props: any) => React.ReactNode;
  optionComponent?: React.ComponentType<any>;
}

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected _templateProps = [{
    tmplOption: "optionTemplate",
    render: "optionRender",
    component: "optionComponent"
  }];
}
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: null,
                dxExportPath: "DX/WIDGET/PATH",
                templates: ["optionTemplate"]
            })
        ).toBe(EXPECTED);
    });

    it("processes several options", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface ICLASS_NAMEOptions extends IOptions {
  optionRender?: (props: any) => React.ReactNode;
  optionComponent?: React.ComponentType<any>;
  anotherOptionRender?: (props: any) => React.ReactNode;
  anotherOptionComponent?: React.ComponentType<any>;
}

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected _templateProps = [{
    tmplOption: "optionTemplate",
    render: "optionRender",
    component: "optionComponent"
  }, {
    tmplOption: "anotherOptionTemplate",
    render: "anotherOptionRender",
    component: "anotherOptionComponent"
  }];
}
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: null,
                dxExportPath: "DX/WIDGET/PATH",
                templates: ["optionTemplate", "anotherOptionTemplate"]
            })
        ).toBe(EXPECTED);
    });

    it("processes single widget-template option", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface ICLASS_NAMEOptions extends IOptions {
  render?: (props: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected _templateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }];
}
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: null,
                dxExportPath: "DX/WIDGET/PATH",
                templates: ["template"]
            })
        ).toBe(EXPECTED);
    });
});

describe("props generation", () => {

    it("processes subscribable option", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface ICLASS_NAMEOptions extends IOptions {
  defaultOption1?: someType;
}

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected _defaults = {
    defaultOption1: "option1"
  };
}
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: null,
                dxExportPath: "DX/WIDGET/PATH",
                subscribableOptions: [
                    { name: "option1", type: "someType" }
                ]
            })
        ).toBe(EXPECTED);
    });

    it("processes several subscribable options", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";

interface ICLASS_NAMEOptions extends IOptions {
  defaultOption1?: someType;
  defaultOption2?: anotherType;
}

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected _defaults = {
    defaultOption1: "option1",
    defaultOption2: "option2"
  };
}
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: null,
                dxExportPath: "DX/WIDGET/PATH",
                subscribableOptions: [
                    { name: "option1", type: "someType" },
                    { name: "option2", type: "anotherType" }
                ]
            })
        ).toBe(EXPECTED);
    });

    it("processes nested options", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions as ICLASS_NAMEOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";
import NestedOption from "CONFIG_COMPONENT_PATH";

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
// tslint:disable:max-classes-per-file

class CLASS_NAMEOpt_1 extends NestedOption<{
  sub_opt_2?: TYPE_1;
  sub_opt_3?: {
    sub_sub_opt_4?: TYPE_2;
    sub_sub_opt_5?: {
      sub_sub_sub_opt_6?: TYPE_3;
    };
  };
}> {
  public static OwnerType = CLASS_NAME;
  public static OptionName = "opt_1";
}

export {
  CLASS_NAME,
  ICLASS_NAMEOptions,
  CLASS_NAMEOpt_1
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: "CONFIG_COMPONENT_PATH",
                dxExportPath: "DX/WIDGET/PATH",
                nestedOptions: [
                    {
                        name: "opt_1",
                        nested: [
                            {
                                name: "sub_opt_2",
                                type: "TYPE_1"
                            },
                            {
                                name: "sub_opt_3",
                                nested: [
                                    {
                                        name: "sub_sub_opt_4",
                                        type: "TYPE_2"
                                    },
                                    {
                                        name: "sub_sub_opt_5",
                                        nested: [
                                            {
                                                name: "sub_sub_sub_opt_6",
                                                type: "TYPE_3"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
        ).toBe(EXPECTED);
    });

    it("processes nested array options", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions as ICLASS_NAMEOptions } from "devextreme/DX/WIDGET/PATH";
import BaseComponent from "BASE_COMPONENT_PATH";
import NestedOption from "CONFIG_COMPONENT_PATH";

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
// tslint:disable:max-classes-per-file

class CLASS_NAMEOpt_1 extends NestedOption<{
  sub_opt_2?: TYPE_1;
}> {
  public static IsCollectionItem = true;
  public static OwnerType = CLASS_NAME;
  public static OptionName = "opt_1";
}

export {
  CLASS_NAME,
  ICLASS_NAMEOptions,
  CLASS_NAMEOpt_1
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: "CONFIG_COMPONENT_PATH",
                dxExportPath: "DX/WIDGET/PATH",
                nestedOptions: [
                    {
                        name: "opt_1",
                        nested: [
                            {
                                name: "sub_opt_2",
                                type: "TYPE_1"
                            }
                        ],
                        isCollectionItem: true
                    }
                ]
            })
        ).toBe(EXPECTED);
    });

    it("adds check for single type", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions as ICLASS_NAMEOptions } from "devextreme/DX/WIDGET/PATH";
import { PropTypes } from "prop-types";
import BaseComponent from "BASE_COMPONENT_PATH";

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
(CLASS_NAME as any).propTypes = {
  PROP1: PropTypes.SOME_TYPE
};
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: null,
                dxExportPath: "DX/WIDGET/PATH",
                propTypings: [
                    {
                        propName: "PROP1",
                        types: ["SOME_TYPE"]
                    }
                ]
            })
        ).toBe(EXPECTED);
    });

    it("adds check for acceptable values", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions as ICLASS_NAMEOptions } from "devextreme/DX/WIDGET/PATH";
import { PropTypes } from "prop-types";
import BaseComponent from "BASE_COMPONENT_PATH";

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
(CLASS_NAME as any).propTypes = {
  PROP1: PropTypes.oneOf([
    "VALUE_1",
    "VALUE_2"
  ])
};
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: null,
                dxExportPath: "DX/WIDGET/PATH",
                propTypings: [
                    {
                        propName: "PROP1",
                        types: [],
                        acceptableValues: ["\"VALUE_1\"", "\"VALUE_2\""],
                    }
                ]
            })
        ).toBe(EXPECTED);
    });

    it("adds check for several types", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions as ICLASS_NAMEOptions } from "devextreme/DX/WIDGET/PATH";
import { PropTypes } from "prop-types";
import BaseComponent from "BASE_COMPONENT_PATH";

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
(CLASS_NAME as any).propTypes = {
  PROP1: PropTypes.oneOfType([
    PropTypes.SOME_TYPE,
    PropTypes.ANOTHER_TYPE
  ])
};
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: null,
                dxExportPath: "DX/WIDGET/PATH",
                propTypings: [
                    {
                        propName: "PROP1",
                        types: ["SOME_TYPE", "ANOTHER_TYPE"]
                    }
                ]
            })
        ).toBe(EXPECTED);
    });

    it("adds typings in alphabetic order", () => {
        //#region EXPECTED
        const EXPECTED = `
import dxCLASS_NAME,
       { IOptions as ICLASS_NAMEOptions } from "devextreme/DX/WIDGET/PATH";
import { PropTypes } from "prop-types";
import BaseComponent from "BASE_COMPONENT_PATH";

class CLASS_NAME extends BaseComponent<ICLASS_NAMEOptions> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
(CLASS_NAME as any).propTypes = {
  A-PROP: PropTypes.oneOfType([
    PropTypes.TYPE_1,
    PropTypes.TYPE_2
  ]),
  a-PROP: PropTypes.TYPE_3,
  B-PROP: PropTypes.TYPE_4,
  c-PROP: PropTypes.TYPE_2
};
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
        //#endregion

        expect(
            generate({
                name: "CLASS_NAME",
                baseComponentPath: "BASE_COMPONENT_PATH",
                configComponentPath: null,
                dxExportPath: "DX/WIDGET/PATH",
                propTypings: [
                    {
                        propName: "A-PROP",
                        types: ["TYPE_1", "TYPE_2"]
                    },
                    {
                        propName: "c-PROP",
                        types: ["TYPE_2"]
                    },
                    {
                        propName: "a-PROP",
                        types: ["TYPE_3"]
                    },
                    {
                        propName: "B-PROP",
                        types: ["TYPE_4"]
                    }
                ]
            })
        ).toBe(EXPECTED);
    });
});
