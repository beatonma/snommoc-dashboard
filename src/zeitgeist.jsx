import React from 'react';
import {API_URL} from './local/local';

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

class Zeitgeist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zeitgeist: {},
        };

        this.update = this.update.bind(this);
        this.update();
    }

    update() {
        const url = `${API_URL}/zeitgeist/`;
        fetch(url)
            .then((response) => response.json())
            .then((results) => {
                this.setState({ zeitgeist: results });
            });
    }

    render() {
        if (Object.keys(this.state.zeitgeist).length == 0) {
            return <></>;
        }

        return (
            <section>
                <h1>Zeitgeist</h1>
                <div class='zeitgeist'>
                    <FeaturedPeople people={this.state.zeitgeist.people}/>
                    <FeaturedBills bills={this.state.zeitgeist.bills}/>
                    <FeaturedDivisions divisions={this.state.zeitgeist.divisions}/>
                </div>
            </section>
        );
    }
}

function FeaturedPeople(props) {
    const people = props.people.map(item => item.target);

    return (
        <div>
            <h3>People</h3>
            <div className="list-scroll">
                {
                    people.map(person => 
                        <div className="list-item">
                            {person.name}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

function FeaturedBills(props) {
    const bills = props.bills.map(item => item.target);

    return (
        <div>
            <h3>Bills</h3>
            <div className="list-scroll">
                {
                    bills.map(bill => 
                        <div className="list-item">
                            {bill.title}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

function FeaturedDivisions(props) {
    const divisions = props.divisions.map(item => item.target);

    return (
        <div>
            <h3>Divisions</h3>
            <div className="list-scroll">
                {
                    divisions.map(division => 
                        <div className="list-item">
                            {division.title}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Zeitgeist