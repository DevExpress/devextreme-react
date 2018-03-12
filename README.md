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

## <a name="examples"></a>Examples ##

### <a name="handle-value-change"></a>Handle Value Change
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
                    value={this.state.text}
                    onValueChanged={this.update}
                    valueChangeEvent='keyup'
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

### <a name="customize-rendering"></a>Customize Rendering
DevExtreme widgets support customization via templates. To achieve the same with React components you can use your own React component:
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

        this.clickHandeler = this.clickHandeler.bind(this);

        this.state = {
            counter: 0
        };
    }

    render() {
        return (
            <i onClick={this.clickHandeler}>
                Component template for item {this.props.text}. <b>Clicks: {this.state.counter}</b>
            </i>
        );
    }

    clickHandeler() {
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
or a render-function:
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

## <a name="api-reference"></a>API Reference ##

Each DevExtreme React component correspond widget condfiguration described in [DevExtreme API Reference](http://js.devexpress.com/Documentation/ApiReference/).


## <a name="license"></a>License ##

**DevExtreme React components are released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

Familiarize yourself with the [DevExtreme License](https://js.devexpress.com/Licensing/).

[Free trial is available!](http://js.devexpress.com/Buy/)

## <a name="support-feedback"></a>Support & Feedback ##
* For general React questions, check [React Docs](https://reactjs.org/docs)
* For questions regarding DevExtreme libraries and JavaScript API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)