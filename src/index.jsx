import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import "./scss/dashboard.scss";
import SearchForm from "./search";
import UnlinkedConstituencyDetail, {
    UnlinkedConstituencies,
} from "./unlinked-constituencies";
import Zeitgeist from "./zeitgeist";
import Urls from "./local/local";
import RecentTasks, { CreateTaskActions } from "./tasks";
import { Error, InlineError } from "./components/error";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { requestConfig } from "./util/actions";
import { ActiveMembers } from "./members";

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

                <Route
                    path={Urls.activeMembers}
                    exact
                    component={ActiveMembers}
                />
            </Switch>
        </Router>
    );
}

function Dashboard(props) {
    const [zeitgeist, setZeitgeist] = useState({});
    const [dirty, setDirty] = useState(false);

    const refresh = () => setDirty(!dirty);

    useEffect(() => {
        fetch(Urls.zeitgeist)
            .then(response => response.json())
            .then(results => setZeitgeist(results));
    }, [dirty]);

    const toggleFeatured = (targetType, targetId, isFeatured) => {
        const url = Urls.actions.toggleFeatured(targetType, targetId);
        const requestType = isFeatured ? "DELETE" : "POST";
        const config = requestConfig(requestType);

        fetch(url, config).then(response => refresh());
    };

    const startTask = url =>
        fetch(url, requestConfig("POST")).then(response => console.log(url));

    let content;
    if (props.match?.params?.focussedUnlinkedConstituency) {
        content = (
            <UnlinkedConstituencyDetail
                id={props.match.params.focussedUnlinkedConstituency}
            />
        );
    } else {
        content = (
            <div>
                <CreateTaskActions
                    updateProfiles={() =>
                        startTask(Urls.actions.tasks.update_profiles)
                    }
                    updatePortraits={() =>
                        startTask(Urls.actions.tasks.update_portraits)
                    }
                    updateBills={() =>
                        startTask(Urls.actions.tasks.update_bills)
                    }
                    updateDivisions={() =>
                        startTask(Urls.actions.tasks.update_divisions)
                    }
                    updateElectionResults={() =>
                        startTask(Urls.actions.tasks.update_election_results)
                    }
                />
                <UnlinkedConstituencies />
                <RecentTasks />
                <Zeitgeist
                    zeitgeist={zeitgeist}
                    toggleFeatured={toggleFeatured}
                />
            </div>
        );
    }

    return (
        <DashboardChrome toggleFeatured={toggleFeatured}>
            {content}
        </DashboardChrome>
    );
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
