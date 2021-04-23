import React from 'react';
import { NoContent } from './components/empty';
import { FeaturedItem } from './components/featured';
import { ListItem, ScrollableColumn } from './components/list';
import './scss/zeitgeist.scss';

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
 *  */


function Zeitgeist(props) {
    const zeitgeist = props.zeitgeist;
    if (Object.keys(zeitgeist).length == 0) {
        return <NoContent />;
    }

    return (
        <section>
            <h1>Zeitgeist</h1>
            <div className='zeitgeist'>
                <FeaturedPeople people={zeitgeist.people} toggleFeatured={props.toggleFeatured} />
                <FeaturedBills bills={zeitgeist.bills} toggleFeatured={props.toggleFeatured} />
                <FeaturedDivisions divisions={zeitgeist.divisions} toggleFeatured={props.toggleFeatured} />
            </div>
        </section>
    );
}

function FeaturedPeople(props) {
    const people = props.people.map(item => item.target);

    return (
        <div>
            <h3>People</h3>
            <ScrollableColumn>
                {
                    people.map(person => {
                        const toggleFeatured = () => props.toggleFeatured('person', person.parliamentdotuk, true);

                        return (
                            <FeaturedItem key={person.name} featured={true} onClick={toggleFeatured}>
                                {person.name}
                            </FeaturedItem>
                        );
                    })
                }
            </ScrollableColumn>
        </div>
    );
}

function FeaturedBills(props) {
    const bills = props.bills.map(item => item.target);

    return (
        <div>
            <h3>Bills</h3>
            <ScrollableColumn>
                {
                    bills.map(bill => {
                        const toggleFeatured = () => props.toggleFeatured('bill', bill.parliamentdotuk, true);

                        return (
                            <FeaturedItem key={bill.parliamentdotuk} featured={true} onClick={toggleFeatured}>
                                {bill.title}
                            </FeaturedItem>
                        );
                    })
                }
            </ScrollableColumn >
        </div >
    );
}

function FeaturedDivisions(props) {
    const divisions = props.divisions.map(item => item.target);

    return (
        <div>
            <h3>Divisions</h3>
            <ScrollableColumn>
                {
                    divisions.map(division => {
                        const toggleFeatured = () => {
                            const type = division.house.toLowerCase() == 'commons' ? 'commonsdivision' : 'lordsdivision';
                            return props.toggleFeatured(type, division.parliamentdotuk, true);
                        };

                        return (
                            <FeaturedItem key={division.parliamentdotuk} featured={true} onClick={toggleFeatured}>
                                {division.title}
                            </FeaturedItem>
                        );
                    })
                }

            </ScrollableColumn>
        </div>
    );
}

export default Zeitgeist