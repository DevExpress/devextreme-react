# React UI and Visualization Components Based on DevExtreme Widgets #

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [React](https://reactjs.org) components.


## <a name="getting-started"></a>Getting Started ##

### <a name="prerequisites"></a>Prerequisites ###
* <a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">Node.js and npm</a> are essential.

### <a name="installation"></a>Install DevExtreme ####

Install the **devextreme** and **devextreme-react** npm packages:

```sh
npm install --save devextreme@18.1-unstable devextreme-react
```
### Use DevExtreme Components  ####

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

### Using DevExtreme React Components in Controlled  Mode
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { TextBox } from 'devextreme-react';

class Example extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "inital text"
        };
    }

    render() {
        return (
            <TextBox
                value={this.state.text}
                onValueChanged={this.update}
                valueChangeEvent="keyup"
            />
        );
    }

    update(e) {
        this.setState({
            text: e.component.option("value")
        });
    }
}

ReactDOM.render(
  <Example/>,
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
* For DevExtreme React components bugs, questions and suggestions, use the [GitHub issue tracker](https://github.com/DevExpress/devextreme-react/issues)