import { IConfigNode } from "../config-node";
import { buildNode, buildTemplates } from "../tree";

describe("buildNode", () => {
    const mockTemplatesAccum = {};
    const mockIgnoreInitialValues: boolean = false;

    it("run with dxKey as props", () => {
        const mockNode: IConfigNode = {
            fullName: "",
            predefinedOptions: {},
            initialOptions: {},
            options: {
                dxKey: { google: "X" }
            },
            templates: [],
            configs: {},
            configCollections: {}
        };
        expect(buildNode(mockNode, mockTemplatesAccum, mockIgnoreInitialValues)).toEqual({
            key: { google: "X" }
        });
    });

    it("run with key as nested Component", () => {
        const mockNode: IConfigNode = {
            fullName: "",
            predefinedOptions: {},
            initialOptions: {},
            options: {},
            templates: [],
            configs: {
                key: {
                    fullName: "key",
                    configCollections: {},
                    predefinedOptions: {},
                    initialOptions: {},
                    options: { google: "X" },
                    templates: [],
                    configs: {}
                }
            },
            configCollections: {}
        };
        expect(buildNode(mockNode, mockTemplatesAccum, mockIgnoreInitialValues)).toEqual({
            key: { google: "X" }
        });
    });

    it("run without dxKey", () => {
        const mockNode: IConfigNode = {
            fullName: "",
            predefinedOptions: {},
            initialOptions: {},
            options: {},
            templates: [],
            configs: {},
            configCollections: {}
        };

        expect(buildNode(mockNode, mockTemplatesAccum, mockIgnoreInitialValues)).toEqual({});
    });
});

describe("buildTemplates", () => {
    it("do not change anything", () => {
        const testNode: IConfigNode = {
            configCollections: {},
            configs: {},
            fullName: "key",
            initialOptions: {},
            options: { google: "X" },
            predefinedOptions: {},
            templates: []
        };
        const optionAccum = { google: "X" };
        const templateAccum = {};
        const expectedOptionAccum = { google: "X" };
        const expectedTemplateAccum = {};
        buildTemplates(testNode, optionAccum, templateAccum);
        expect(optionAccum).toEqual(expectedOptionAccum);
        expect(templateAccum).toEqual(expectedTemplateAccum);
    });

    it("change templateAccum and optionAccum", () => {
        const content = () => undefined;
        const testNode: IConfigNode = {
            configCollections: {},
            configs: {},
            fullName: "",
            initialOptions: {},
            options: {},
            predefinedOptions: {},
            templates: [{
                content,
                isAnonymous: true,
                keyFn: undefined,
                optionName: "template",
                type: "render"
            }]
        };
        const optionAccum = {
            stylingMode: "contained",
            text: "Contained",
            type: "normal"
         };
        const expectedOptionAccum = {
            stylingMode: "contained",
            template: "template",
            text: "Contained",
            type: "normal"
        };
        const templateAccum = {};
        const expectedTemplateAccum = {
            template: {
                content,
                isAnonymous: true,
                keyFn: undefined,
                optionName: "template",
                type: "render"
            }
        };
        buildTemplates(testNode, optionAccum, templateAccum);
        expect(optionAccum).toEqual(expectedOptionAccum);
        expect(templateAccum).toEqual(expectedTemplateAccum);
    });
});
