import React from 'react';
import { Icon, MaterialIcon } from "./symbol";
import { NoContent } from "./empty";
import { ListItem } from './list';
import './../scss/featured.scss';
import { extendedClassname } from '../util/elements';

function FeaturedItem(props) {
    const icons = <Icons social={props.social} featured={props.featured} onFeaturedClick={props.onClick} />

    return (
        <ListItem
            className={extendedClassname('space-between', props)}
            icons={icons}>
            <div className='featured-content'>
                {props.children}
            </div>
        </ListItem>
    );
}

function Icons(props) {
    if (props.social) return <SocialIcon />
    else return <FeaturedIcon featured={props.featured} onClick={props.onFeaturedClick} />;
}

/**
 * An icon which is displayed if the item is in the zeitgeist because of social activity.
 */
function SocialIcon() {
    return <MaterialIcon title='Trending' className='trailing-icon' icon={Icon.trending} />
    // return <span title='Trending' className='trailing-icon material-icons'>whatshot</span>;
}

/**
 * An icon which displays 'featured' status. If the item is not featurable, no icon will be displayed.
 * Click to toggle.
 */
function FeaturedIcon(props) {
    const featured = props.featured;

    let icon;
    if (featured === null) return <NoContent className="featured-icon" />;
    else if (featured === false) icon = Icon.unfeatured;
    else icon = Icon.featured;

    return (
        <MaterialIcon
            title={featured ? 'Featured' : 'Mark as featured'}
            className='featured-icon'
            onClick={props.onClick}
            icon={icon} />
    );
}

export { FeaturedItem }
