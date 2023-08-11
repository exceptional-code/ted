import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { default as Home } from './Home';


/*
    progressive design
        mobile: 4 columns, 412px break point, 16px gutters & margins
        tablet: 6 columns, 912px break point, 32px gutters & margins
        desktop: 12 columns, 1280px break point, 32px gutters & margins
    layout
        church
            members/users
        groups
            group
                group type
                members
                joining information
        profile/home
            event attendance
            membership
        calendar
            date
                event
                time
                location
                notes
*/
const App = () => {

    // render components in vDOM
    return (
        <Routes>
            <Route
                path="/"
                element={<Home />}
            >
                <Route
                    path="home"
                    element={<Home />}
                />
            </Route>
        </Routes>
    )
}

export default App;