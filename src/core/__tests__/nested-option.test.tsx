import ConfigurationComponent from "../../core/nested-option";
import { mount, React, shallow } from "./setup";
import { TestComponent, Widget, WidgetClass } from "./test-component";

// tslint:disable:max-classes-per-file
class NestedComponent extends ConfigurationComponent<{ a: number }> {
    public static OwnerType = TestComponent;
    public static OptionName = "option";
}

class SubNestedComponent extends ConfigurationComponent<{ d: string }> {
    public static OwnerType = NestedComponent;
    public static OptionName = "subOption";
}

class AnotherSubNestedComponent extends ConfigurationComponent<{ e: string }> {
    public static OwnerType = NestedComponent;
    public static OptionName = "anotherSubOption";
}

class AnotherNestedComponent extends ConfigurationComponent<{ b: string }> {
    public static OwnerType = TestComponent;
    public static OptionName = "anotherOption";
}

class CollectionNestedComponent extends ConfigurationComponent<{ c?: number, d?: string }> {
    public static IsCollectionItem = true;
    public static OwnerType = TestComponent;
    public static OptionName = "itemOptions";
}

class CollectionSubNestedComponent extends ConfigurationComponent<{ c?: number, d?: string }> {
    public static IsCollectionItem = true;
    public static OwnerType = NestedComponent;
    public static OptionName = "subItemsOptions";
}

class WrongNestedComponent extends ConfigurationComponent<{ x: number }> {
    public static OwnerType = WrongNestedComponent;
    public static OptionName = "optionW";
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
                <WrongNestedComponent x={456} />
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

    it("isn't pulled by wrong parent", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} />
                <WrongNestedComponent x={456} />
            </TestComponent>
        );

        expect(WidgetClass.mock.calls[0][1]).toEqual({
            templatesRenderAsynchronously: true,
            option: {
                a: 123
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
                    <WrongNestedComponent x={456} />
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

    it("isn't pulled by wrong parent", () => {
        mount(
            <TestComponent>
                <NestedComponent a={123} >
                    <SubNestedComponent d={"abc"} />
                    <WrongNestedComponent x={456} />
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
