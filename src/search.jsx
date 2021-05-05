import React from "react";
import { Icon, MaterialIcon, Symbol } from "./components/symbol";
import { TaggedRow } from "./components/tag";
import { ScrollableColumn } from "./components/list";
import NoContent from "./components/empty";
import Urls from "./local/local";
import FeaturedItem from "./components/featured";
import "./scss/search.scss";
import { DateRange, DateTime } from "./components/datetime";

/**
 * Sample response:
 * {
 *   "$CollectionName": [
 *     {
 *       "name": "Boris Johnson",
 *       "url": "/api/member/1423/",
 *       "id": 1423
 *     },
 *     ...
 *   ],
 *   ...
 * }
 */

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            results: {},
            showResults: true,
            toggleFeatured: (targetType, targetId, isFeatured) => {
                props.toggleFeatured(targetType, targetId, isFeatured);
                this.handleSubmit(this.state.query);
            },
            error: null,
            networkError: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    static getDerivedStateFromError(error) {
        return { error: error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error);
        console.error(errorInfo);
    }

    handleChange(event) {
        this.setState({ query: event.target.value });
        this.handleSubmit(event.target.value);
    }

    handleSubmit(query) {
        if (query.length == 0) {
            this.setResults({});
            return;
        }

        fetch(Urls.actions.search(query))
            .then(response => response.json())
            .then(data => this.setResults(data))
            .catch(err => this.setState({ networkError: err }));
    }

    onFocus() {
        this.setState({ showResults: true });
    }

    onBlur() {
        this.setState({
            query: "",
            results: {},
        });
        window.focus();
    }

    setResults(value) {
        this.setState({ results: value });
    }

    render() {
        const error = this.state.error ? (
            <Error message={this.state.error} />
        ) : (
            <NoContent />
        );

        function onSubmit(event) {
            event.preventDefault();
            this.handleSubmit(this.state.query);
        }

        let searchResultsBlock;
        if (this.state.showResults) {
            searchResultsBlock = (
                <SearchResults
                    results={this.state.results}
                    onToggleFeatured={this.state.toggleFeatured}
                />
            );
        } else {
            searchResultsBlock = <NoContent />;
        }

        const rawLink = this.state.query ? (
            <span className="raw">
                [<a href={Urls.actions.search(this.state.query)}>raw</a>]
            </span>
        ) : (
            <NoContent />
        );

        const closeSearchAction = this.state.query ? (
            <MaterialIcon
                icon={Icon.close}
                onClick={this.onBlur}
                className="action-close-search"
            />
        ) : (
            <NoContent />
        );

        return (
            <div>
                {error}
                <form onSubmit={onSubmit} className="search-form">
                    <div className="search-bar-wrapper">
                        <span className="search-bar-span">
                            <input
                                className="search-bar"
                                placeholder={`Search${Symbol.ellips}`}
                                type="text"
                                value={this.state.query}
                                onChange={this.handleChange}
                                onFocus={this.onFocus}
                            />
                        </span>
                        {rawLink}
                        {closeSearchAction}
                    </div>

                    {searchResultsBlock}
                </form>
            </div>
        );
    }
}

function SearchResults(props) {
    const results = props.results;

    if (Object.keys(results).length == 0) {
        return <NoContent className="search-results" />;
    }

    return (
        <ScrollableColumn className="search-results">
            {Object.keys(results).map(key => {
                const items = results[key];
                items.sort((a, b) => {
                    if (a.score != b.score) {
                        return b.score - a.score;
                    }
                    if (a.start && b.start) {
                        return b.start.localeCompare(a.start);
                    }
                    return 0;
                });

                return items.map(item => {
                    const toggleFeatured = () =>
                        props.onToggleFeatured(
                            item.type,
                            item.id,
                            item.featured
                        );

                    return (
                        <SearchResultItem
                            key={item.id}
                            type={item.type}
                            name={item.name}
                            url={item.url}
                            id={item.id}
                            featured={item.featured}
                            onToggleFeatured={toggleFeatured}
                            start={item.start}
                            end={item.end}
                            score={item.score}
                        />
                    );
                });
            })}
        </ScrollableColumn>
    );
}

function SearchResultItem(props) {
    return (
        <FeaturedItem
            className="search-result"
            featured={props.featured}
            onClick={props.onToggleFeatured}
        >
            <a href={props.url}>
                <TaggedRow
                    content={
                        <div>
                            <div>{truncateString(props.name, 60)}</div>
                            <DateRange start={props.start} end={props.end} />
                            <DateTime datetime={props.date} />
                        </div>
                    }
                    tags={[`${props.type} ${props.id}`]}
                />
            </a>
        </FeaturedItem>
    );
}

function truncateString(str, num) {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + Symbol.ellips;
}

export default SearchForm;
