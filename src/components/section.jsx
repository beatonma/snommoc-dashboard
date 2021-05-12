import React from "react";
import NoContent from "./empty";
import { Error, InlineError } from "./error";

function Section(props) {
    if (props.error) {
        return <Error message={props.error} />;
    }

    const rawLink = props.url ? (
        <span>
            [
            <a className="raw" href={props.url}>
                raw
            </a>
            ]
        </span>
    ) : (
        <NoContent />
    );

    return (
        <section>
            <div className="space-between">
                <h1>{props.title}</h1>
                {rawLink}
            </div>
            <InlineError message={props.networkError} />

            {props.children}
        </section>
    );
}

export default Section;
