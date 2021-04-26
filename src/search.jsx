import React from "react";
import { Icon, MaterialIcon, Symbol } from "./components/symbol";
import { TaggedRow } from "./components/tag";
import { ScrollableColumn } from "./components/list";
import { NoContent } from "./components/empty";
import { dashboardUrl } from "./local/local";
import { FeaturedItem } from "./components/featured";
import "./scss/search.scss";

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
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
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

        const url = dashboardUrl(`search/${query}/`);
        fetch(url)
            .then(response => response.json())
            .then(data => this.setResults(data));
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

        return (
            <div>
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
                        <MaterialIcon
                            icon={Icon.close}
                            onClick={this.onBlur}
                            className="action-close-search"
                        />
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

                return items.map(item => {
                    const toggleFeatured = () =>
                        props.onToggleFeatured(key, item.id, item.featured);

                    return (
                        <SearchResultItem
                            key={item.id}
                            type={key}
                            name={item.name}
                            url={item.url}
                            id={item.id}
                            featured={item.featured}
                            onToggleFeatured={toggleFeatured}
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
                    content={truncateString(props.name, 60)}
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
