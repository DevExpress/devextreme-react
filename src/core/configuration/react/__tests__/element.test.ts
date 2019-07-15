// tslint:disable:max-classes-per-file
import { mount, React } from "../../../__tests__/setup";

import ConfigurationComponent from "../../../../core/nested-option";
import { Template } from "../../../template";

import { ElementType, getElementInfo } from "../element";

class MinimalConfigurationComponent extends ConfigurationComponent<any> {
    public static OptionName = "option";
    public static IsCollectionItem = false;
}

class RichConfigurationComponent extends ConfigurationComponent<any> {
    public static OptionName = "option";
    public static IsCollectionItem = false;
    public static DefaultsProps = { defaultValue: "value" };
    public static TemplateProps = [{
        tmplOption: "template",
        render: "render",
        component: "component",
        keyFn: "keyFn"
    }];
    public static PredefinedProps = { type: "numeric" };
}

class CollectionConfigurationComponent extends ConfigurationComponent<any> {
    public static OptionName = "option";
    public static IsCollectionItem = true;
    public static DefaultsProps = { defaultValue: "value" };
    public static TemplateProps = [{
        tmplOption: "template",
        render: "render",
        component: "component",
        keyFn: "keyFn"
    }];
    public static PredefinedProps = { type: "numeric" };
}

describe("getElementInfo", () => {
    it("parses Configuration components", () => {
        const components: any[] = [
            MinimalConfigurationComponent,
            RichConfigurationComponent,
            CollectionConfigurationComponent
        ];

        components.map((component) => {
            const wrapper = mount(React.createElement(component));
            const elementInfo = getElementInfo(wrapper.getElement());

            if (elementInfo.type !== ElementType.Option) {
                expect(elementInfo.type).toEqual(ElementType.Option);
                return;
            }

            expect(elementInfo.props).toEqual(wrapper.getElement().props);

            const descriptor = elementInfo.descriptor;
            expect(descriptor.name).toEqual(component.OptionName);
            expect(descriptor.isCollection).toEqual(component.IsCollectionItem);
            expect(descriptor.templates).toEqual(component.TemplateProps || []);
            expect(descriptor.initialValuesProps).toEqual(component.DefaultsProps || {});
            expect(descriptor.predefinedValuesProps).toEqual(component.PredefinedProps || {});
        });
    });

    it("parses Template components", () => {
        const wrapper = mount(
            React.createElement(
                Template,
                {
                    name: "template-name"
                }
            )
        );

        const elementInfo = getElementInfo(wrapper.getElement());

        if (elementInfo.type !== ElementType.Template) {
            expect(elementInfo.type).toEqual(ElementType.Template);
            return;
        }

        expect(elementInfo.props).toEqual(wrapper.getElement().props);
    });

    it("parses Other components", () => {
        const components: any[] = [
            "div",
            ConfigurationComponent,
            () => React.createElement("div", {}, "text")
        ];

        components.map((component) => {
            const wrapper = mount(React.createElement(component));
            const elementInfo = getElementInfo(wrapper.getElement());

            expect(elementInfo.type).toEqual(ElementType.Unknown);
        });
    });
});
