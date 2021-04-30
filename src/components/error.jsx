import React from 'react';
import { NoContent } from './empty';

function Error(props) {
    return (
        <div className='error'>
            {props.message}
        </div>
    )
}

/**
 * Only displays if props.message is set.
 */
function InlineError(props) {
    return props.message ? (
        <Error message={props.message} />
    ) : (
        <NoContent />
    );
}

export { Error, InlineError };