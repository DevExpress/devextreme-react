import { createDxIntegration } from "../template-dx-integration";

describe("template-host", () => {

    describe("its wrapped template", () => {

        it("doesn't render twice into the same container", () => {
            const setTemplate = jest.fn();
            const container: any = {};
            const template = createDxIntegration(
                jest.fn(),
                {
                    setTemplate,
                    removeTemplate: jest.fn()
                },
                jest.fn()
            );

            template.render({
                container
            });

            template.render({
                container
            });

            expect(setTemplate).toHaveBeenCalledTimes(1);
        });
    });

});
