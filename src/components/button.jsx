import React, { useState } from "react";
import NoContent from "./empty";
import "../scss/_button.scss";

function ConfirmButton(props) {
    const [isLocked, setLocked] = useState(true);
    const [isDisabled, setDisabled] = useState(false);
    const [timeoutID, setTimeoutID] = useState(0);

    let className = isLocked ? "locked" : "unlocked";
    if (isDisabled) className = "disabled";

    const onClick = () => {
        if (isDisabled) return;

        if (isLocked) {
            setLocked(false);
            setTimeoutID(
                setTimeout(() => {
                    setTimeoutID(0);
                    setLocked(true);
                }, 1600)
            );
        } else {
            if (timeoutID != 0) {
                clearTimeout(timeoutID);
                setTimeoutID(0);
            }
            setDisabled(true);
            props.onClick();
        }
    };

    const confirmMessage =
        !isLocked && !isDisabled ? (
            <div className="confirm-button--confirm">
                <span>{props.confirmMessage || "Confirm?"}</span>
            </div>
        ) : (
            <NoContent />
        );

    return (
        <div className={`confirm-button ${className}`} onClick={onClick}>
            {props.children}
            {confirmMessage}
        </div>
    );
}

export { ConfirmButton };
