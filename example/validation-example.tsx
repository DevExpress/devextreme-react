import * as React from 'react';
import Example from './example-block';

import { Button } from '../src/button';
import { TextBox } from '../src/text-box';
import { ValidationGroup } from '../src/validation-group';
import { ValidationSummary } from '../src/validation-summary';
import { EmailRule, RequiredRule, Validator } from '../src/validator';

export default class extends React.Component<any, any> {

  constructor(props: any) {
    super(props);

    this.validate = this.validate.bind(this);
  }

  public render() {
    return (
      <Example title="Validation" state={this.state}>
        <ValidationGroup>
          <TextBox defaultValue="email@mail.com">
            <Validator>
              <EmailRule message="Email is invalid." />
              <RequiredRule message="Email is required." />
            </Validator>
          </TextBox>
          <br />
          <TextBox defaultValue="password">
            <Validator>
              <RequiredRule message="Password is required." />
            </Validator>
          </TextBox>
          <ValidationSummary />
          <br />
          <Button
            text="Submit"
            onClick={this.validate}
          />
        </ValidationGroup>
      </Example>
    );
  }

  private validate(params: any) {
    const result = params.validationGroup.validate();
    if (result.isValid) {
      // form data is valid
      params.validationGroup.reset();
    }
  }
}
