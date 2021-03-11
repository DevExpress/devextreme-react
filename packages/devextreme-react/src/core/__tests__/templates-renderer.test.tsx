/* eslint-disable max-classes-per-file */
import { requestAnimationFrame } from 'devextreme/animation/frame';
import { deferUpdate } from 'devextreme/core/utils/common';
import { React, mount } from './setup';
import { TemplatesRenderer } from '../templates-renderer';
import { TemplatesStore } from '../templates-store';

global.console.warn = (message) => {
  throw message;
};

global.console.error = (message) => {
  throw message;
};

jest.mock('devextreme/animation/frame', () => ({
  requestAnimationFrame: jest.fn(),
}));

jest.mock('devextreme/core/utils/common', () => ({
  deferUpdate: jest.fn(),
}));

describe('useDeferUpdate ==$(value)', () => {
  let updateFunc;

  [true, false].forEach((value) => {
    beforeEach(() => {
      (deferUpdate as jest.Mock).mockImplementation((func) => {
        updateFunc = func;
      });

      (requestAnimationFrame as jest.Mock).mockImplementation((func) => {
        updateFunc = func;
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not throw warning when unmounted', async () => {
      const ref = React.createRef<TemplatesRenderer>();
      const templatesStore = new TemplatesStore(() => { });

      const component = mount(<TemplatesRenderer templatesStore={templatesStore} ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(() => ref.current?.scheduleUpdate(value)).not.toThrow();

      expect(() => updateFunc()).not.toThrow();

      component.unmount();
      expect(ref.current).toBeNull();

      expect(() => updateFunc()).not.toThrow();
    });

    it('should work deferUpdate && requestAnimationFrame', async () => {
      const ref = React.createRef<TemplatesRenderer>();
      const templatesStore = new TemplatesStore(() => { });

      mount(<TemplatesRenderer templatesStore={templatesStore} ref={ref} />);
      expect(() => ref.current?.scheduleUpdate(value)).not.toThrow();

      if (value) {
        expect(deferUpdate).toHaveBeenCalledTimes(1);
      } else {
        expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
      }
    });

    it('should not call twice', async () => {
      const ref = React.createRef<TemplatesRenderer>();
      const templatesStore = new TemplatesStore(() => { });

      mount(<TemplatesRenderer templatesStore={templatesStore} ref={ref} />);
      ref.current?.scheduleUpdate(value);
      expect(updateFunc).toHaveBeenCalledTimes(1);

      ref.current?.scheduleUpdate(value);
      expect(updateFunc).toHaveBeenCalledTimes(0);
    });
  });
});
