import * as React from "react";
import Example from "./example-block";

import { Button } from "../src/ui/button";
import { TextBox } from "../src/ui/text-box";
import { ValidationGroup } from "../src/ui/validation-group";
import { ValidationSummary } from "../src/ui/validation-summary";
import { Validator } from "../src/ui/validator";

export default class extends React.Component<any, any> {

    private validationRules: Record<string, any> = {
        email: [
            { type: "required", message: "Email is required." },
            { type: "email", message: "Email is invalid." }
        ],
        password: [
            { type: "required", message: "Password is required." }
        ]
    };

    constructor(props: any) {
        super(props);

        this.validate = this.validate.bind(this);
    }

    public render() {
        return (
            <Example title="Validation" state={this.state}>
                <ValidationGroup>
                    <TextBox defaultValue={"email@mail.com"}>
                        <Validator validationRules={this.validationRules.email} />
                    </TextBox>
                    <br />
                    <TextBox defaultValue={"password"}>
                        <Validator validationRules={this.validationRules.password} />
                    </TextBox>
                    <ValidationSummary />
                    <br />
                    <Button
                        text={"Submit"}
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
