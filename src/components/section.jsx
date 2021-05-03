import React from 'react';
import { Error, InlineError } from './error';

function Section(props) {
    if (props.error) {
        return <Error message={props.error} />;
    }

    return (
        <section>
            <div className="space-between">
                <h1>{props.title}</h1>
                <span>[<a className="raw" href={props.url}>raw</a>]</span>
            </div>
            <InlineError message={props.networkError} />

            {props.children}
        </section>
    );
}

export default Section;