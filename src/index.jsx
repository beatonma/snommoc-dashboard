import React from 'react';
import ReactDom from 'react-dom';
import './scss/colors-dark.scss';
import './scss/dashboard.scss';
import SearchForm from './search';
import UnlinkedConstituencies from './unlinked-constituencies';
import Zeitgeist from './zeitgeist';

function app() {
    ReactDom.render(
        <Dashboard />,
        document.getElementById('dashboard')
    );
}

function Dashboard(props) {
    return (
        <div>
            <SearchForm />
            <UnlinkedConstituencies />
            <Zeitgeist />
        </div>
    );
}

app();