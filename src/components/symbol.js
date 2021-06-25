import React from "react";
import { extendedClassname } from "../util/elements";

const Symbol = {
    ellips: "\u2026", // &hellip;
};

const Icon = {
    check: "check",
    home: "home",
    edit: "add",
    featured: "star",
    unfeatured: "star_border",
    trending: "whatshot",
    close: "close",
    error: "error_outline",
    pending: "pending",
    confirmConstituency: "add_link",
    sortByName: "sort_by_alpha",
    sortByMissingData: "link_off",
    portrait: "face",
    portrait_missing: "crop_free",
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
