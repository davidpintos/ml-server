const express = require('express');
const cors = require('cors');

const app = express();

// settings
app.set('port', process.env.PORT || 4000);

app.use(cors());

// middlewares
app.use(express.json());


// routes
app.use('/api/items', require('./routes/items'));

module.exports = app;
