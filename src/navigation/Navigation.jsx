import React from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Add from '../pages/Add';
import Overview from '../pages/Overview';
import TokenError from '../pages/TokenError';
import NotFound from '../pages/NotFound';
import Entry from '../pages/Entry';
import { ds } from '../stored/ds';

import './Navigation.css';

const routes = [
    {
        noNav: true,
        path: '/',
        component: <Entry />
    },
    {
        path: '/add',
        name: 'Add',
        component: <Add />,
    },
    {
        path: '/edit/:resid',
        component: <Add />
    },
    {
        path: '/overview',
        name: 'Overview',
        component: <Overview />,
    },
    {
        path: '/403',
        component: <TokenError />
    },
    {
        path: '*',
        component: <NotFound />
    },
];

const Navigation = () => {

    return (
        <Router>
            <div className="router-wrapper">
                <Switch>
                    {routes.map((route, i) => {
                        return <Route exact path={route.path} key={i}> {(route.noNav) ? <></> : <NavBar />} {route.component}</Route>
                    })}
                </Switch>
            </div>
        </Router>
    );
}

const NavBar = () => {
    return (
        <nav className="navbar">

            <p className="navbar-session-info">Token: {ds.token}</p>
            <div className="navbar-menu" >
                {routes.map((route, i) => {

                    if (route.name) {

                        return (


                            <Link key={i} className="navbar-menu-item" to={route.path}>{route.name}</Link>


                        )
                    } else return null;
                })}
            </div>
        </nav>
    )
}

export default Navigation;