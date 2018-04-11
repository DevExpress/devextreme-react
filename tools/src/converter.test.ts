import { convertTypes } from "./converter";

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
