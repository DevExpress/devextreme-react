# React UI and Visualization Components Based on DevExtreme Widgets #

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [React components](https://reactjs.org).


## <a name="getting-started"></a>Getting Started ##

### <a name="prerequisites"></a>Prerequisites ###
[Node.js and npm](https://docs.npmjs.com/getting-started/installing-node) required

### <a name="installation"></a>Install DevExtreme ####

Install the **devextreme** and **devextreme-react** npm packages:

```console
npm install --save devextreme@18.1-unstable devextreme-react
```
### Import DevExtreme Components  ####

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'devextreme-react';

ReactDOM.render(
  <Button text='Example Button' />,
  document.getElementById('root')
);
```

## <a name="examples"></a>Examples ##

### Handle value changed
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { TextBox } from 'devextreme-react';

class Example extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: 'inital text'
        };
    }

    render() {
        return (
            <TextBox
                value={this.state.text}
                onValueChanged={this.update}
                valueChangeEvent='keyup'
            />
        );
    }

    update(e) {
        this.setState({
            text: e.component.option('value')
        });
    }
}

ReactDOM.render(
  <Example/>,
  document.getElementById('root')
);
```

### Customizing component rendering
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { List } from 'devextreme-react';

const items: IListItem[] = [
    { text: "123" },
    { text: "234" },
    { text: "567" }
];

class ItemTemplate extends React.Component {
    public render() {
        return <i>This is component template for item {this.props.text}</i>;
    }
}

ReactDOM.render(
  <List items={items} itemComponent={ItemTemplate}/>,
  document.getElementById('root')
);
```
or use render-function:
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { List } from 'devextreme-react';

const items = [
    { text: "123" },
    { text: "234" },
    { text: "567" }
];

const itemRender = (it) => <i>This is function template for item {it.text}</i>;

ReactDOM.render(
  <List items={items} itemRender={itemRender}/>,
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