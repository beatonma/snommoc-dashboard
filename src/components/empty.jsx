import React from "react";

function NoContent(props) {
    if (props.className) {
        return <div className={props.className}></div>;
    }
    return <></>;
}

export { NoContent };
