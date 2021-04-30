import React from "react";

function NoContent(props) {
    if (props.className) {
        return <div className={props.className}>{props.message}</div>;
    }
    else if (props.message) {
        return <div>{props.message}</div>
    }
    return <></>;
}

export { NoContent };
