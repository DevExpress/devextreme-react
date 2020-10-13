import config, { getOption } from '../../core/config';
import { mount, React } from './setup';
import { TestComponent, WidgetClass } from './test-component';

class ComponentWithTemplates extends TestComponent {
  protected _templateProps = [{
    tmplOption: 'item',
    render: 'itemRender',
    component: 'itemComponent',
    keyFn: 'itemKeyFn',
  }];

  constructor(props: any) {
    super(props);
  }
}

describe('useLegacyTemplateEngine', () => {
  const originalValue = getOption('useLegacyTemplateEngine');

  beforeEach(() => {
    config({ useLegacyTemplateEngine: true });
  });

  afterEach(() => {
    config({ useLegacyTemplateEngine: originalValue });
  });

  it('works for render-function template', () => {
    const ItemTemplate = (data: any) => (
      <div className="template">
        value:
        {' '}
        {data.value}
        , key:
        {' '}
        {data.key}
        , dxkey:
        {' '}
        {data.dxkey}
      </div>
    );

    const component = mount(
      <ComponentWithTemplates itemRender={ItemTemplate} />,
    );

    const render = WidgetClass.mock.calls[0][1].integrationOptions.templates.item.render;

    render({
      container: document.createElement('div'),
      model: { value: 'Value', key: 'key_1' },
    });

    component.update();
    expect(component.find('.template').text()).toBe('value: Value, key: key_1, dxkey: key_1');
  });

  it('works for component template', () => {
    const ItemTemplate = (props: any) => (
      <div className="template">
        value:
        {' '}
        {props.value}
        , dxkey:
        {' '}
        {props.dxkey}
      </div>
    );

    const component = mount(
      <ComponentWithTemplates itemComponent={ItemTemplate} />,
    );

    const render = WidgetClass.mock.calls[0][1].integrationOptions.templates.item.render;

    render({
      container: document.createElement('div'),
      model: { value: 'Value', key: 'key_1' },
    });

    component.update();
    expect(component.find('.template').text()).toBe('value: Value, dxkey: key_1');
  });
});
