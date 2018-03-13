# React UI and Visualization Components Based on DevExtreme Widgets #

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [React C omponents](https://reactjs.org).


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
Note that one of the [predefined themes](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/) is required


## <a name="api-reference"></a>API Reference ##

Each DevExtreme React component correspond widget con   figuration described in [DevExtreme API Reference](http://js.devexpress.com/Documentation/ApiReference/).


## <a name="controlled-mode"></a>Controlled Mode
Controlled mode assumes you provide an option value and handle the event fired when it is changed:

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


## <a name="uncontrolled-mode"></a>Uncontrolled Mode ##

All DevExtreme widgets are able to manage their state internally, allowing you to avoid writing event handlers for every state update.

To get a value of the option you need, obtain a widget instance and use the `.option('<optionName>')` method.

If you want to specify the initial value for an option, but leave subsequent updates uncontrolled you should use property with the `default` prefix.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { TextBox } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

class Example extends React.Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
            <div>
                <TextBox
                    defaultValue={'inital text'}
                    onInitialized={(e) => this.textBox = e.component}
                />
                <button type='button' onClick={this.handleClick}>Submit</button>
                <div ref={(el) => this.target = el}></div>
            </div>
        );
    }

    handleClick(e) {
        this.target.innerText = this.textBox.option('value');
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```


## <a name="rendering-customization"></a>Rendering Customization
DevExtreme widgets support customization via templates. To achieve the same with DevExtreme React Components you can use a render function:
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
or a component:
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

When using such widgets as [ScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/) you can specify their content within corresponding tags:
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Popup, ScrollView } from 'devextreme-react';

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
The DevExtreme framework includes a [data layer](https://js.devexpress.com/Documentation/Guide/Data_Layer/Data_Layer/), that enable you to read and write data.

Here is an example of use of the [DataSource](https://js.devexpress.com/Documentation/ApiReference/Data_Layer/DataSource/) with DevExtreme React Components.

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


## <a name="typechecking"></a>Typechecking ##

Typechecking allows you to catch a lot of bugs and improve your workflow by adding features like auto-completion and automated refactoring. This is why we provide TypeScript declarations for the DevExtreme React Components.

Here is a TypeScript example of rendering customization:
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