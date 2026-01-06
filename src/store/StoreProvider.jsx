"use client";

import { Provider } from "react-redux";
import store from "./index";
import AppBootstrap from "./app-bootstrap";

const StoreProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <AppBootstrap />
            {children}
        </Provider>
    );
};

export default StoreProvider;
