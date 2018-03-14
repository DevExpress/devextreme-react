# DevExtreme React UI and Visualization Components #

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [React Components](https://reactjs.org).

* [Getting started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Install DevExtreme](#installation)
  * [Import DevExtreme Components](#import-components)
* [API Reference](#api-reference)
* [State Management](#state-management)
  * [Handle Change](#handle-change)
  * [Control Change](#control-change)
  * [Getting Widget Instance](#getting-widget-instance)
* [Appearance Customization](#appearance-customization)
* [Working With Data](#working-with-data)
* [Strict Typing](#strict-typing)
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


## <a name="api-reference"></a>API Reference ##

Each DevExtreme React component supports the same configuration and API as the corresponding DevExtreme widget. See [DevExtreme API Reference](http://js.devexpress.com/Documentation/ApiReference/).


## <a name="state-management"></a>State Management ##

Both [Controlled mode](https://reactjs.org/docs/forms.html#controlled-components) and [Uncontrolled mode](https://reactjs.org/docs/uncontrolled-components.html) are supported.

In the controlled mode, a component state is managed externally (for example, in the parent component).
This mode allows you to:
- Keep UI up to date when modifying a component state from other application parts
- Share a component state with other components in your app
- Persist and restore state when required

In the uncontrolled mode, a DevExtreme component manages its state internally. This helps you write less code and focus on your application business logic. In this case, you can interact with the component via the underlying widget instance.

### <a name="handle-change"></a>Handle Change ###

You can leave updates uncontrolled and just get notified when component changed by assigning of a callback function to an attribute with the `on` prefix:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { TextBox } from 'devextreme-react';

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

class Example extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: 'inital text'
        };

        this.update = this.update.bind(this);
    }

    render() {
        return (
            <div>
                <TextBox
                    defaultValue={'inital text'}
                    onValueChanged={this.update}
                    valueChangeEvent="input"
                />
                <div>{this.state.text}</div>
            </div>
        );
    }

    update(e) {
        this.setState({
            text: e.component.option('value')
        });
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```

Note that if you want to specify an initial value for an option in the uncontrolled mode, you should use appropriate attribute with the `default` prefix. In the example below the `value` option's initial value is defined using the `defaultValue` attribute.

### <a name="control-change"></a>Control Change ###

If you need to control how a component changes its state, you required to provide a property value and handle the appropriate event fired when this property is changed:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { TextBox } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

class Example extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            text: 'inital text'
        };
    }

    render() {
        return (
            <div>
                <TextBox
                    value={this.state.text}
                    onValueChanged={this.handleChange}
                    valueChangeEvent='keyup'
                />
                <div>{this.state.text}</div>
            </div>
        );
    }

    handleChange(e) {
        this.setState({
            text: e.value
        });
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```

### <a name="getting-widget-instance"></a>Getting Widget Instance ###
You can get a widget instance by assigning of a callback function to the component's `ref` attribute. This function accepts the mounted DevExtreme Component as an argument, whose `instance` property holds the widget instance.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { TextBox } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

class Example extends React.Component {

    render() {
        return (
            <TextBox ref={(ref) => this.textBox = ref.instance} />
        );
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```

## <a name="appearance-customization"></a>Appearance Customization
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
    <List items={items} itemRender={(it) => <i>Function template for item <b>{it.text}</b></i>}/>,
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

        this.clickHandler = this.clickHandler.bind(this);

        this.state = {
            counter: 0
        };
    }

    render() {
        return (
            <i onClick={this.clickHandler}>
                Component template for item {this.props.text}. <b>Clicks: {this.state.counter}</b>
            </i>
        );
    }

    clickHandler() {
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

The components that display content in an overlaying window (e.g. [Popup](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxPopup/)), allow to specify the content markup directly in the component container (nested components are supported):

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Popup } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

ReactDOM.render(
    <Popup visible={true}>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, eveniet tempore, perspiciatis totam qui est minima dicta beatae dolores, omnis enim ut incidunt. Ut reprehenderit, tempore iusto deserunt doloremque fugit.</p>
        <p>Sint natus quia repellendus cum neque. Velit similique dicta corrupti nesciunt quas ea quam minima, aliquid qui ratione suscipit magnam molestiae aspernatur iure, tenetur sapiente voluptates laborum quidem nisi molestias.</p>
        <p>Id, nesciunt adipisci sint. Doloribus minima expedita, soluta. Eveniet reiciendis eius ducimus provident autem amet alias quis natus. In veritatis, repellendus laborum illo voluptates est quis consectetur consequuntur reiciendis rem!</p>
        <p>In cum, ipsum ratione beatae odio officia doloribus ullam magnam impedit repudiandae odit, vero! Minus quisquam earum aliquam tempore iusto consequatur modi laborum facilis dolorum! Earum, exercitationem error. Placeat, optio!</p>
    </Popup>,
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
                type: "array",
                data: items
            },
            sort: [
                { getter: "text", desc: true }
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


## <a name="strict-typing"></a>Strict Typing ##

Strict typing allows you to catch a lot of bugs and improve your workflow by adding features like auto-completion and automated refactoring. This is why we provide TypeScript declarations for the DevExtreme Components.

Here is an example of appearance customization with using TypeScript:

```ts
import * as React from "react";
import * as ReactDOM from "react-dom";
import { List } from "devextreme-react";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

interface IListItem {
    text: string;
}

class Item extends React.Component<IListItem, { counter: number }> {

    constructor(props: IListItem) {
        super(props);

        this.clickHandler = this.clickHandler.bind(this);

        this.state = {
            counter: 0
        };
    }

    public render() {
        return (
            <i onClick={this.clickHandler}>
                Component template for item {this.props.text}. <b>Clicks: {this.state.counter}</b>
            </i>
        );
    }

    private clickHandler() {
        this.setState({
            counter: this.state.counter + 1
        });
    }
}

const items: IListItem[] = [
    { text: "123" },
    { text: "234" },
    { text: "567" }
];

ReactDOM.render(
    <List items={items} itemComponent={Item} />,
    document.getElementById("root")
);
```


## <a name="license"></a>License ##

**DevExtreme React components are released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

Familiarize yourself with the [DevExtreme License](https://js.devexpress.com/Licensing/).

[Free trial is available!](http://js.devexpress.com/Buy/)

## <a name="support-feedback"></a>Support & Feedback ##
* For general React questions, check [React Docs](https://reactjs.org/docs)
* For questions regarding DevExtreme libraries and widgets API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
