import React from "react";
import { extendedClassname } from "./util/elements";
import './scss/spotlight.scss';

function Spotlight(props) {
    return (
        <div className={extendedClassname("spotlight", props)}>
            {props.children}
        </div>
    );
}

export { Spotlight };
