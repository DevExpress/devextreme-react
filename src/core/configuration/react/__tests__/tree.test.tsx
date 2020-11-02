import * as React from 'react';
import { ElementType, IOptionElement } from '../element';
import { buildConfigTree, processChildren } from '../tree';

function createEmptyParentElementWithChildren(children: Array<any>):IOptionElement {
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
  it('process empty', () => {
    const childrenData = processChildren(createEmptyParentElementWithChildren([]), '');
    expect(childrenData).toEqual({
      configs: {},
      configCollections: {},
      templates: [],
      hasTranscludedContent: false,
    });
  });
  it('process transcluded content', () => {
    const childrenData = processChildren(createEmptyParentElementWithChildren([
      <>{null}</>,
    ]), '');
    expect(childrenData).toEqual({
      configs: {},
      configCollections: {},
      templates: [],
      hasTranscludedContent: true,
    });
  });
  it('process unintendent content', () => {
    const childrenData = processChildren(createEmptyParentElementWithChildren([
      null, undefined, 'str', 25, false, true,
    ]), '');
    expect(childrenData).toEqual({
      configs: {},
      configCollections: {},
      templates: [],
      hasTranscludedContent: false,
    });
  });
});

describe('buildConfigTree', () => {
  it('builds empty config tree', () => {
    const config = buildConfigTree(
      {
        templates: [],
        initialValuesProps: {},
        predefinedValuesProps: {},
        expectedChildren: {},
      },
      { },
    );
    expect(config).toEqual({
      fullName: '',
      predefinedOptions: {},
      initialOptions: {},
      options: {},
      templates: [],
      configs: {},
      configCollections: {},
    });
  });
});
