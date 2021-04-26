import React from "react";
import ReactDom from "react-dom";
import "./scss/dashboard.scss";
import SearchForm from "./search";
import UnlinkedConstituencies from "./unlinked-constituencies";
import Zeitgeist from "./zeitgeist";
import { apiUrl, dashboardUrl } from "./local/local";
import { getCsrfToken } from "./util/cookies";
import RecentTasks from "./tasks";

function app() {
    ReactDom.render(<Dashboard />, document.getElementById("dashboard"));
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zeitgeist: {},
        };

        this.refreshZeitgeist = this.refreshZeitgeist.bind(this);
        this.toggleFeatured = this.toggleFeatured.bind(this);

        this.refreshZeitgeist();
    }

    refreshZeitgeist() {
        const url = apiUrl("zeitgeist/");
        fetch(url)
            .then(response => response.json())
            .then(results => this.setState({ zeitgeist: results }));
    }

    toggleFeatured(targetType, targetId, isFeatured) {
        const endpoint = `featured-${targetType.toLowerCase()}`;
        const url = dashboardUrl(`actions/${endpoint}/${targetId}/`);

        const requestType = isFeatured ? "DELETE" : "POST";
        const config = {
            method: requestType,
            headers: {
                "Content-Type": "x-www-form-urlencoded",
                "X-CSRFToken": getCsrfToken(),
            },
        };

        fetch(url, config).then(response => this.refreshZeitgeist());
    }

    render() {
        return (
            <div>
                <SearchForm toggleFeatured={this.toggleFeatured} />
                <UnlinkedConstituencies />
                <RecentTasks />
                <Zeitgeist
                    zeitgeist={this.state.zeitgeist}
                    toggleFeatured={this.toggleFeatured}
                />
            </div>
        );
    }
}

app();
