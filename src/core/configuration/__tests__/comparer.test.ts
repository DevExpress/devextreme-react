import { getChanges } from "../comparer";
import { IConfigNode } from "../config-node";

const emptyNode: IConfigNode = {
    fullName: "",
    predefinedOptions: {},
    initialOptions: {},
    options: {},
    templates: [],
    configs: {},
    configCollections: {}
};

describe("child config nodes comparing", () => {
    it("detects additions", () => {
        const prevConfig = {
            ...emptyNode
        };

        const currentConfig = {
            ...emptyNode,
            configs: {
                option: {
                    ...emptyNode,
                    fullName: "option",
                    options: {a: 1}
                }
            }
        };

        const changes = getChanges(currentConfig, prevConfig);
        expect(Object.keys(changes.options).length).toEqual(1);
        expect(changes.options.option).toEqual({a: 1});
    });
});
