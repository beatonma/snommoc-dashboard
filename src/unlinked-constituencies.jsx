import React from "react";
import { useHistory, withRouter } from "react-router";
import { DateOnly, DateRange } from "./components/datetime";
import NoContent from "./components/empty";
import {
    ItemContent,
    ItemTitle,
    ListItem,
    ScrollableColumn,
} from "./components/list";
import Section from "./components/section";
import { Icon, MaterialIcon } from "./components/symbol";
import { TaggedRow, TagLink, TODO } from "./components/tag";
import { Spotlight } from "./focussed";
import Urls from "./local/local.js";
import { requestConfig } from "./util/actions";

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
        fetch(Urls.unlinkedConstituencies)
            .then(response => response.json())
            .then(json => json.results)
            .then(results => this.setState({ results: results }))
            .catch(err => this.setState({ networkError: err }));
    }

    render() {
        return (
            <Section
                title="Unlinked Constituencies"
                url={Urls.unlinkedConstituencies}
                error={this.state.error}
                networkError={this.state.networkError}
            >
                <TODO />
                <div className="unlinked-constituencies list-scroll">
                    {this.state.results.map(item => (
                        <UnlinkedConstituency
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            url={item.url}
                            person={item.person}
                            election={item.election}
                            onClick={() => this.props.onItemFocus(item)}
                        />
                    ))}
                </div>
            </Section>
        );
    }
}

function UnlinkedConstituency(props) {
    const history = useHistory();
    const handleOnClick = () =>
        history.push(Urls.unlinkedConstituency(props.id));

    return (
        <div
            className="unlinked-constituency list-item"
            onClick={handleOnClick}
        >
            <TaggedRow content={<a href={props.url}>{props.name}</a>}>
                <TagLink href={props.person.url}>{props.person.name}</TagLink>
                <TagLink href={props.election.url}>
                    {props.election.name}
                </TagLink>
            </TaggedRow>
        </div>
    );
}

/**
 * {
 *     "name": "Barnsley East and Mexborough",
 *     "url": "/admin/repository/unlinkedconstituency/11/change/",
 *     "person": {
 *         "name": "Dr Matthew Offord",
 *         "url": "/api/member/4006/"
 *     },
 *     "election": {
 *         "name": "2001 General Election",
 *         "url": "/admin/repository/election/16/change/",
 *         "date": "2001-06-07"
 *     },
 *     "suggestions": [
 *         {
 *             "id": 143588,
 *             "name": "Barnsley Central",
 *             "url": "/api/constituency/143588/",
 *             "start": "1997-05-01",
 *             "end": "2010-05-06"
 *         },
 *         {
 *             "id": 143590,
 *             "name": "Barnsley East & Mexborough",
 *             "url": "/api/constituency/143590/",
 *             "start": "1997-05-01",
 *             "end": "2010-05-06"
 *         },
 *         {
 *             "id": 143592,
 *             "name": "Barnsley West & Penistone",
 *             "url": "/api/constituency/143592/",
 *             "start": "1997-05-01",
 *             "end": "2010-05-06"
 *         }
 *     ]
 * }
 */
class UnlinkedConstituencyDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            data: null,
            error: null,
            networkError: null,
        };

        this.update = this.update.bind(this);
        this.update();

        this.confirmLinkToConstituency = this.confirmLinkToConstituency.bind(
            this
        );
    }

    static getDerivedStateFromError(error) {
        return { error: error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error);
        console.error(errorInfo);
    }

    update() {
        fetch(Urls.unlinkedConstituency(this.state.id))
            .then(response => response.json())
            .then(data => this.setState({ data: data }))
            .catch(err => this.setState({ networkError: err }));
    }

    confirmLinkToConstituency(history, unlinkedID, constituencyID) {
        const config = requestConfig("POST");

        fetch(
            Urls.actions.confirmConstituency(unlinkedID, constituencyID),
            config
        )
            .then(response => {
                if (response.status < 300) {
                    history.push(Urls.dashboardHome);
                }
            })
            .catch(err => this.setState({ networkError: err }));
    }

    render() {
        const data = this.state.data;

        if (!data) {
            return <NoContent />;
        }

        const history = this.props.history;
        const suggestions = data.suggestions.sort((a, b) => b.score - a.score);

        return (
            <Spotlight>
                <Section
                    title="Unlinked Constituency"
                    url={window.location.href}
                    error={this.state.error}
                    networkError={this.state.networkError}
                >
                    <div className="unlinked-constituency">
                        <div>
                            <h3>{data.name}</h3>
                            <span>
                                {data.election.name}:{" "}
                                <DateOnly date={data.election.date} />
                            </span>
                            <div>
                                <a href={data.person.url}>{data.person.name}</a>
                            </div>
                        </div>

                        <h4>Suggested matches</h4>
                        <ScrollableColumn>
                            {suggestions.map(constituency => (
                                <SuggestedConstituency
                                    key={constituency.id}
                                    suggestion={constituency}
                                    onConfirm={() =>
                                        this.confirmLinkToConstituency(
                                            history,
                                            data.id,
                                            constituency.id
                                        )
                                    }
                                />
                            ))}
                        </ScrollableColumn>
                    </div>
                </Section>
            </Spotlight>
        );
    }
}

function SuggestedConstituency(props) {
    const suggestion = props.suggestion;

    return (
        <ListItem className="space-between">
            <div>
                <ItemTitle>
                    <TaggedRow content={suggestion.name}>
                        <TagLink href={suggestion.url}>{suggestion.id}</TagLink>
                    </TaggedRow>
                </ItemTitle>
                <ItemContent>
                    <DateRange start={suggestion.start} end={suggestion.end} />
                </ItemContent>
            </div>
            <ConfirmConstituencyAction onClick={props.onConfirm} />
        </ListItem>
    );
}

function ConfirmConstituencyAction(props) {
    return (
        <div className="action-icon" onClick={props.onClick}>
            <MaterialIcon icon={Icon.confirmConstituency} />
        </div>
    );
}

export default withRouter(UnlinkedConstituencyDetail);
export { UnlinkedConstituencies };
