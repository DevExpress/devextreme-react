import * as React from "react";

import Box, { Item } from "../src/box";
import Button from "../src/button";
import Example from "./example-block";

const initialState = {
  items: [
    {
      id: 1,
      name: "Item #1"
    },
    {
      id: 2,
      name: "Item #2"
    }
  ]
};

class App extends React.Component<any, typeof initialState> {

  constructor(props: any) {
    super(props);

    this.state = { ...initialState };
  }

  public render() {
    return (
      <Example title="Box example">
        <Button
          text="Add"
          onClick={this.add}
        />
        <Button
          text="Remove"
          onClick={this.remove}
        />
        <Box direction="row" width="100%" height={75}>
          {this.renderItems()}
        </Box>
      </Example>
    );
  }

  private renderItems = () => {
    return this.state.items.map((item) => (
      <Item key={item.id} ratio={1}>
        {item.name}
      </Item>
    ));
  }

  private add = () => {
    const items = [...this.state.items];
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    items.push({
      id,
      name: `Item #${id}`
    });

    this.setState({ items });
  }

  private remove = () => {
    const items = this.state.items.slice(0, this.state.items.length - 1);
    this.setState({ items });
  }
}

export default App;
