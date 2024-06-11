require('dotenv').config();
const express = require('express');
const app = express();

const loaders = require('./loaders');


// Port to listen on (default: 3000)
const {PORT} = require('./config');

async function startServer(){
  //Initiate application loaders
    loaders(app);

    // Start the server and listen for requests
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
}



startServer();


