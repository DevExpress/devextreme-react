import * as React from 'react';

import Accordion from '../src/accordion';

import Example from './example-block';

interface IAccordionItemProps {
  text: string;
  title: string;
}

const items: IAccordionItemProps[] = [
  { text: '123', title: 'title123' },
  { text: '234', title: 'title234' },
  { text: '567', title: 'title567' },
];

const ItemTitle = (data: IAccordionItemProps) => <div style={{height: 100}}>{data.title}</div>;

export default class extends React.Component<any, any> {
  public render() {
    return (
            <Example title="DxAccordion" >
                <hr />
                <h4>Simple Accordion</h4>
                <Accordion
                    items={items}
                />
                <hr />
                <h4>Accordion with itemTitleRender</h4>
                <Accordion
                    collapsible={true}
                    items={items}
                    itemTitleRender={ItemTitle}
                />
            </Example>
    );
  }
}
