import * as React from "react";
import * as ReactDOM from "react-dom";
import Example from "./example-block";

import { Template } from "../src/core/template";
import Form from "../src/ui/form";
import TextArea from "../src/ui/text-area";

const employee: any = {
    ID: 1,
    FirstName: "John",
    LastName: "Heart",
    Position: "CEO",
    BirthDate: "1964/03/16",
    HireDate: "1995/01/15",
    Notes: "John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.",
    Address: "351 S Hill St., Los Angeles, CA",
    Phone: "360-684-1334"
};

const positions = [
    "HR Manager",
    "IT Manager",
    "CEO",
    "Controller",
    "Sales Manager",
    "Support Manager",
    "Shipping Manager"
];
const items: any = ["ID", {
    dataField: "FirstName",
    editorOptions: {
        disabled: true
    }
}, {
    dataField: "LastName",
    editorOptions: {
        disabled: true
    }
}, {
    dataField: "Position",
    editorType: "dxSelectBox",
    editorOptions: {
        items: positions,
        value: ""
    },
    validationRules: [{
        type: "required",
        message: "Position is required"
    }]
}, {
    dataField: "BirthDate",
    editorType: "dxDateBox",
    editorOptions: {
        disabled: true,
        width: "100%"
    }
}, {
    dataField: "HireDate",
    editorType: "dxDateBox",
    editorOptions: {
        value: null,
        width: "100%"
    },
    validationRules: [{
        type: "required",
        message: "Hire date is required"
    }]
}, {
    colSpan: 2,
    dataField: "Notes",
    template: "area",
}, "Address", {
    dataField: "Phone",
    editorOptions: {
        mask: "+1 (X00) 000-0000",
        maskRules: {X: /[02-9]/}
    }
}];

export default class extends React.Component<any, {}> {

    public render() {
        return (
            <Example title="DxForm">
                <Form
                    colCount={2}
                    formData={employee}
                    items={items}
                >
                <Template name="area" component={TextArea}/>
                </Form>
            </Example>
        );
    }
}
