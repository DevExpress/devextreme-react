import ConfigurationComponent from "../../core/nested-option";
import { mount, React, shallow } from "./setup";
import { TestComponent, Widget, WidgetClass } from "./test-component";

// tslint:disable:max-classes-per-file
class NestedComponent1 extends ConfigurationComponent<{ a: number }> {
    public static OwnerType = TestComponent;
    public static OptionName = "option1";
}

class NestedComponent2 extends ConfigurationComponent<{ b: string }> {
    public static OwnerType = TestComponent;
    public static OptionName = "option2";
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

it("pulls options from a single nested component", () => {
    mount(
        <TestComponent>
            <NestedComponent1 a={123} />
        </TestComponent>
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
        templatesRenderAsynchronously: true,
        option1: {
            a: 123
        }
    });
});

it("doesn't pull options from wrong component", () => {
    mount(
        <TestComponent>
            <NestedComponent1 a={123} />
            <WrongNestedComponent x={456} />
        </TestComponent>
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
        templatesRenderAsynchronously: true,
        option1: {
            a: 123
        }
    });
});

it("pulls overriden options from the same nested component", () => {
    mount(
        <TestComponent>
            <NestedComponent1 a={123} />
            <NestedComponent1 a={456} />
        </TestComponent>
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
        templatesRenderAsynchronously: true,
        option1: {
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
            <NestedComponent1 a={123} />
            <WrongNestedComponent x={456} />
            <NestedComponent2 b="abc" />
        </TestComponent>
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
        templatesRenderAsynchronously: true,
        option1: {
            a: 123
        },
        option2: {
            b: "abc"
        }
    });
});

it("pulls updated options", () => {

    const component = shallow(
        <TestComponent>
            <NestedComponent1 a={123} />
        </TestComponent>
    );
    const nested = component.find(NestedComponent1).dive();

    nested.setProps({ a: 456 });
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(["option1.a", 456]);
});
