import * as React from 'react';

interface IProps {
  state?: object;
  title: string;
  children: any;
}

const Example = (props: IProps) => {
  let stateBlock = null;
  if (!!props.state) {
    stateBlock = <pre className="example-state">{JSON.stringify(props.state, null, '  ')}</pre>;
  }

  return (
    <div className="example-block">
      <div className="example-header">
        <h4 className="bg-primary example-title">{props.title || 'example'}</h4>
        {stateBlock}
      </div>
      {props.children}
    </div>
  );
};

export default Example;
