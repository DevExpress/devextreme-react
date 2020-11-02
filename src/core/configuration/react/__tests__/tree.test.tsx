import * as React from 'react';
import { ElementType, IOptionElement } from '../element';
import { processChildren } from '../tree';

function createElementWithChildren(children: Array<any>):IOptionElement {
  return {
    type: ElementType.Option,
    descriptor: {
      isCollection: false,
      name: '',
      templates: [
        {
          tmplOption: 'template',
          component: 'component',
          render: 'render',
          keyFn: 'keyFn',
        },
      ],
      initialValuesProps: {},
      predefinedValuesProps: {},
      expectedChildren: {},
    },
    props: {
      children,
    },
  };
}

describe('processChildren', () => {
  describe('test transcluded content handling', () => {
    it('process empty', () => {
      const childrenData = processChildren(createElementWithChildren([]), '');
      expect(childrenData.hasTranscludedContent).toEqual(false);
    });
    it('process transcluded content', () => {
      const childrenData = processChildren(createElementWithChildren([
        <>{null}</>,
      ]), '');
      expect(childrenData.hasTranscludedContent).toEqual(true);
    });
    it('process unintendent content', () => {
      const childrenData = processChildren(createElementWithChildren([
        null, undefined, 'str', 25, false, true,
      ]), '');
      expect(childrenData.hasTranscludedContent).toEqual(false);
    });
  });
});
