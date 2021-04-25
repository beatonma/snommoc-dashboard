import React from 'react';
import { extendedClassname } from '../util/elements';
import { NoContent } from './empty';

function ScrollableColumn(props) {
    return (
        <div className={`list-scroll ${props.className || ''}`}>
            {props.children}
        </div>
    );
}

function ListItem(props) {
    const icons = props.icons || <NoContent />;
    const content = props.title && props.content
        ? <div>
            <ItemTitle>{props.title}</ItemTitle>
            <ItemContent>{props.content}</ItemContent>
        </div>
        : <NoContent />

    return (
        <div
            className={`list-item ${props.className || ''}`}
            onClick={props.onClick}
        >
            {content}
            {props.children}
            {icons}
        </div>
    );
}

function ItemTitle(props) {
    return <div className={extendedClassname('item-title', props)} >
        {props.children}
    </div>
}

function ItemContent(props) {
    return <div className={extendedClassname('item-content', props)} >
        {props.children}
    </div>
}

export {
    ScrollableColumn,
    ListItem,
    ItemTitle,
    ItemContent,
};