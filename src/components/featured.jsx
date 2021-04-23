import React from 'react';
import Symbol from "./symbol";
import { NoContent } from "./empty";
import { ListItem } from './list';
import './../scss/featured.scss';

function FeaturedItem(props) {
    return (
        <ListItem className={`space-between ${props.className || ''}`}>
            <div className='featured-content'>
                {props.children}
            </div>
            <FeaturedIcon featured={props.featured} onClick={props.onClick} />
        </ListItem>
    );
}

/**
 * An icon which displays 'featured' status. If the item is not featurable, no icon will be displayed.
 * Click to toggle.
 */
function FeaturedIcon(props) {
    const featured = props.featured;

    let icon;
    if (featured === null) return <NoContent className="featured-icon" />;
    else if (featured == false) icon = Symbol.unfeatured;
    else icon = Symbol.featured;

    return (
        <div className="featured-icon" onClick={props.onClick}>
            {icon}
        </div>
    );
}

export { FeaturedItem }
