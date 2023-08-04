/*
    This module creates the web server to be deployed so clients can connect
    using a pooled connection system. The deployed server will be the middle man
    between the client's app and the third party API/Database to make the most
    efficient use of connections. Express.js will be necessary to do this.
*/

// import express
const express = require('express');
// create a server variable to serve as the express function
const server = express();
// import path to knit variable directory paths together
const path = require('path');
// import the axios library
const axios = require('axios');
// import the cors library
const cors = require('cors');
// create a predetermined pool of HTTP clients to be re-used
const { createPool } = require('generic-pool');
// define the port of the Express.js server to run on port 4000 by default
const PORT = process.env.PORT || 4000;

const pool = createPool({
    create: () => axios.create(),
    destroy: (client) => {
        // cleanup logic tbd
    },
    /*
        Min and max number of connections in pool is set to 10
        so that no connections will be auto destroyed or auto created.
        All new connections will simply be acquired from existing connections
        in the pool.
    */
    min: 10,
    max: 10
});

// create the directory for serving static assets and use middleware to serve them from the directory
server.use(express.static(path.join(__dirname, 'build')));
// create middleware to translate all application/json data into JavaScript objects
// regardless of the .get, .put, .delete, requests performed on it.
server.use(express.json());
// enable cross-origin resource sharing to relax sop restrictions between front-end,
// proxy server, and third-party server
server.use(cors());
// setup the proxy server to communicate between client and third-party api
// any request that uses the /proxy route will manage the request through a connection pool
server.use('/proxy', async (req, res) => {
    try {
        // acquire a client connection from the connection pool
        const client = await pool.acquire();

        try {
            // given the following request parameters made to the third-party api,
            // store the response you get back using a client connection that encapsulates
            // axios
            const response = await client({
                // req.method will likely be application/json
                method: req.method,
                // req.url is the api endpoint being accessed (e.g., /api/v2)
                url: 'https://api.planningcenteronline.com' + req.url
            });
    
            /*
              Pass the third-party API response back to the front-end while
              JSONifying it just in case the data sent back from the third-party api
              was not in JSON format
            */
            res.json(response.data);
        } catch (error) {
            // Handle errors
            res.status(error.response?.status || 500).json({ error: 'Error proxying the request.' });
        } finally {
            // after the request finishes, release the client connection back into the connection pool
            // to be re-used again
            pool.release(client);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error acquiring an HTTP client.' });
    }
});
// Force the server to serve the React app if the server route requested doesn't exist
// The React app will then handle the unrecognized route request with a default response tbd later
server.use((req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// start the server listening on the specified port and display a success message
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}!`);
});