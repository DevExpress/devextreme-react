import { wrapTemplate } from "../template-host";

describe("template-host", () => {

    describe("its wrapped template", () => {

        it("doesn't render twice into the same container", () => {
            const updateFunc = jest.fn();
            const container: any = {};
            const template = wrapTemplate(
                jest.fn(),
                updateFunc,
                jest.fn()
            );

            template.render({
                container
            });

            template.render({
                container
            });

            expect(updateFunc).toHaveBeenCalledTimes(1);
        });
    });

});
