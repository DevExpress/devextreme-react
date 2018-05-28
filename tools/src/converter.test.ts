import { IArrayDescr, ITypeDescr } from "../integration-data-model";
import { convertTypes, findCustomTypeRef } from "./converter";

it("deduplicates", () => {
    const types = [
        "Array",
        "Boolean",
        "Function",
        "Number",
        "Object",
        "String"
    ];

    const expected = [
        "array",
        "bool",
        "func",
        "number",
        "object",
        "string"
    ];

    expect(convertTypes(types)).toEqual(expected);
});

it("returns undefiend if finds Any", () => {
    expect(convertTypes(["Any"])).toBeUndefined();
    expect(convertTypes(["String", "Any", "Number"])).toBeUndefined();
});

it("returns undefined if array is empty", () => {
    expect(convertTypes([])).toBeUndefined();
});

it("returns undefined if array is undefined", () => {
    expect(convertTypes([])).toBeUndefined();
});

it("returns undefined if array is null", () => {
    expect(convertTypes([])).toBeUndefined();
});

it("finds custom type", () => {
    const types: ITypeDescr[] = [
        {
            acceptableValues: null,
            isCustomType: false,
            type: "abc"
        },
        {
            acceptableValues: null,
            isCustomType: true,
            type: "customType"
        }
    ];
    const actual = findCustomTypeRef(types);

    expect(actual.type).toBe("customType");
    expect(actual.isCollectionItem).toBeFalsy();
});

it("finds custom type in array items types", () => {
    const types: IArrayDescr[] = [
        {
            acceptableValues: null,
            isCustomType: false,
            type: "Array",
            itemTypes: [
                {
                    acceptableValues: null,
                    isCustomType: true,
                    type: "customType"
                }
            ]
        }
    ];
    const actual = findCustomTypeRef(types);

    expect(actual.type).toBe("customType");
    expect(actual.isCollectionItem).toBeTruthy();
});
