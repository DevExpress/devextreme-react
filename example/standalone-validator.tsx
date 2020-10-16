import * as React from 'react';
import { Button, TextBox, ValidationSummary, Validator } from '../src';

import { RequiredRule } from '../src/validator';
import Example from './example-block';

class ValidatorExample extends React.Component<any, any> {
    private _currentValue: string = '';
    private _adapter: any;
    private _callbacks: any[] = [];

    constructor(props: any) {
        super(props);
        this.state = {
            isValid: true
        };

        this._adapter = {
            getValue: () => {
                return this._currentValue;
            },
            validationRequestsCallbacks: this._callbacks,
            applyValidationResults: (e: any) => {
                this.setState({ isValid: e.isValid });
            }
        };
    }

    public render() {
        return (
            <div>
                <Example title={'Standalone Validator example'}>
                    <div style={{ border: this.state.isValid ? 'none' : '1px solid red' }}>
                        <TextBox onValueChanged={this._onValueChanged} />
                    </div>
                    <Validator adapter={this._adapter}>
                        <RequiredRule message={'This field is required'} />
                    </Validator>
                    <ValidationSummary/>
                    <Button
                        text={'Submit'}
                        onClick={this._onSubmit}
                    />
                </Example>
            </div>
        );
    }

    private _onValueChanged = (e: any) => {
        this._currentValue = e.value;

        this._callbacks.forEach((callback: any) => {
            callback();
        });
    }

    private _onSubmit = (e: any) => {
        e.validationGroup.validate();
    }
}

export default ValidatorExample;
