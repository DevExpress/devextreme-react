# React UI and Visualization Components Based on DevExtreme Widgets #

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [React components](https://reactjs.org).


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

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

ReactDOM.render(
  <Button text='Example Button' />,
  document.getElementById('root')
);
```
Note that one of the [predefined themes](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/) is required

## <a name="controlled-mode"></a>Controlled Mode
Controlled mode assumes you provide an option value and handle the event fired when it is changed:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { TextBox } from 'devextreme-react';

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

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

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

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

## <a name="examples"></a>Examples ##
### <a name="rendering-customization"></a>Rendering Customization
DevExtreme widgets support customization via templates. To achieve the same with React components you can use a render function:
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { List } from 'devextreme-react';

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

const items = [
    { text: "123" },
    { text: "234" },
    { text: "567" }
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

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

const items = [
    { text: "123" },
    { text: "234" },
    { text: "567" }
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

## <a name="typechecking"></a>Typechecking ##

Typechecking allows you to catch a lot of bugs and improve your workflow by adding features like auto-completion and automated refactoring. This is why we provide TypeScript declarations for the components based on the DevExtreme widgets.

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
    document.getElementById('root')
);
```


## <a name="api-reference"></a>API Reference ##

Each DevExtreme React component correspond widget condfiguration described in [DevExtreme API Reference](http://js.devexpress.com/Documentation/ApiReference/).


## <a name="license"></a>License ##

**DevExtreme React components are released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

Familiarize yourself with the [DevExtreme License](https://js.devexpress.com/Licensing/).

[Free trial is available!](http://js.devexpress.com/Buy/)

## <a name="support-feedback"></a>Support & Feedback ##
* For general React questions, check [React Docs](https://reactjs.org/docs)
* For questions regarding DevExtreme libraries and JavaScript API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)