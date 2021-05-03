import React from "react";
import ReactDom from "react-dom";
import "./scss/dashboard.scss";
import SearchForm from "./search";
import {
    UnlinkedConstituencies,
    UnlinkedConstituencyDetail,
} from "./unlinked-constituencies";
import Zeitgeist from "./zeitgeist";
import Urls from "./local/local";
import { getCsrfToken } from "./util/cookies";
import RecentTasks from "./tasks";
import { Error, InlineError } from "./components/error";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function DashbaordApp() {
    ReactDom.render(<DashboardRouter />, document.getElementById("dashboard"));
}

function DashboardRouter() {
    return (
        <Router>
            <Switch>
                <Route path={Urls.dashboard("/")} exact component={Dashboard} />

                <Route
                    path={Urls.unlinkedConstituency(
                        ":focussedUnlinkedConstituency"
                    )}
                    component={Dashboard}
                />
            </Switch>
        </Router>
    );
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zeitgeist: {},
            error: null,
            networkError: null,
        };

        this.refreshZeitgeist = this.refreshZeitgeist.bind(this);
        this.toggleFeatured = this.toggleFeatured.bind(this);

        this.refreshZeitgeist();
    }

    static getDerivedStateFromError(error) {
        return { error: error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error);
        console.error(errorInfo);
    }

    refreshZeitgeist() {
        fetch(Urls.zeitgeist)
            .then(response => response.json())
            .then(results => this.setState({ zeitgeist: results }))
            .catch(err => this.setState({ networkError: err }));
    }

    toggleFeatured(targetType, targetId, isFeatured) {
        const url = Urls.toggleFeatured(targetType, targetId);
        const requestType = isFeatured ? "DELETE" : "POST";
        const config = {
            method: requestType,
            headers: {
                "Content-Type": "x-www-form-urlencoded",
                "X-CSRFToken": getCsrfToken(),
            },
        };

        fetch(url, config)
            .then(response => this.refreshZeitgeist())
            .catch(err => this.setState({ networkError: err }));
    }

    render() {
        let content;

        if (this.props.match?.params?.focussedUnlinkedConstituency) {
            content = (
                <UnlinkedConstituencyDetail
                    id={this.props.match.params.focussedUnlinkedConstituency}
                />
            );
        } else {
            content = (
                <div>
                    <UnlinkedConstituencies />
                    <RecentTasks />
                    <Zeitgeist
                        zeitgeist={this.state.zeitgeist}
                        toggleFeatured={this.toggleFeatured}
                    />
                </div>
            );
        }

        return (
            <DashboardChrome
                toggleFeatured={this.toggleFeatured}
                error={this.state.error}
                networkError={this.state.networkError}
            >
                {content}
            </DashboardChrome>
        );
    }
}

/**
 * Common UI shared by all screens.
 */
function DashboardChrome(props) {
    if (props.error) {
        return <Error message={props.error} />;
    }

    return (
        <div>
            <SearchForm toggleFeatured={props.toggleFeatured} />
            <InlineError message={props.networkError} />
            {props.children}
        </div>
    );
}

DashbaordApp();
