import * as React from "react";

type UpdateFunc = (newProps, prevProps) => void;

interface IUpdater {
    update?: UpdateFunc;
}

class NestedOption<P> extends React.PureComponent<P & IUpdater, any> {

    public render() {
        return null;
    }

    public componentWillUpdate(nextProps: P & IUpdater) {
        const newProps = { ...(nextProps as {} & IUpdater) };
        delete newProps.update;

        const prevProps = { ...(this.props as {} & IUpdater) };
        delete prevProps.update;

        if (nextProps.update) {
            nextProps.update(newProps, prevProps);
        }
    }
}

function createConfigurationComponent<P>(baseElement: React.ReactElement<P>, updateFunc: UpdateFunc) {
    const extraProps: IUpdater = {
        update: updateFunc
    };

    return React.cloneElement(baseElement, extraProps);
}

export default NestedOption;
export { createConfigurationComponent, IUpdater, UpdateFunc };
