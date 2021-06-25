import React, { useEffect, useState } from "react";
import Urls from "./local/local";
import { House } from "./components/house";
import { Loading } from "./components/loading";
import { postData } from "./util/actions";
import { Icon, MaterialIcon } from "./components/symbol";
import { Popup } from "./components/popus";
import "./scss/members.scss";
import NoContent from "./components/empty";

const SortingOptions = {
    name: (a, b) => a.name.localeCompare(b.name),
    missing_wiki: (a, b) => {
        if (a.wikipedia == b.wikipedia) return 0;
        else if (a.wikipedia) return 1;
        else return -1;
    },
};

export function ActiveMembers(props) {
    const [members, setMembers] = useState([]);
    const [dirty, setDirty] = useState(false);
    const refresh = () => setDirty(!dirty);
    const [sorting, setSorting] = useState("name");

    useEffect(() => {
        fetch(Urls.activeMembers)
            .then(response => response.json())
            .then(json => json["members"])
            .then(items => [...items].sort(SortingOptions[sorting]))
            .then(items => setMembers(items));
    }, [dirty, sorting]);

    if (members.length == 0) return <Loading />;

    return (
        <div>
            <Filters sortBy={sorting} setSortBy={setSorting} />
            <MemberList members={members} onDirty={refresh} />
        </div>
    );
}

function MemberList(props) {
    return (
        <div>
            {props.members.map(member => (
                <MemberListItem
                    key={member.parliamentdotuk}
                    member={member}
                    onDirty={props.onDirty}
                />
            ))}
        </div>
    );
}

function MemberListItem(props) {
    const member = props.member;
    const [editable, setEditable] = useState(false);
    const editableClass = editable ? "editing" : "";
    const [focussedWikiPage, setFocussedWikiPage] = useState(null);

    const onLoseFocus = e => {
        const currentTarget = e.currentTarget;
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                setEditable(false);
                setFocussedWikiPage(null);
            }
        }, 0);
    };

    const onDirty = () => {
        props.onDirty?.();
        setFocussedWikiPage(null);
        setEditable(false);
    };

    return (
        <div
            className="member"
            onBlur={onLoseFocus}
            tabIndex={0}
            onClick={() => setEditable(true)}
        >
            <div className={`member row space-between ${editableClass}`}>
                <div className="row">
                    <House house={member.house} />
                    <div className="member-name">{member.name}</div>
                </div>

                <div className="row">
                    <PortraitIcon hasPortrait={member.has_portrait} />
                    <Wikipedia
                        member={member}
                        onDirty={onDirty}
                        editable={editable}
                        focusWiki={setFocussedWikiPage}
                    />
                </div>
            </div>

            <WikipediaPreview url={focussedWikiPage} />
        </div>
    );
}

function Wikipedia(props) {
    const memberWiki = props.member.wikipedia;

    const icon = memberWiki ? Icon.check : Icon.edit;

    if (props.editable) {
        return (
            <EditableWikipedia
                member={props.member}
                onChanged={props.onDirty}
                focusWiki={props.focusWiki}
            />
        );
    }

    return (
        <div className={`member-wikipedia row ${memberWiki ? "" : "missing"}`}>
            <MaterialIcon
                icon={icon}
                className="wiki-icon"
                title={memberWiki ? memberWiki : "No registered wiki page"}
            />
        </div>
    );
}

function WikipediaPreview(props) {
    if (!props.url) {
        return <NoContent />;
    }

    return (
        <iframe
            className="wiki-preview"
            src={props.url}
            sandbox=""
            width="80%"
            height={600}
        />
    );
}

function EditableWikipedia(props) {
    const member = props.member;
    const [wikiPage, setValue] = useState(
        member.wikipedia || member.name.replace(" ", "_")
    );

    const wikiUrl = path => `https://en.wikipedia.org/wiki/${path}`;
    const submit = value => {
        console.log(`submit ${value}`);
        fetch(
            Urls.activeMembers,
            postData({
                member_id: member.parliamentdotuk,
                wikipedia: value,
            })
        ).then(response => {
            if (response.status == 204) {
                props.onChanged();
            }
        });
    };

    useEffect(() => {
        if (!member.wikipedia) {
            props.focusWiki(wikiUrl(wikiPage));
        }
    }, []);

    return (
        <div className="">
            <div className="member-wikipedia editing row">
                <form onSubmit={e => e.preventDefault()}>
                    <input
                        autoFocus
                        type="text"
                        placeholder="e.g. John_Johnson_(Politician)"
                        value={wikiPage}
                        onChange={event => {
                            event.preventDefault();
                            setValue(event.target.value.replace(" ", "_"));
                        }}
                        onKeyDown={event => {
                            if (event.key == "Enter") {
                                event.preventDefault();
                                submit(
                                    event.target.value.trim().replace(" ", "_")
                                );
                            }
                        }}
                    />
                </form>

                <div
                    className="action preview"
                    onClick={() => props.focusWiki(wikiUrl(wikiPage))}
                >
                    try it
                </div>

                <div
                    className="action"
                    onClick={e => {
                        e.preventDefault();
                        submit(wikiPage);
                    }}
                >
                    Confirm
                </div>
            </div>
        </div>
    );
}

function Filters(props) {
    return (
        <div className="filters row">
            <FilterIcon
                name="name"
                icon={Icon.sortByName}
                sortBy={props.sortBy}
                setSortBy={props.setSortBy}
            />
            <FilterIcon
                name="missing_wiki"
                icon={Icon.sortByMissingData}
                sortBy={props.sortBy}
                setSortBy={props.setSortBy}
            />
        </div>
    );
}

function FilterIcon(props) {
    const selectedClass =
        props.sortBy == props.name ? "filter-icon selected" : "filter-icon";
    return (
        <MaterialIcon
            icon={props.icon}
            onClick={() => props.setSortBy(props.name)}
            className={selectedClass}
            title={`Sort by ${props.name}`}
        />
    );
}

function PortraitIcon(props) {
    const icon = props.hasPortrait ? Icon.portrait : Icon.portrait_missing;

    return (
        <MaterialIcon
            icon={icon}
            title={props.hasPortrait ? "Has portrait" : "No portrait"}
        />
    );
}
