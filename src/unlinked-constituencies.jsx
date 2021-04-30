import React from "react";
import { NoContent } from "./components/empty";
import { InlineError } from "./components/error";
import { Tag, TaggedRow, TODO } from "./components/tag";
import { dashboardUrl } from "./local/local.js";

/**
 * Sample response:
 *
 * {
 *     "count": 0,
 *     "next": null,
 *     "previous": null,
 *     "results": [
 *          "name": "Inverness",
 *          "url": "/"",
 *          "mp": {
 *              "name": "Alan Fitch",
 *              "url": "/"
 *          },
 *          "election": {
 *              "name": "2019 General Election",
 *              "url": "/"
 *          }
 *      ]
 * }
 */

class UnlinkedConstituencies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            error: null,
            networkError: null,
        };

        this.update = this.update.bind(this);
        this.update();
    }

    static getDerivedStateFromError(error) {
        return { error: error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error);
        console.error(errorInfo);
    }

    update() {
        const url = dashboardUrl("unlinked-constituencies/");
        fetch(url)
            .then(response => response.json())
            .then(json => json.results)
            .then(results => this.setState({ results: results }))
            .catch(err => this.setState({ networkError: err }));
    }

    render() {
        if (this.state.error) {
            return <Error message={this.state.error} />;
        }

        return (
            <section>
                <h1>Unlinked Constituencies</h1>
                <InlineError message={this.state.networkError} />
                <TODO />
                <div className="unlinked-constituencies list-scroll">
                    {this.state.results.map(item => (
                        <UnlinkedConstituency
                            key={item.name}
                            name={item.name}
                            url={item.url}
                            person={item.person}
                            election={item.election}
                        />
                    ))}
                </div>
            </section>
        );
    }
}

function UnlinkedConstituency(props) {
    return (
        <div className="unlinked-constituency list-item">
            <TaggedRow content={<a href={props.url}>{props.name}</a>}>
                <Tag>
                    <a href={props.person.url}>{props.person.name}</a>
                </Tag>
                <Tag>
                    <a href={props.election.url}>{props.election.name}</a>
                </Tag>
            </TaggedRow>
        </div>
    );
}

export default UnlinkedConstituencies;
