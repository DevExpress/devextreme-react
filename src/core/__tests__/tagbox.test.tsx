import { mount, React } from './setup';
import { TagBox } from '../../tag-box';

jest.useFakeTimers();

describe('templates', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should change value without an error', () => {
    const container = mount(<TagBox
      dataSource={['1', '2', '3']}
      showClearButton
      value={['1']}
      tagRender={() => <div>test</div>}
    />);
    const node = container.getDOMNode();
    container.setProps({
      value: [1, 2],
    });

    jest.runAllTimers();
    expect(node.getElementsByClassName('dx-tag').length).toBe(2);
  });
});
