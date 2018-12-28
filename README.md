# DevExtreme React UI and Visualization Components #

[![Build Status](https://img.shields.io/shippable/5a9532d976382b0800e7a53c/master.svg?maxAge=43200)](https://app.shippable.com/github/DevExpress/devextreme-react)
[![NPM](https://img.shields.io/npm/v/devextreme-react.svg?maxAge=43200)](https://www.npmjs.com/package/devextreme-react)

This project allows you to use [DevExtreme](http://js.devexpress.com) [React](https://reactjs.org) Components.

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
  * [Rendering Function](#markup-customization-render)
  * [Component](#markup-customization-component)
  * [Template Component](#markup-customization-template-component)
  * [Components with Transcluded Content](#markup-customization-transcluded)
* [Configuration Components](#configuration-components)
  * [Basic usage](#configuration-components-basic)
  * [Collection Options](#configuration-components-collection)
* [DevExtreme Validation](#devextreme-validation)
* [Working With Data](#working-with-data)
* [Typescript Support](#typescript-support)
* [License](#license)
* [Support & feedback](#support-feedback)


## <a name="getting-started"></a>Getting Started ##

You can try this [live example](https://stackblitz.com/edit/devextreme-react), [feature-based examples](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Data_Grid/LocalDataSource/React/Light/) or configure local development environment as described below.

### <a name="prerequisites"></a>Prerequisites ###
[Node.js and npm](https://docs.npmjs.com/getting-started/installing-node) are required

### <a name="installation"></a>Install DevExtreme ####

Install the **devextreme** and **devextreme-react** npm packages:

```console
npm install --save devextreme devextreme-react
```
#### <a name="additional-configuration"></a>Additional Configuration ####

The following configuration steps depend on the build tool, bundler or module loader you are using:

* [Configuring Webpack](https://github.com/DevExpress/devextreme-react/blob/master/docs/using-webpack.md)
* [Using Create React App](https://github.com/DevExpress/devextreme-react/blob/master/docs/using-create-react-app.md)

### <a name="use-components"></a>Use DevExtreme Components  ####

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import Button from 'devextreme-react/button';

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

DevExtreme React components support [Controlled](https://reactjs.org/docs/forms.html#controlled-components) and [Uncontrolled](https://reactjs.org/docs/uncontrolled-components.html) states.

### <a name="controlled-mode"></a>Controlled Mode ###

In the controlled mode, a parent component passes a component's state using its props. This mode provides the following capabilities:
- Control component state externally (stateless behavior)
- Share state between components in your app
- Persist and restore state

To manage the component's state, provide a value for a related property and handle the event that is fired when the value changes.
**Note that the event is fired only when the component changes its state internally (when a user interacts with the component). If you directly update the property value, the event is not fired.**

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import TextBox from 'devextreme-react/text-box';

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

In the uncontrolled mode, DevExtreme components manage the state internally.

Note that if you want to specify an initial value for an option in the uncontrolled mode, use the property with the `default` prefix. In the example below, the `defaultCurrentView` property is used to define the `currentView` option's initial value.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import Scheduler from 'devextreme-react/scheduler';

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
A widget instance is required to call methods. You can get it by assigning a callback function to the component's `ref` property. This function accepts the mounted DevExtreme Component as an argument whose `instance` field stores the widget instance.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Button, TextBox } from 'devextreme-react';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

class Example extends React.Component {
    constructor(props) {
      super(props);
      
      this.textBox = null;

      this.setTextBox = (ref) => {
          this.textBox = ref.instance;
      };
      
      this.onClick = () => {
          this.textBox.focus()
      };
    }

    render() {
        return (
            <div>
                <TextBox ref={this.setTextBox}/>
                <Button text='Go to the TextBox' onClick={this.onClick} />
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


### <a name="markup-customization-render"></a>Rendering Function

Use the `render` property or a property with the `Render` suffix to specify a function that renders a component's or component element's content.

If a widget has the `template` option, use the `render` property to specify the rendering function:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import Button from 'devextreme-react/button';

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

For an option with the `template` suffix, use the corresponding property with the `Render` suffix to specify a rendering function:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import List from 'devextreme-react/list';

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

### <a name="markup-customization-component"></a>Component

You can also customize a widget's or widget element's content using a component instead of a rendering function. Pass the component or an inline function that creates the component to the `component` property or a property with the `Component` suffix. If you pass an inline function, a new component will be created each time the widget is rendered.

Functional Components can cause unnecessary render calls. In such cases, consider using the [PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) or the [shouldComponentUpdate method](https://reactjs.org/docs/react-component.html#shouldcomponentupdate).

The following example demonstrates how to use the `itemComponent` property to customize the widget item's appearance:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import List from 'devextreme-react/list';

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

**Note: You cannot use the `key` prop in template components because it is a special [React prop](https://reactjs.org/warnings/special-props.html ). Use `dxkey` instead.**

### <a name="markup-customization-template-component"></a>Template Component
To customize a widget element with a template component, specify the template name in the template component's `name` property and assign this name to the widget's template option. The template markup can be specified as a component (the `component` property) or a rendering function (the `render` property). Alternatively, you can put the markup directly into the template component as shown in the example below.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import DataGrid, { Column } from "devextreme-react/data-grid"; 
import { Template } from "devextreme-react/core/template";

import { data } from './data.js';

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandAll: true
        };

        this._handleToolbarPreparing = this._handleToolbarPreparing.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <DataGrid 
                    dataSource={ data }
                    onToolbarPreparing={this._handleToolbarPreparing}
                >
                    <GroupPanel visible={true} />
                    <Grouping autoExpandAll={this.state.expandAll} />
                    <Column dataField="firstName"/>
                    <Column dataField="lastName" caption="Last Name" defaultVisible={true}/>

                    <Template name={"toolbarLabel"}>
                        {this.state.expandAll ? <b>All data is expanded</b> : <b>All data is collapsed</b>}
                    </Template>
                </DataGrid>
            </React.Fragment>
        );
    }
    
    _handleToolbarPreparing(args) {
        args.toolbarOptions.items.unshift({
            location: "after",
            template: "toolbarLabel"
        });
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```

### <a name="markup-customization-transcluded"></a>Components with Transcluded Content
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

## <a name="configuration-components"></a>Configuration Components ##
DevExtreme React Components provide configuration components for the underlying widget's complex nested options.

Use a named import to get a configuration component.
```js
import Chart, { Tooltip } from "devextreme-react/chart"; 
```
Configuration components support markup customization props (with `Render` or `Component` suffix) and uncontrolled props.

### <a name="configuration-components-basic"></a>Basic Usage ###
The following example demonstrates how to configure the dxChart widget's [tooltip](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxChart/Configuration/tooltip/) option:


```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import Button from "devextreme-react/button"; 
import Chart, { Tooltip } from "devextreme-react/chart"; 

import { complaintsData } from './data.js';

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false
        };

        this.toggleTooltip = this.toggleTooltip.bind(this);
    }
    
    toggleTooltip() {
        this.setState({
            showTooltip: !this.state.showTooltip
        });
    }

    render() {
        return (
            <React.Fragment>
                <Chart
                    dataSource={ complaintsData }
                    title="Pizza Shop Complaints">
                    <Tooltip enabled={ this.state.showTooltip }/>
                </Chart>
                <Button text="Toggle tooltip" onClick={ this.toggleTooltip }/>
            </React.Fragment>
        );
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```

### <a name="configuration-components-collection"></a>Collection Options ###
You can also use configuration components for complex collection options.
The following example demonstrates how to configure the the dxDataGrid widget's [columns](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/) option:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import DataGrid, { Column } from "devextreme-react/data-grid"; 

import { data } from './data.js';

class Example extends React.Component {
    render() {
        return (
            <React.Fragment>
                <DataGrid dataSource={ data }>
                    <Column dataField="firstName"/>
                    <Column dataField="lastName" caption="Last Name" defaultVisible={true}/>
                </DataGrid>
            </React.Fragment>
        );
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
```

Note that configuration components are not provided for options that accept a type that depends on another option's value. For example,
the DataGrid's [editorOptions](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#editorOptions), Form's [editorOptions](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxForm/Item_Types/SimpleItem/#editorOptions), Toolbar's [widget](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxToolbar/Default_Item_Template/#options) options.


### <a name="configuration-components-template"></a>Put Markup Into Configuration Components ###

If a widget's configuration component supports the `template` option, you can put markup into this component. The following example demonstrates how to specify a list item's markup.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import List, { Item } from 'devextreme-react/list';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

ReactDOM.render(
    (
    <List>
      <Item>orange</Item>
      <Item>white</Item>
      <Item>black</Item>
    </List>
    ),
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
import List from 'devextreme-react/list';

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
import List from "devextreme-react/list";

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
