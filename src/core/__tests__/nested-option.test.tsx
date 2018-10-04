import ConfigurationComponent from "../../core/nested-option";
import { mount, React, shallow } from "./setup";
import { TestComponent, Widget, WidgetClass } from "./test-component";

// tslint:disable:max-classes-per-file
class NestedComponent extends ConfigurationComponent<{ a: number }> {
    public static OptionName = "option";
}

class NestedComponentWithPredfeinedProps extends ConfigurationComponent<{ a: number }> {
    public static OptionName = "option";
    public static PredefinedProps = {
        predefinedProp: "predefined-value"
    };
}

class CollectionNestedWithPredfeinedProps1 extends ConfigurationComponent<{ a: number }> {
    public static IsCollectionItem = true;
    public static OptionName = "option";
    public static PredefinedProps = {
        predefinedProp: "predefined-value-1"
    };
}

class CollectionNestedWithPredfeinedProps2 extends ConfigurationComponent<{ a: number }> {
    public static IsCollectionItem = true;
    public static OptionName = "option";
    public static PredefinedProps = {
        predefinedProp: "predefined-value-2"
    };
}

class SubNestedComponent extends ConfigurationComponent<{ d: string }> {
    public static OptionName = "subOption";
}

class AnotherSubNestedComponent extends ConfigurationComponent<{ e: string }> {
    public static OptionName = "anotherSubOption";
}

class AnotherNestedComponent extends ConfigurationComponent<{ b: string }> {
    public static OptionName = "anotherOption";
}

class CollectionNestedComponent extends ConfigurationComponent<{ c?: number, d?: string }> {
    public static IsCollectionItem = true;
    public static OptionName = "itemOptions";
}

class CollectionSubNestedComponent extends ConfigurationComponent<{ c?: number, d?: string }> {
    public static IsCollectionItem = true;
    public static OptionName = "subItemsOptions";
}

// tslint:enable:max-classes-per-file

describe("nested option", () => {

    it("is pulled", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option: {
                a: 123
            }
        });
    });

    it("is pulled (several options)", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} />
                <AnotherNestedComponent b="abc" />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option: {
                a: 123
            },
            anotherOption: {
                b: "abc"
            }
        });
    });

    it("is pulled overriden if not a collection item", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} />
                <NestedComponent a={456} />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option: {
                a: 456
            }
        });
    });

    it("is pulled as a collection item", () => {
        mount(
            <TestComponent>
                <CollectionNestedComponent c={123} d="abc" />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            itemOptions: [
                { c: 123, d: "abc" }
            ]
        });
    });

    it("is pulled as a collection item (several items)", () => {
        mount(
            <TestComponent>
                <CollectionNestedComponent c={123} d="abc" />
                <CollectionNestedComponent c={456} />
                <CollectionNestedComponent d="def" />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            itemOptions: [
                { c: 123, d: "abc" },
                { c: 456 },
                { d: "def" }
            ]
        });
    });

    it("is pulled with predefined props", () => {
        mount(
            <TestComponent>
                <NestedComponentWithPredfeinedProps a={123} />
            </TestComponent>
        );

        const actualProps = WidgetClass.mock.calls[0][1];
        expect(actualProps.option).toHaveProperty("predefinedProp");
        expect(actualProps.option.predefinedProp).toBe("predefined-value");
    });

    it("is pulled with predefined props (several)", () => {
        mount(
            <TestComponent>
                <CollectionNestedWithPredfeinedProps1 a={123} />
                <CollectionNestedWithPredfeinedProps2 a={456} />
            </TestComponent>
        );

        const actualProps = WidgetClass.mock.calls[0][1];
        expect(actualProps.option).toEqual([
            { predefinedProp: "predefined-value-1", a: 123 },
            { predefinedProp: "predefined-value-2", a: 456 }
        ]);
    });

    it("is pulled as a collection item after update", () => {
        const component = mount(
            <TestComponent>
                <CollectionNestedComponent key={1} c={123} d="abc" />
                <CollectionNestedComponent key={2} c={456} />
                <CollectionNestedComponent key={3} d="def" />
            </TestComponent>
        );
        component.setProps({
            children: [
                <CollectionNestedComponent key={1} c={123} d="abc" />,
                <CollectionNestedComponent key={2} c={999} />,
                <CollectionNestedComponent key={3} d="def" />
            ]});
        jest.runAllTimers();

        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual(["itemOptions[1].c", 999]);
    });

    it("is pulled after update", () => {

        const component = shallow(
            <TestComponent>
                <NestedComponent a={123} />
            </TestComponent>
        );
        const nested = component.find(NestedComponent).dive();

        nested.setProps({ a: 456 });
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual(["option.a", 456]);
    });

    it("is pulled after update without rubbish", () => {

        const component = mount(
            <TestComponent>
                <NestedComponent a={123} />
            </TestComponent>
        );

        component.setProps({ children: <NestedComponent a={456} />});
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual(["option.a", 456]);
    });

});

