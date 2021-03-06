import React from "react";
import { extendedClassname } from "../util/elements";

function Tag(props) {
    return (
        <span className={extendedClassname("tag", props)}>
            {props.children}
        </span>
    );
}

function TagLink(props) {
    return (
        <a className={extendedClassname("tag", props)} href={props.href}>
            {props.children}
        </a>
    );
}

function ToDo(props) {
    return <div className="todo">// TODO {props.children}</div>;
}

function TaggedRow(props) {
    let childContent;
    if (props.children) {
        childContent = props.children;
    } else {
        childContent = props.tags.map(tag => <Tag key={tag}>{tag}</Tag>);
    }

    return (
        <div className={extendedClassname("tagged-row", props)}>
            <span>{props.content}</span>
            <span className="tag-group">{childContent}</span>
        </div>
    );
}

export { Tag, TagLink, TaggedRow, ToDo };
