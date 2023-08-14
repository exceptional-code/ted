import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { default as Home } from './Home';
// import the index.css file here for any global css styles
import '../style/index.css';

const App = () => {

    // render components in vDOM
    return (
        <div id="wrapper">
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
        </div>
    )
}

export default App;