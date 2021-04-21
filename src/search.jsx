import React from 'react';
import './scss/search.scss';
import {DASHBOARD_URL} from './local/local';
import Tag from './components/tag';

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
            query: '',
            results: {},
            showResults: true,
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
        const url = `${DASHBOARD_URL}/search/${query}/`
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                this.setState({ results: data });
            });
    }

    onFocus() {
        this.setState({ showResults: true });
    }

    onBlur() {
        this.setState({ showResults: false });
    }

    render() {
        function onSubmit(event) {
            event.preventDefault();
            this.handleSubmit(this.state.query);
        }

        let searchResultsBlock;
        if (this.state.showResults) {
            searchResultsBlock = <SearchResults results={this.state.results} />
        }
        else {
            searchResultsBlock = <></>
        }

        return (
            <div>
                <form onSubmit={onSubmit} className="search-form">
                    <input className="search-bar" placeholder="Search" type="text" value={this.state.query} onChange={this.handleChange} onFocus={this.onFocus} onBlur={this.onBlur} />

                    { searchResultsBlock }
                </form>

            </div>
        );
    }
}

function SearchResults(props) {
    const results = props.results;

    if (Object.keys(results).length == 0) {
        return (
            <div></div>
        );
    }

    return (
        <div className="search-results">
            <div className="list-scroll">
                {
                    Object.keys(results).map((key) => {
                        const items = results[key];

                        return items.map((item) =>
                            <SearchResultItem type={key} name={item.name} url={item.url} id={item.id} />
                        )
                    })
                }
            </div>
        </div>
    );
}

function SearchResultItem(props) {
    return (
        <a href={props.url} className="search-result">
            <div className=" list-item search-result">
                <span>{truncateString(props.name, 60)}</span><Tag content={`${props.type} ${props.id}`} />
            </div>
        </a>
    );
}

function truncateString(str, num) {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '\u2026';
}

export default SearchForm