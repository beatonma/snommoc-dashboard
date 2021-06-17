import React from "react";
import { Icon, MaterialIcon } from "./symbol";
import "../scss/house.scss";

export function House(props) {
    return (
        <div className="house">
            <MaterialIcon
                className={props.house.toLowerCase()}
                icon={Icon.home}
                title={`House of ${props.house}`}
            />
        </div>
    );
}
