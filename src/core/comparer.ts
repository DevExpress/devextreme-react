function updateIsRequired(optionName: string, props: Record<string, any>, prevProps: Record<string, any>): boolean {
    if (props[optionName] === prevProps[optionName]) {
        return false;
    }

    if (deepCheckForbidden.indexOf(optionName) === -1) {
        return !equals(props[optionName], prevProps[optionName]);
    }

    return true;
}

function equals(value: any, prevValue: any): boolean {

    if (value === prevValue) {
        return true;
    }

    if (value === null || prevValue === null || value === undefined || prevValue === undefined) {
        return false;
    }

    if (!isContainer(value)) {
        return false;
    }

    const keys = Object.keys(value);
    if (keys.length !== Object.keys(prevValue).length) {
        return false;
    }

    for (const key of keys) {
        if (!(key in prevValue) || !equals(value[key], prevValue[key])) {
            return false;
        }
    }

    return true;
}

function isContainer(option: any): boolean {
    return (option instanceof Object && !Array.isArray(option));
}

const deepCheckForbidden = ["dataSource"];

export { updateIsRequired };
