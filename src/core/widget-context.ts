import { createContext } from "react";

interface IWidgetContext {
    registerExtension: (callback: any) => void;
}

const WidgetContext = createContext<IWidgetContext>({
    registerExtension: (callback: any) => { return; }
});

export {
    WidgetContext,
    IWidgetContext
};
