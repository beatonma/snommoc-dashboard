import React from 'react';

function Tag(props) {
    return (
        <span className={`tag ${props.className || ''}`}>{props.children}</span>
    );
}

function TODO(props) {
    return (
        <Tag className="todo">TODO {props.children}</Tag>
    );
}

function TaggedRow(props) {
    let childContent;
    if (props.children) {
        childContent = props.children;
    }
    else {
        childContent = props.tags.map(tag => <Tag key={tag}>{tag}</Tag>)
    }

    return (
        <div className={`tagged-row ${props.className || ''}`}>
            <span>{props.content}</span>
            <span className="tag-group">
                {childContent}
            </span>
        </div>
    );
}

export { Tag, TaggedRow, TODO };
