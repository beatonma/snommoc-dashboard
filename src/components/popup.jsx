import React from "react";
import { extendedClassname } from "../util/elements";
import "../scss/popup.scss";

export function Popup(props) {
    return (
        <div className="overlay" onClick={props.onClose}>
            <div
                className={extendedClassname("popup", props)}
                onClick={e => e.stopPropagation()}
            >
                {props.children}
            </div>
        </div>
    );
}
