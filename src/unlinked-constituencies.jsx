import React from 'react';
import Tag from './components/tag';
import {DASHBOARD_URL} from './local/local.js';

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
        };

        this.update = this.update.bind(this);
        this.update();
    }

    update() {
        const url = `${DASHBOARD_URL}/unlinked-constituencies/`;
        fetch(url)
            .then((response) => response.json())
            .then((json) => json.results)
            .then((results) => {
                this.setState({ results: results });
            });
    }

    render() {
        return (
            <section>
                <h1>Unlinked Constituencies</h1>
                <div className="unlinked-constituencies list-scroll">
                    {
                        this.state.results.map((item) =>
                            <UnlinkedConstituency name={item.name} url={item.name} mp={item.mp} election={item.election} />
                        )
                    }
                </div>
            </section>
        );
    }
}

function UnlinkedConstituency(props) {
    return (
        <div className="unlinked-constituency list-item">
            <a href={props.url}>
                <span>{props.name}</span>
            </a>
            <a href={props.mp.url}><Tag content={props.mp.name} /></a>
            <a href={props.election.url}><Tag content={props.election.name} /></a>
        </div>
    );
}

export default UnlinkedConstituencies