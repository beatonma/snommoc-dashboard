import React from 'react';

function ScrollableColumn(props) {
    return (
        <div className="list-scroll">
            {props.children}
        </div>
    );
}

function ListItem(props) {
    return (
        <div className={`list-item ${props.className || ''}`}>
            {props.children}
        </div>
    );
}

export {
    ScrollableColumn,
    ListItem,
};