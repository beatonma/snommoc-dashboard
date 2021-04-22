import React from 'react';
import { ListItem, ScrollableColumn } from './components/list';

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
        return <></>;
    }

    return (
        <section>
            <h1>Zeitgeist</h1>
            <div className='zeitgeist'>
                <FeaturedPeople people={zeitgeist.people} />
                <FeaturedBills bills={zeitgeist.bills} />
                <FeaturedDivisions divisions={zeitgeist.divisions} />
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
                    people.map(person =>
                        <ListItem key={person.name}>
                            {person.name}
                        </ListItem>
                    )
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
                    bills.map(bill =>
                        <ListItem key={bill.parliamentdotuk}>
                            {bill.title}
                        </ListItem>
                    )
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
                    divisions.map(division =>
                        <ListItem key={division.parliamentdotuk}>
                            {division.title}
                        </ListItem>
                    )
                }

            </ScrollableColumn>
        </div>
    );
}

export default Zeitgeist