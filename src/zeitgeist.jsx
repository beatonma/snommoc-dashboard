import React from "react";
import { NoContent } from "./components/empty";
import { FeaturedItem } from "./components/featured";
import {
    ItemTitle,
    ItemContent,
    ListItem,
    ScrollableColumn,
} from "./components/list";
import { TaggedRow } from "./components/tag";

/**
 * {
 *   "motd": [
 *       {
 *           "title": "Example MOTD",
 *           "description": "Commons is still under development.",
 *           "action_url": "https://beatonma.org"
 *       }
 *   ],
 *   "people": [
 *       {
 *           "reason": "social",
 *           "target": {
 *               "parliamentdotuk": 4514,
 *               "name": "Keir Starmer",
 *               "portrait": "",
 *               "party": {
 *                   "parliamentdotuk": 15,
 *                   "name": "Labour"
 *               },
 *               "constituency": {
 *                   "parliamentdotuk": 146996,
 *                   "name": "Holborn and St Pancras"
 *               },
 *               "current_post": "Leader of the Labour Party"
 *           }
 *       },
 *   ],
 *   "divisions": [
 *       {
 *           "reason": "feature",
 *           "target": {
 *               "parliamentdotuk": 712319,
 *               "title": "Digital Economy Bill",
 *               "date": "2017-03-20",
 *               "passed": false,
 *               "house": "Lords"
 *           }
 *       },
 *   ],
 *   "bills": [
 *       {
 *           "reason": "social",
 *           "target": {
 *               "parliamentdotuk": 393258,
 *               "title": "Deep Sea Mining",
 *               "description": "A Bill to make provision about deep sea mining; and for connected purposes.",
 *               "date": "2014-05-15"
 *           }
 *       },
 *   ]
 * }
 *
 */

function Zeitgeist(props) {
    const zeitgeist = props.zeitgeist;
    if (Object.keys(zeitgeist).length == 0) {
        return <NoContent />;
    }

    return (
        <section>
            <h1>Zeitgeist</h1>
            <div className="zeitgeist">
                <Motd motd={zeitgeist.motd} />
                <FeaturedPeople
                    people={zeitgeist.people}
                    toggleFeatured={props.toggleFeatured}
                />
                <FeaturedBills
                    bills={zeitgeist.bills}
                    toggleFeatured={props.toggleFeatured}
                />
                <FeaturedDivisions
                    divisions={zeitgeist.divisions}
                    toggleFeatured={props.toggleFeatured}
                />
            </div>
        </section>
    );
}

function Section(props) {
    return (
        <div>
            <h3>{props.title}</h3>
            <ScrollableColumn>{props.children}</ScrollableColumn>
        </div>
    );
}

function Motd(props) {
    return (
        <Section title="MOTD">
            {props.motd.map(motd => {
                const content = (
                    <div>
                        <ItemTitle>{motd.title}</ItemTitle>
                        <ItemContent>{motd.description}</ItemContent>
                    </div>
                );

                return (
                    <a
                        key={motd.action_url}
                        href={motd.action_url}
                        title={motd.action_url}
                    >
                        <ListItem>
                            <TaggedRow
                                content={content}
                                tags={[motd.action_url]}
                            />
                        </ListItem>
                    </a>
                );
            })}
        </Section>
    );
}

function ZeitgeistSection(props) {
    return (
        <Section title={props.title}>
            {props.items.map(zeitgeistItem => {
                const item = zeitgeistItem.target;
                const featured = isFeatured(zeitgeistItem);
                const type = props.typeOf?.(item) || props.type;

                const toggleFeatured = () =>
                    props.toggleFeatured(type, item.parliamentdotuk, featured);

                return (
                    <FeaturedItem
                        key={item.parliamentdotuk}
                        social={isTrending(zeitgeistItem)}
                        featured={featured}
                        onClick={toggleFeatured}
                    >
                        {item.title || item.name}
                    </FeaturedItem>
                );
            })}
        </Section>
    );
}

function FeaturedPeople(props) {
    return (
        <ZeitgeistSection
            title="People"
            type="person"
            items={props.people}
            toggleFeatured={props.toggleFeatured}
        />
    );
}

function FeaturedBills(props) {
    return (
        <ZeitgeistSection
            title="Bills"
            type="bill"
            items={props.bills}
            toggleFeatured={props.toggleFeatured}
        />
    );
}

function FeaturedDivisions(props) {
    return (
        <ZeitgeistSection
            title="Divisions"
            typeOf={division =>
                division.house.toLowerCase() == "commons"
                    ? "commonsdivision"
                    : "lordsdivision"
            }
            items={props.divisions}
            toggleFeatured={props.toggleFeatured}
        />
    );
}

const isFeatured = obj => obj.reason == "feature";
const isTrending = obj => obj.reason == "social";

export default Zeitgeist;
