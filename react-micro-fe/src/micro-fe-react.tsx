import React from "react";
import ReactDOM from 'react-dom';
import indexComponents from "./index";
import singleSpaReact, { SingleSpaContext } from "single-spa-react";

const lifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: indexComponents,
    errorBoundary(err, info, props) {
            // Customize the root error boundary for your microfrontend here.
            return null;
    }
});

export const { bootstrap, mount, unmount } = lifecycles;
