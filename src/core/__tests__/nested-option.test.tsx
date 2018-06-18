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

class AnotherNestedComponent extends ConfigurationComponent<{ b: string }> {
    public static OwnerType = TestComponent;
    public static OptionName = "anotherOption";
}

class CollectionNestedComponent extends ConfigurationComponent<{ c?: number, d?: string }> {
    public static IsCollectionItem = true;
    public static OwnerType = TestComponent;
    public static OptionName = "itemOptions";
}

class WrongNestedComponent extends ConfigurationComponent<{ x: number }> {
    public static OwnerType = WrongNestedComponent;
    public static OptionName = "optionW";
}
// tslint:enable:max-classes-per-file

it("pulls options from a sub-nested component", () => {
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

it("doesn't pull options from wrong component", () => {
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

it("pulls overriden options from the same nested component", () => {
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

it("pulls array options from a nested component", () => {
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

it("pulls array options from several nested components", () => {
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

it("pulls options from several nested components", () => {
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

it("pulls updated options", () => {

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
