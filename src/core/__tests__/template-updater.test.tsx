import { TemplateUpdater } from "../template-updater";

describe("TemplateUpdater", () => {

    it("overwrites re-added templates if templateId is the same", () => {
        const updateFunc = jest.fn();
        const templateUpdater = new TemplateUpdater(updateFunc);
        const templateRenderer1 = jest.fn();
        const templateRenderer2 = jest.fn();

        templateUpdater.setTemplate("abc", templateRenderer1);
        templateUpdater.setTemplate("abc", templateRenderer2);

        expect(updateFunc).toHaveBeenLastCalledWith({ abc: templateRenderer2});
    });
});
