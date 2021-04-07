import * as events from 'devextreme/events';
import { TemplatesRenderer } from '../templates-renderer';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import {
  fireOptionChange,
  TestComponent,
  // TestPortalComponent,
  Widget,
  WidgetClass,
} from './test-component';

describe('rendering', () => {

  afterEach(() => {
    WidgetClass.mockClear();
    cleanup();
  })
  it('renders correctly', () => {
    const { container } = render(
      <TestComponent />,
    );

    expect((container.firstChild as HTMLElement)?.tagName.toLowerCase()).toBe('div');
  });

  it.only('renders component without children correctly', () => {
    const ref = React.createRef() as React.RefObject<HTMLDivElement>;
    const { container } = render(
      <TestComponent >
        <div ref={ref} />
      </TestComponent>,
    );

    const content: ChildNode|undefined = container.firstChild?.childNodes[0];
    expect(container.firstChild?.contains(TemplatesRenderer as unknown as Node)).toBe(true);

    // expect(content.length).toBe(1);
    expect((content as HTMLElement)?.tagName.toLowerCase()).toBe('div');

    console.log(content?.hasChildNodes())
    // expect(content?.querySelectorAll().length).toBe(1);
    // expect(content?.contains(TemplatesRenderer)).toBe(true);
  });

  // it('renders component with children correctly', () => {
  //   const component = render(
  //     <TestComponent>
  //       <TestComponent />
  //     </TestComponent>,
  //   );

  //   expect(component.children().length).toBe(1);
  //   expect(component.childAt(0).type()).toBe('div');

  //   const content = component.childAt(0);

  //   expect(content.children().length).toBe(2);
  //   expect(content.find(TestComponent).exists()).toBe(true);
  //   expect(content.find(TemplatesRenderer).exists()).toBe(true);
  // });

  // it('renders portal component without children correctly', () => {
  //   const component = render(
  //     <TestPortalComponent />,
  //   );

  //   expect(component.children().length).toBe(1);
  //   expect(component.childAt(0).type()).toBe('div');

  //   const content = component.childAt(0);

  //   expect(content.children().length).toBe(1);
  //   expect(content.find(TemplatesRenderer).exists()).toBe(true);
  // });

  // it('renders portal component with children correctly', () => {
  //   const component = render(
  //     <TestPortalComponent>
  //       <TestComponent />
  //     </TestPortalComponent>,
  //   );

  //   expect(component.children().length).toBe(2);
  //   expect(component.childAt(0).type()).toBe('div');
  //   expect(component.childAt(1).name()).toBe('Portal');

  //   const content = component.childAt(0);
  //   const portal = component.childAt(1);

  //   expect(content.children().length).toBe(2);
  //   expect(content
  //     .findWhere((node) => node.type() === 'div' && node.prop('style')?.display === 'none')
  //     .exists()).toBe(true);
  //   expect(content.find(TemplatesRenderer).exists()).toBe(true);

  //   expect(portal.children().length).toBe(1);
  //   expect(portal.find(TestComponent).exists()).toBe(true);
  // });

it('create widget on componentDidMount', () => {
  render(<TestComponent />)


  expect(WidgetClass.mock.instances.length).toBe(1);
});

it('pass templatesRenderAsynchronously to widgets', () => {
  render(
    <TestComponent />,
  );

  expect(WidgetClass.mock.calls[0][1]).toEqual({ templatesRenderAsynchronously: true });
});

it('creates nested component', () => {
  render(
    <TestComponent>
      <TestComponent />
    </TestComponent>
  )

  expect(WidgetClass.mock.instances.length).toBe(2);
  expect(WidgetClass.mock.instances[1]).toEqual({});
});

it('do not pass children to options', () => {
  render(
    <TestComponent>
      <TestComponent />
    </TestComponent>,
  );

  expect(WidgetClass.mock.calls[1][1].children).toBeUndefined();
});
});

describe('element attrs management', () => {
  it('passes id, className and style to element', () => {
    const { container } = render(
      <TestComponent id="id1" className="class1" style={{ background: 'red' }} />, {
    });

    expect((container.firstChild as HTMLElement).id).toBe('id1');
    expect((container.firstChild as HTMLElement).className).toBe('class1');
    expect((container.firstChild as HTMLElement).style.background).toEqual('red');
  });

  it('updates id, className and style', () => {
    const { container, rerender } = render(
      <TestComponent id="id1" className="class1" style={{ background: 'red' }} />,
    );

    rerender(
      <TestComponent
        id="id2"
        className="class2"
        style={{ background: 'blue' }}
      />,
    );

    expect((container.firstChild as HTMLElement).id).toBe('id2');

    expect((container.firstChild as HTMLElement).className).toBe('class2');
    expect((container.firstChild as HTMLElement).style.background).toEqual('blue');
  });

  it('sets id, className and style after init', () => {
    const { container, rerender } = render(
      <TestComponent />,
    );

    rerender(
      <TestComponent
        id="id1"
        className="class1"
        style={{ background: 'red' }}
      />,
    );

    expect((container.firstChild as HTMLElement).id).toBe('id1');
    expect((container.firstChild as HTMLElement).className).toBe('class1');
    expect((container.firstChild as HTMLElement).style.background).toEqual('red');
  });

  it('cleans className (empty string)', () => {
    const { container, rerender } = render(
      <TestComponent className="class1" />,
    );

    rerender(
      <TestComponent
        className=""
      />,
    );

    expect(container.className).toBe('');
  });

  it('cleans className (undefined)', () => {
    const { container, rerender } = render(
      <TestComponent className="class1" />,
    );

    rerender(<TestComponent />,);

    expect((container.firstChild as HTMLElement).className).toBe('');
  });
});

describe('disposing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  })
  it('call dispose', () => {
    const component = render(
      <TestComponent />,
    );

    component.unmount();

    expect(Widget.dispose).toBeCalled();
  });

  it('fires dxremove', () => {
    const handleDxRemove = jest.fn();
    const { container, unmount } = render(
      <TestComponent />,
    );

    events.on(container.firstChild as HTMLElement, 'dxremove', handleDxRemove);

    unmount();
    expect(handleDxRemove).toHaveBeenCalledTimes(1);
  });

  it('remove option guards', () => {
    const component = render(
      <TestComponent option1 />,
    );

    fireOptionChange('option1', false);
    component.unmount();
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(0);
  });
});
