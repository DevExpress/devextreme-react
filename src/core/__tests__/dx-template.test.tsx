import { createDxTemplate } from "../dx-template";
import { TemplatesStore } from "../templates-store";

describe("dx-template", () => {

    describe("template ID", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("is the same if template rendered twice for the same model", () => {
            const model: any = {};

            tryDoubleRender(model);

            expect(templatesStore.add).toHaveBeenCalledTimes(2);

            const firstId = templatesStore.add.mock.calls[0][0];
            const secondId = templatesStore.add.mock.calls[1][0];
            expect(secondId).toBe(firstId);
        });

        it("is the same if template rendered twice with null passed as model", () => {
            // e.g. Lookup passes null as model if no item selected
            const model: any = null;

            tryDoubleRender(model);

            expect(templatesStore.add).toHaveBeenCalledTimes(2);

            const firstId = templatesStore.add.mock.calls[0][0];
            const secondId = templatesStore.add.mock.calls[1][0];
            expect(secondId).toBe(firstId);
        });

        it("is different if template rendered twice with undefined as model", () => {
            // skip cases when model is undefined since no clear way of how to behave
            const model: any = undefined;

            tryDoubleRender(model);

            expect(templatesStore.add).toHaveBeenCalledTimes(2);

            const firstId = templatesStore.add.mock.calls[0][0];
            const secondId = templatesStore.add.mock.calls[1][0];

            expect(secondId).not.toBe(firstId);
        });

        const templatesStore: any = {
            add: jest.fn(),
            remove: jest.fn(),
            listWrappers: jest.fn()
        };

        function tryDoubleRender(model: any): void {
            const template = createDxTemplate(
                jest.fn(),
                templatesStore as TemplatesStore
            );

            template.render({
                container: {},
                model
            });

            template.render({
                container: {},
                model
            });
        }
    });
});
