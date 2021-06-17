import React from "react";
import { extendedClassname } from "../util/elements";
import NoContent from "./empty";

export function ScrollableColumn(props) {
    const hasChildren = React.Children.count(props.children) > 0;

    if (hasChildren) {
        return (
            <div className={extendedClassname("list-scroll", props)}>
                {props.children}
            </div>
        );
    } else {
        return <NoContent message="No items" />;
    }
}

export function ListItem(props) {
    const icons = props.icons || <NoContent />;
    const content =
        props.title && props.content ? (
            <div>
                <ItemTitle>{props.title}</ItemTitle>
                <ItemContent>{props.content}</ItemContent>
            </div>
        ) : (
            <NoContent />
        );

    return (
        <div
            className={extendedClassname("list-item", props)}
            onClick={props.onClick}
        >
            {content}
            {props.children}
            {icons}
        </div>
    );
}

export function ItemTitle(props) {
    return (
        <div className={extendedClassname("item-title", props)}>
            {props.children}
        </div>
    );
}

export function ItemContent(props) {
    return (
        <div className={extendedClassname("item-content", props)}>
            {props.children}
        </div>
    );
}
