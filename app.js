const express = require('express');

const app = express();


// app.get('/', function (req, res) {
//     res.send('Hello Mitesh');
// });

app.get('/', (req, res) => {
    res.send('My First Response using Nodejs');
});

app.listen(500, function () {
    console.log('app is listening');
});