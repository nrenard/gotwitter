const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect('mongodb://goweek:goweek123@ds155293.mlab.com:55293/goweek-twitter-backend', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;

    return next();
});

app.use(cors());

app.use(express.json());

app.use(require('./routes'));

const port = 3000;
server.listen(port, () => console.log(`Server started on port: ${port}`));