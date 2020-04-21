const express = require('express');
const app = express();


app.use(express.static('public'));

//Main Page
app.get('/', function(req,res) {
    res.send('index.html');
})
app.listen(8080);