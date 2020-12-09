import { IProp } from 'tools/integration-data-model';
import { collectSubscribableRecursively } from './generator';

describe('collectSubscribableRecursively', () => {
  it('subscribable options', () => {
    const options: IProp[] = [{
      name: 'option1',
      isSubscribable: true,
      types: [],
    }, {
      name: 'option2',
      isSubscribable: false,
      types: [],
    }, {
      name: 'option3',
      isSubscribable: true,
      types: [],
    }];

    expect(collectSubscribableRecursively(options)).toEqual([{
      name: 'option1',
      isSubscribable: true,
      types: [],
    }, {
      name: 'option3',
      isSubscribable: true,
      types: [],
    }]);
  });

  it('subscribable nested options', () => {
    const options: IProp[] = [{
      name: 'option1',
      isSubscribable: false,
      types: [],
      props: [{
        name: 'subOption',
        isSubscribable: true,
        types: [],
      }],
    }, {
      name: 'option2',
      isSubscribable: true,
      types: [],
      props: [{
        name: 'subOption',
        isSubscribable: true,
        types: [],
      }],
    }];

    expect(collectSubscribableRecursively(options)).toEqual([{
      name: 'option1.subOption',
      isSubscribable: true,
      types: [],
    }, {
      name: 'option2',
      isSubscribable: true,
      types: [],
      props: [{
        name: 'subOption',
        isSubscribable: true,
        types: [],
      }],
    }, {
      name: 'option2.subOption',
      isSubscribable: true,
      types: [],
    }]);
  });
});
