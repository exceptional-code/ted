/*
    This module will render the React vDOM.
*/

// import React to handle component functionality
import React from 'react';
// import ReactDOM to update vDOM
import ReactDOM from 'react-dom';
// import BrowserRouter to handle route mapping of components
import { BrowserRouter } from 'react-router-dom';
// import the App component to render in the root div
import { App } from './components'
// import the index.css file here for any global css styles
import './style/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)