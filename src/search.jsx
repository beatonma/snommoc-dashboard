import React, { useEffect, useState } from "react";
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

function SearchForm(props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const submitQuery = query => {
        if (query.length == 0) {
            setResults([]);
            return;
        }

        fetch(Urls.actions.search(query))
            .then(response => response.json())
            .then(data => setResults(data));
    };

    const toggleFeatured = (event, targetType, targetId, isFeatured) => {
        props.toggleFeatured(targetType, targetId, isFeatured);
        submitQuery(query);
    };

    const onValueChange = event => {
        const q = event.target.value;
        setShowResults(true);
        setQuery(q);
        submitQuery(q);
    };

    useEffect(() => {
        const onBodyClick = () => {
            console.log(`body click ${document.activeElement}`);

            if (
                !document
                    .getElementById("search_form")
                    ?.contains(document.activeElement)
            ) {
                setShowResults(false);
            }
        };

        document.body.addEventListener("click", onBodyClick);

        return () => {
            document.body.removeEventListener("click", onBodyClick);
        };
    }, []);

    return (
        <form
            id="search_form"
            onSubmit={event => event.preventDefault()}
            className="search-form"
            onClick={e => e.preventDefault()}
        >
            <div className="search-bar-wrapper">
                <span className="search-bar-span">
                    <input
                        className="search-bar"
                        placeholder={`Search${Symbol.ellips}`}
                        type="text"
                        value={query}
                        onChange={onValueChange}
                        onFocus={() => setShowResults(true)}
                    />
                </span>

                <RawLink query={query} />
            </div>

            <SearchResults
                results={results}
                onToggleFeatured={toggleFeatured}
                visible={showResults}
            />
        </form>
    );
}

function RawLink(props) {
    return props.query ? (
        <span className="raw">
            [<a href={Urls.actions.search(props.query)}>raw</a>]
        </span>
    ) : (
        <NoContent />
    );
}

function CloseButton(props) {
    return props.query ? (
        <MaterialIcon
            icon={Icon.close}
            onClick={props.onBlur}
            className="action-close-search"
        />
    ) : (
        <NoContent />
    );
}

function SearchResults(props) {
    if (!props.visible) return <NoContent />;

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
                    const toggleFeatured = event =>
                        props.onToggleFeatured(
                            event,
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
