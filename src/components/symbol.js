import React from "react";
import { extendedClassname } from "../util/elements";

const Symbol = {
    ellips: "\u2026", // &hellip;
};

const Icon = {
    check: "check",
    featured: "star",
    unfeatured: "star_border",
    trending: "whatshot",
    close: "close",
    error: "error_outline",
    pending: "pending",
};

function MaterialIcon(props) {
    return (
        <span
            className={extendedClassname("material-icons", props)}
            onClick={props.onClick}
            title={props.title}
        >
            {props.icon}
        </span>
    );
}

export { Icon, Symbol, MaterialIcon };
