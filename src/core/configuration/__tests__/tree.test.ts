import { IConfigNode } from "../config-node";
import { buildNode, buildTemplates } from "../tree";

describe("buildNode", () => {
    const mockTemplatesAccum = {};
    const mockIgnoreInitialValues: boolean = false;

    it("run with dxKey as props", () => {
        const mockNode: IConfigNode = {
            fullName: "",
            predefinedOptions: {},
            initialOptions: {
                center: {
                    lat: 40.749825,
                    lng: -73.987963
                },
                zoom: 10
            },
            options: {
                controls: true,
                width: "100%",
                provider: "google",
                dxKey: {
                    google: "X"
                }
            },
            templates: [],
            configs: {},
            configCollections: {}
        };
        expect(buildNode(mockNode, mockTemplatesAccum, mockIgnoreInitialValues)).toEqual({
            center: {lat: 40.749825, lng: -73.987963},
            controls: true,
            key: {
                google: "X"
            },
            provider: "google",
            width: "100%",
            zoom: 10
        });
    });

    it("run with key as nested Component", () => {
        const mockNode: IConfigNode = {
            fullName: "",
            predefinedOptions: {},
            initialOptions: {
                center: {
                    lat: 40.749825,
                    lng: -73.987963
                },
                zoom: 10
            },
            options: {
                controls: true,
                provider: "google",
                width: "100%"
            },
            templates: [],
            configs: {
                key: {
                    fullName: "key",
                    configCollections: {},
                    predefinedOptions: {},
                    initialOptions: {},
                    options: {
                        google: "X"
                    },
                    templates: [],
                    configs: {}
                }
            },
            configCollections: {}
        };
        expect(buildNode(mockNode, mockTemplatesAccum, mockIgnoreInitialValues)).toEqual({
            center: {lat: 40.749825, lng: -73.987963},
            controls: true,
            key: {
                google: "X"
            },
            provider: "google",
            width: "100%",
            zoom: 10,
        });
    });

    it("run without dxKey", () => {
        const mockNode: IConfigNode = {
            fullName: "",
            predefinedOptions: {},
            initialOptions: {
                center: {
                    lat: 40.749825,
                    lng: -73.987963
                },
                zoom: 10
            },
            options: {
                controls: true,
                width: "100%",
                provider: "google",
            },
            templates: [],
            configs: {},
            configCollections: {}
        };

        expect(buildNode(mockNode, mockTemplatesAccum, mockIgnoreInitialValues)).toEqual({
            center: {lat: 40.749825, lng: -73.987963},
            controls: true,
            provider: "google",
            width: "100%",
            zoom: 10
        });
    });
});

describe("build templates", () => {
    it("do not change anything", () => {
        const testNode: IConfigNode = {
            configCollections: {},
            configs: {},
            fullName: "key",
            initialOptions: {},
            options: {
                google: "X"
            },
            predefinedOptions: {},
            templates: []
        };
        const checkNode = testNode;
        const optionAccum = {
            google: "X"
        };
        const templateAccum = {};
        const checkOptionAccum = {
            google: "X"
        };
        const checkTemplateAccum = {};
        buildTemplates(testNode, optionAccum, templateAccum);
        expect(testNode).toEqual(checkNode);
        expect(optionAccum).toEqual(checkOptionAccum);
        expect(templateAccum).toEqual(checkTemplateAccum);
    });

    it("change templateAccum and optionAccum", () => {
        const testNode: IConfigNode = {
            configCollections: {},
            configs: {},
            fullName: "",
            initialOptions: {},
            options: {
                width: 120,
                text: "Contained",
                type: "normal",
                stylingMode: "contained"
            },
            predefinedOptions: {},
            templates: [{
                content: () => undefined,
                isAnonymous: true,
                keyFn: undefined,
                optionName: "template",
                type: "render"
            }]
        };
        const checkNode = {
            configCollections: {},
            configs: {},
            fullName: "",
            initialOptions: {},
            options: {
                width: 120,
                text: "Contained",
                type: "normal",
                stylingMode: "contained"
            },
            predefinedOptions: {},
            templates: [{
                content: () => undefined,
                isAnonymous: true,
                keyFn: undefined,
                optionName: "template",
                type: "render"
            }]
        };
        const optionAccum = {
            stylingMode: "contained",
            text: "Contained",
            type: "normal",
            width: 120
         };
        const checkOptionAccum = {
            stylingMode: "contained",
            template: "template",
            text: "Contained",
            type: "normal",
            width: 120
        };
        const templateAccum = {};
        const checkTemplateAccum = {
            template: {
                content: () => undefined,
                isAnonymous: true,
                keyFn: undefined,
                optionName: "template",
                type: "render"
            }
        };
        buildTemplates(testNode, optionAccum, templateAccum);
        expect(JSON.stringify(testNode)).toEqual(JSON.stringify(checkNode));
        expect(optionAccum).toEqual(checkOptionAccum);
        expect(JSON.stringify(templateAccum)).toEqual(JSON.stringify(checkTemplateAccum));
    });
});
