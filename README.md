# DevExtreme React UI and Visualization Components #

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [React Components](https://reactjs.org).

* [Getting started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Install DevExtreme](#installation)
  * [Import DevExtreme Components](#import-components)
* [State Management](#state-management)
  * [Controlled Mode](#controlled-mode)
  * [Uncontrolled Mode](#uncontrolled-mode)
  * [Getting Widget Instance](#getting-widget-instance)
* [Markup Customization](#markup-customization)
* [Working With Data](#working-with-data)
* [Typescript](#typescript)
* [API Reference](#api-reference)
* [License](#license)
* [Support & feedback](#support-feedback)


## <a name="getting-started"></a>Getting Started ##

### <a name="prerequisites"></a>Prerequisites ###
[Node.js and npm](https://docs.npmjs.com/getting-started/installing-node) are required

### <a name="installation"></a>Install DevExtreme ####

Install the **devextreme** and **devextreme-react** npm packages:

```console
npm install --save devextreme@18.1-unstable devextreme-react
```

### <a name="import-components"></a>Import DevExtreme Components  ####

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

ReactDOM.render(
    <Button text='Example Button' />,
    document.getElementById('root')
);
```

Note that one of the [predefined themes](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/) is required.


## <a name="state-management"></a>State Management ##

DevExtreme React components support both [Controlled](https://reactjs.org/docs/forms.html#controlled-components) and [Uncontrolled](https://reactjs.org/docs/uncontrolled-components.html) state modes.

### <a name="controlled-mode"></a>Controlled Mode ###

In the controlled mode, a component state is passed via its props by its parent component. This mode provides the following capabilities:
- Keep UI up to date when modifying a component state from code
- Share state between components in your app
- Persist and restore state

To control component state, provide the value for the required property and handle the event fired when it is changed (use the appropriate property with the `on` prefix):

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { TextBox } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

class Example extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: 'TEXT'
        };

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div>
                <TextBox
                    value={this.state.text}
                    onValueChanged={this.handleChange}
                    valueChangeEvent='input'
                />
                <div>{this.state.text}</div>
            </div>
        );
    }

    handleChange(e) {
        this.setState({
            text: e.value.toUpperCase().replace('A','_')
        });
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```

### <a name="uncontrolled-mode"></a>Uncontrolled Mode ###

Sometimes there is no need to handle all the component updates, thus DevExtreme components can manage their state internally. This helps you write less code and focus on your application business logic.

Note that if you want to specify an initial value for an option in the uncontrolled mode, you should use appropriate property with the `default` prefix. In the example below the `currentView` option's initial value is defined using the `defaultCurrentView` property.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Scheduler } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
const appointments = [
    {
        text: 'Website Re-Design Plan',
        startDate: new Date(2017, 4, 22, 9, 30),
        endDate: new Date(2017, 4, 22, 11, 30)
    }, {
        text: 'Book Flights to San Fran for Sales Trip',
        startDate: new Date(2017, 4, 22, 12, 0),
        endDate: new Date(2017, 4, 22, 13, 0),
        allDay: true
    }, {
        text: 'Install New Router in Dev Room',
        startDate: new Date(2017, 4, 23, 10, 30),
        endDate: new Date(2017, 4, 23, 16, 30)
    }
];


ReactDOM.render(
    <Scheduler
        dataSource={appointments}
        height={600}
        editing={false}
        defaultCurrentView={'week'}
        defaultCurrentDate={new Date(2017, 4, 22)}
        startDayHour={9}
    />,
    document.getElementById('root')
);
```


### <a name="getting-widget-instance"></a>Getting Widget Instance ###
In some cases when you need to call a widget method a widget instance is required. You can get it by assigning of a callback function to the component's `ref` property. This function accepts the mounted DevExtreme Component as an argument, whose `instance` property holds the widget instance.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Button, TextBox } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

class Example extends React.Component {

    render() {
        return (
            <div>
                <TextBox ref={(ref) => this.textBox = ref.instance}/>
                <Button text='Go to the TextBox' onClick={() => this.textBox.focus()} />
            </div>
        );
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```

## <a name="markup-customization"></a>Markup Customization
You can customize widget elements' appearance via the appropriate template properties. A template could be specified as a rendering function or as a React component.

Use an option with the `Render` suffix to specify a rendering function:
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { List } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

const items = [
    { text: '123' },
    { text: '234' },
    { text: '567' }
];


ReactDOM.render(
    <List items={items} itemRender={(item) => <i>Function template for item <b>{item.text}</b></i>}/>,
    document.getElementById('root')
);
```


The template component can be specified using an option with the `Component` suffix:
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { List } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

const items = [
    { text: '123' },
    { text: '234' },
    { text: '567' }
];

class Item extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            counter: 0
        };

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
            <i onClick={this.handleClick}>
                Component template for item {this.props.text}. <b>Clicks: {this.state.counter}</b>
            </i>
        );
    }

    handleClick() {
        this.setState({
            counter: this.state.counter + 1
        });
    }
}

ReactDOM.render(
    <List items={items} itemComponent={Item} />,
    document.getElementById('root')
);
```

The components that display content in an overlaying window (e.g. [ScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/)), allow to specify the content as component children:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Button, ScrollView } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

class Example extends React.Component {

    render() {
        return (
            <ScrollView height={200} width={200}>
                <Button text='Show alert' onClick={() => alert('shown')} />
                <br />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, eveniet tempore, perspiciatis totam qui est minima
                    dicta beatae dolores, omnis enim ut incidunt. Ut reprehenderit, tempore iusto deserunt doloremque fugit. Sint natus
                    quia repellendus cum neque.
                </p>
                <p>
                    Velit similique dicta corrupti nesciunt quas ea quam minima, aliquid qui ratione suscipit
                    magnam molestiae aspernatur iure, tenetur sapiente voluptates laborum quidem nisi molestias. Id, nesciunt adipisci
                    sint. Doloribus minima expedita, soluta. Eveniet reiciendis eius ducimus provident autem amet alias quis natus. In
                    veritatis, repellendus laborum illo voluptates est quis consectetur consequuntur reiciendis rem! In cum, ipsum ratione
                    beatae odio officia doloribus ullam magnam impedit repudiandae odit, vero!
                </p>
            </ScrollView>
        );
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```


## <a name="working-with-data"></a>Working with Data ##
DevExtreme includes the [data layer](https://js.devexpress.com/Documentation/Guide/Data_Layer/Data_Layer/), that enables you to read and write data stored in different data sources.

The example below demonstrates how to use [DataSource](https://js.devexpress.com/Documentation/ApiReference/Data_Layer/DataSource/) with DevExtreme Components.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import DataSource from 'devextreme/data/data_source';
import { List } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

const items = [
    { text: '123' },
    { text: '234' },
    { text: '567' }
];

class Example extends React.Component {

    constructor(props) {
        super(props);

        this.dataSource = new DataSource({
            store: {
                type: 'array',
                data: items
            },
            sort: [
                { getter: 'text', desc: true }
            ],
            pageSize: 1
        });
    }

    render() {
        return (
            <List dataSource={this.dataSource} />
        );
    }

    componentWillUnmount() {
        this.dataSource.dispose();
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```

Note that a DataSource is considered as a 'service'. So, modifying its properties does not cause component rerendering.


## <a name="typescript"></a>Typescript ##

Strict typing allows you to catch a lot of bugs and improve your workflow by adding features like auto-completion and automated refactoring. This is why we provide TypeScript declarations for the DevExtreme Components.

Here is an example of appearance customization with using TypeScript:

```ts
import * as React from "react";
import * as ReactDOM from "react-dom";
import { List } from "devextreme-react";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

interface IListItemProps {
    text: string;
}

class Item extends React.Component<IListItemProps, { counter: number }> {

    constructor(props: IListItemProps) {
        super(props);
        this.state = {
            counter: 0
        };

        this.handleClick = this.handleClick.bind(this);
    }

    public render() {
        return (
            <i onClick={this.handleClick}>
                Component template for item {this.props.text}. <b>Clicks: {this.state.counter}</b>
            </i>
        );
    }

    private handleClick() {
        this.setState({
            counter: this.state.counter + 1
        });
    }
}

const items: IListItemProps[] = [
    { text: "123" },
    { text: "234" },
    { text: "567" }
];

ReactDOM.render(
    <List items={items} itemComponent={Item} />,
    document.getElementById("root")
);
```


## <a name="api-reference"></a>API Reference ##

Each DevExtreme React component supports the same configuration and API as the corresponding DevExtreme widget. See [DevExtreme API Reference](http://js.devexpress.com/Documentation/ApiReference/).
Templates can be implemented and applied in a more convenient React way, see [Markup Customization](#markup-customization).


## <a name="license"></a>License ##

**DevExtreme React components are released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

Familiarize yourself with the [DevExtreme License](https://js.devexpress.com/Licensing/).

[Free trial is available!](http://js.devexpress.com/Buy/)

## <a name="support-feedback"></a>Support & Feedback ##
* For general React questions, check [React Docs](https://reactjs.org/docs)
* For questions regarding DevExtreme libraries and widgets API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
