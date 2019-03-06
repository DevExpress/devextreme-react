import { createDxTemplate } from "../dx-template";

describe("dx-template", () => {

    describe("template ID", () => {

        it("is the same if template rendered twice for the same model", () => {
            setTemplate.mockClear();
            const model: any = {};

            tryDoubleRender(model);

            expect(setTemplate).toHaveBeenCalledTimes(2);

            const firstId = setTemplate.mock.calls[0][0];
            const secondId = setTemplate.mock.calls[1][0];
            expect(secondId).toBe(firstId);
        });

        it("is the same if template rendered twice with null passed as model", () => {
            // e.g. Lookup passes null as model if no item selected
            setTemplate.mockClear();
            const model: any = null;

            tryDoubleRender(model);

            expect(setTemplate).toHaveBeenCalledTimes(2);

            const firstId = setTemplate.mock.calls[0][0];
            const secondId = setTemplate.mock.calls[1][0];
            expect(secondId).toBe(firstId);
        });

        it("is different if template rendered twice with undefined as model", () => {
            // skip cases when model is undefined since no clear way of how to behave
            setTemplate.mockClear();
            const model: any = undefined;

            tryDoubleRender(model);

            expect(setTemplate).toHaveBeenCalledTimes(2);

            const firstId = setTemplate.mock.calls[0][0];
            const secondId = setTemplate.mock.calls[1][0];

            expect(secondId).not.toBe(firstId);
        });

        const setTemplate = jest.fn();

        function tryDoubleRender(model: any): void {
            const template = createDxTemplate(
                jest.fn(),
                {
                    setTemplate,
                    removeTemplate: jest.fn()
                }
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