describe("nested sub-option", () => {

    it("is pulled", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} >
                    <SubNestedComponent d={"abc"} />
                </NestedComponent>
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option: {
                a: 123,
                subOption: {
                    d: "abc"
                }
            }
        });
    });

    it("is pulled (several options)", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} >
                    <SubNestedComponent d={"abc"} />
                    <AnotherSubNestedComponent e={"def"} />
                </NestedComponent>
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option: {
                a: 123,
                subOption: {
                    d: "abc"
                },
                anotherSubOption: {
                    e: "def"
                }
            }
        });
    });

    it("is pulled overriden if not a collection item", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} >
                    <SubNestedComponent d={"abc"} />
                    <SubNestedComponent d={"def"} />
                </NestedComponent>
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option: {
                a: 123,
                subOption: {
                    d: "def"
                }
            }
        });
    });

    it("is pulled as a collection item", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} >
                    <CollectionSubNestedComponent c={123} d={"abc"} />
                </NestedComponent>
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option: {
                a: 123,
                subItemsOptions: [
                    { c: 123, d: "abc" }
                ]
            }
        });
    });

    it("is pulled as a collection item (several items)", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} >
                    <CollectionSubNestedComponent c={123} d="abc" />
                    <CollectionSubNestedComponent c={456} />
                    <CollectionSubNestedComponent d="def" />
                </NestedComponent>
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option: {
                a: 123,
                subItemsOptions: [
                    { c: 123, d: "abc" },
                    { c: 456 },
                    { d: "def" }
                ]
            }
        });
    });

    it("is pulled as a collection item after update inside another option", () => {
        const component = mount(
            <TestComponent>
                <NestedComponent a={123} >
                    <CollectionSubNestedComponent key={1} c={123} d="abc" />
                    <CollectionSubNestedComponent key={2} c={456} />
                    <CollectionSubNestedComponent key={3} d="def" />
                </NestedComponent>
            </TestComponent>
        );
        component.setProps({
            children: (
                <NestedComponent a={123} >
                    <CollectionSubNestedComponent key={1} c={123} d="abc" />
                    <CollectionSubNestedComponent key={2} c={999} />
                    <CollectionSubNestedComponent key={3} d="def" />
                </NestedComponent>
            )
        });
        jest.runAllTimers();

        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual(["option.subItemsOptions[1].c", 999]);
    });

    it("is pulled after update", () => {

        const component = shallow(
            <TestComponent>
                <NestedComponent a={123} >
                    <SubNestedComponent d={"abc"} />
                </NestedComponent>
            </TestComponent>
        );
        const nested = component.find(NestedComponent).dive();
        const subNested = nested.find(SubNestedComponent).dive();

        subNested.setProps({ d: "def" });
        jest.runAllTimers();
        expect(Widget.option.mock.calls.length).toBe(1);
        expect(Widget.option.mock.calls[0]).toEqual(["option.subOption.d", "def"]);
    });
});
