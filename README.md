# DevExtreme React UI and Visualization Components #

[![Build Status](https://img.shields.io/shippable/5a9532d976382b0800e7a53c/master.svg?maxAge=43200)](https://app.shippable.com/github/DevExpress/devextreme-react)
![Project Status](https://img.shields.io/badge/Project%20Status-alpha-orange.svg?maxAge=43200)
[![NPM](https://img.shields.io/npm/v/devextreme-react.svg?maxAge=43200)](https://www.npmjs.com/package/devextreme-react)

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [React Components](https://reactjs.org).

* [Getting started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Install DevExtreme](#installation)
  * [Use DevExtreme Components](#use-components)
* [API Reference](#api-reference)
* [State Management](#state-management)
  * [Controlled Mode](#controlled-mode)
  * [Uncontrolled Mode](#uncontrolled-mode)
  * [Getting Widget Instance](#getting-widget-instance)
* [Markup Customization](#markup-customization)
* [DevExtreme Validation](#devextreme-validation)
* [Working With Data](#working-with-data)
* [Typescript Support](#typescript-support)
* [License](#license)
* [Support & feedback](#support-feedback)


## <a name="getting-started"></a>Getting Started ##

You can try this [live example](https://stackblitz.com/edit/devextreme-react) (no need to install anything).

If you’d rather use a local development environment check out the sections below.

### <a name="prerequisites"></a>Prerequisites ###
[Node.js and npm](https://docs.npmjs.com/getting-started/installing-node) are required

### <a name="installation"></a>Install DevExtreme ####

Install the **devextreme** and **devextreme-react** npm packages:

```console
npm install --save devextreme@18.1 devextreme-react
```
#### <a name="additional-configuration"></a>Additional Configuration ####

The further configuration steps depend on which build tool, bundler or module loader you are using. Please choose the one you need:

* [Configuring Webpack](https://github.com/DevExpress/devextreme-react/blob/master/docs/using-webpack.md)
* [Using Create React App](https://github.com/DevExpress/devextreme-react/blob/master/docs/using-create-react-app.md)

### <a name="use-components"></a>Use DevExtreme Components  ####

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

Note that [DevExtreme styles](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/#Themes_in_Sites) are required.


## <a name="api-reference"></a>API Reference ##

The complete list of components and their APIs are described in the [DevExtreme API Reference](http://js.devexpress.com/Documentation/ApiReference/).

See [Markup Customization](#markup-customization) for details on how to implement and apply templates.


## <a name="state-management"></a>State Management ##

DevExtreme React components support both [Controlled](https://reactjs.org/docs/forms.html#controlled-components) and [Uncontrolled](https://reactjs.org/docs/uncontrolled-components.html) state modes.

### <a name="controlled-mode"></a>Controlled Mode ###

In the controlled mode, a parent component passes a component's state using its props. This mode provides the following capabilities:
- Control component state externally (stateless behavior)
- Share state between components in your app
- Persist and restore state

To control a component's state, provide the value for the required property and handle the event that is fired when it is changed (use the appropriate property with the `on` prefix):

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
                <br />
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
[Live example](https://stackblitz.com/edit/devextreme-react-controlled-mode)

### <a name="uncontrolled-mode"></a>Uncontrolled Mode ###

Sometimes there is no need to handle all the component's updates, thus DevExtreme components can manage their state internally which reduces the amount of code required.

Note that if you want to specify an initial value for an option in the uncontrolled mode, you should use an appropriate property with the `default` prefix. In the example below, the `currentView` option's initial value is defined using the `defaultCurrentView` property.

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
In some cases, a widget instance is required when you need to call a widget method. You can get it by assigning a callback function to the component's `ref` property. This function accepts the mounted DevExtreme Component as an argument whose `instance` property stores the widget instance.

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
You can customize widget elements' appearance via the corresponding template properties. In the [DevExtreme API](http://js.devexpress.com/Documentation/ApiReference/), the corresponding options have the `Template` suffix (e.g. dxList's [itemTemplate](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxList/Configuration/#itemTemplate) option).

To specify a DevExtreme React Component template, use the `Render` or `Component` suffix instead.
If a widget has an option called `template` (e.g. Button's [template](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/#template) option) the corresponding React Component properties are called `render` and `component`.

Use a property with the `Render` suffix to specify a rendering function:
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
Functional Components can cause unnecessary render calls. In such cases, consider using the [PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) or the [shouldComponentUpdate method](https://reactjs.org/docs/react-component.html#shouldcomponentupdate).

A template component can be specified using a property with the `Component` suffix:
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

class Item extends React.PureComponent {

    render() {
        return (
            <i onClick={this.handleClick}>
                Component template for item {this.props.text}.
            </i>
        );
    }
}

ReactDOM.render(
    <List items={items} itemComponent={Item} />,
    document.getElementById('root')
);
```
Note that DevExtreme can use the `key` prop in template data. The `key` prop will be removed from template component props by React. We add `dxkey` prop to let you solve this issue.

Use the `render` property to specify a rendering function for a widget with `template` option:
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

class CounterButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0
        };

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
            <Button
                text={this.props.text}
                render={(btn) => <div style={{ padding: 20 }}>{btn.text} (<b>{this.state.counter}</b>)</div>}
                onClick={this.handleClick}
            />
        );
    }

    handleClick() {
        this.setState({
            counter: this.state.counter + 1
        });
    }
}

ReactDOM.render(
    <CounterButton text='Click me!' />,
    document.getElementById('root')
);
```

The components that displays content in an overlaying window (for example, [ScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/)), allow to specify the content as component children:

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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed lacus
                    egestas, facilisis urna nec, fringilla nibh. Maecenas enim felis, ultricies
                    pretium aliquet ut, aliquam id urna. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Nam viverra est at neque fringilla, non iaculis magna
                    ultrices. Nunc posuere tincidunt elit a molestie. Nulla aliquet metus ex. Nunc
                    aliquam volutpat libero, ac tincidunt felis consectetur id. Sed diam lectus,
                    dictum non tempus fringilla, semper in dui. Donec at hendrerit massa. Aenean
                    quis suscipit nisi. Cras sed eros tristique, venenatis diam in, rhoncus enim.
                </p>
                <p>
                    Orci varius natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Curabitur et ex sit amet odio efficitur fermentum.
                    Donec lobortis hendrerit massa. Praesent tempus cursus tempus. Maecenas at
                    dolor lacus. Vestibulum suscipit ac mi vitae posuere. Maecenas id urna eget
                    sapien volutpat laoreet. Sed nulla purus, aliquam nec augue vel, consequat
                    tincidunt erat. Phasellus hendrerit rhoncus erat, ut fermentum orci molestie a.
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

## <a name="devextreme-validation"></a>DevExtreme Validation ##
DevExtreme React editors support built-in [data validation](https://js.devexpress.com/Documentation/Guide/Widgets/Common/UI_Widgets/Data_Validation/).

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Button, TextBox, ValidationGroup, ValidationSummary, Validator } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

class Example extends React.Component {

    validationRules = {
        email: [
            { type: 'required', message: 'Email is required.' },
            { type: 'email', message: 'Email is invalid.' }
        ],
        password: [
            { type: 'required', message: 'Password is required.' }
        ]
    };

    constructor(props) {
        super(props);

        this.validate = this.validate.bind(this);
    }

    render() {
        return (
            <ValidationGroup>
                <TextBox defaultValue={'email@mail.com'}>
                    <Validator validationRules={this.validationRules.email} />
                </TextBox>
                <TextBox defaultValue={'password'}>
                    <Validator validationRules={this.validationRules.password} />
                </TextBox>
                <ValidationSummary />
                <Button
                    text={'Submit'}
                    onClick={this.validate}
                />
            </ValidationGroup>
        );
    }

    validate(params) {
        const result = params.validationGroup.validate();
        if (result.isValid) {
            // form data is valid
            //params.validationGroup.reset();
        }
    }
}
ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```


## <a name="working-with-data"></a>Working with Data ##
DevExtreme includes the [data layer](https://js.devexpress.com/Documentation/Guide/Data_Layer/Data_Layer/) that enables you to read and write data stored in different data sources.

The example below demonstrates how to use a [DataSource](https://js.devexpress.com/Documentation/ApiReference/Data_Layer/DataSource/) with DevExtreme Components.

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


## <a name="typescript-support"></a>Typescript Support ##

We provide TypeScript declarations for DevExtreme Components. Strict typing allows you to catch many bugs and improve your workflow by adding features like auto-completion and automated refactoring.

Below is an example of appearance customization using TypeScript:

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


## <a name="license"></a>License ##

**DevExtreme React components are released as an MIT-licensed (free and open-source) add-on to DevExtreme.**

Familiarize yourself with the [DevExtreme License](https://js.devexpress.com/Licensing/).

[A free trial is available!](http://js.devexpress.com/Buy/)

## <a name="support-feedback"></a>Support & Feedback ##
* For general React questions, check [React Docs](https://reactjs.org/docs)
* For questions regarding DevExtreme libraries and widgets' APIs, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
