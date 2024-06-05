const express = require('express');
const app = express();

// Port to listen on (default: 3000)
const port = process.env.PORT || 3000;

// A simple route to respond with "Hello World!"
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server and listen for requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
