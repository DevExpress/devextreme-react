import ConfigurationComponent from "../../../core/nested-option";
import { mount, React } from "../../__tests__/setup";
import { IOptionNodeDescriptor } from "../option-node";
import { ReactOptionNode } from "../react-option-node";

// tslint:disable:max-classes-per-file
class MinimalConfigurationComponent extends ConfigurationComponent<any> {
    public static OptionName = "option";
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

describe("ReactOptionNode.GetDescriptor()", () => {
    it("returns descriptor", () => {
        const components: any[] = [
            MinimalConfigurationComponent,
            RichConfigurationComponent,
            CollectionConfigurationComponent
        ];

        components.map((component) => {
            const wrapper = mount(React.createElement(component));

            const optionNode = new ReactOptionNode(wrapper.getElement());
            const descriptor = optionNode.GetDescriptor() as any as IOptionNodeDescriptor;

            expect(descriptor.name).toEqual(component.OptionName);
            expect(descriptor.isCollection).toEqual(component.IsCollectionItem);
            expect(descriptor.templates).toEqual(component.TemplateProps);
            expect(descriptor.initialValueProps).toEqual(component.DefaultsProps);
            expect(descriptor.predefinedValues).toEqual(component.PredefinedProps);
        });
    });

    it("returns null", () => {
        const components: any[] = [
            "div",
            ConfigurationComponent,
            () => <div>text</div>
        ];

        components.map((component) => {
            const wrapper = mount(React.createElement(component));

            const optionNode = new ReactOptionNode(wrapper.getElement());
            const descriptor = optionNode.GetDescriptor() as any as IOptionNodeDescriptor;

            expect(descriptor).toEqual(null);
        });
    });
});

describe("ReactOptionNode.GetValues()", () => {
    it("returns props", () => {
        const props = {id: 1, name: "text"};

        const wrapper = mount(
            React.createElement(MinimalConfigurationComponent, props)
        );

        const optionNode = new ReactOptionNode(wrapper.getElement());
        const values = optionNode.GetValues();
        expect(values).toEqual(props);
    });

    it("returns empty props", () => {
        const wrapper = mount(
            React.createElement(MinimalConfigurationComponent)
        );

        const optionNode = new ReactOptionNode(wrapper.getElement());
        const values = optionNode.GetValues();
        expect(values).toEqual({});
    });
});

describe("ReactOptionNode.GetChildren()", () => {
    it("returns children", () => {
        const children = [
            React.createElement(MinimalConfigurationComponent),
            React.createElement("div"),
            "some string"
        ];

        const wrapper = mount(
            React.createElement(MinimalConfigurationComponent, null, ...children)
        );

        const optionNode = new ReactOptionNode(wrapper.getElement());
        optionNode.GetChildren().map((childNode, index) => {
            expect((childNode as any)._node).toEqual(children[index]);
        });
    });

    it("returns empty children", () => {
        const wrapper = mount(
            React.createElement(MinimalConfigurationComponent)
        );

        const optionNode = new ReactOptionNode(wrapper.getElement());
        const children = optionNode.GetChildren();
        expect(children).toEqual([]);
    });
});
