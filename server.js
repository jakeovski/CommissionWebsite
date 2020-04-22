const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

//Main Page
app.get('/', function(req,res) {
    res.render('pages/index');
});

//About Route
app.get('/about',function(req,res) {
    res.render('pages/about');
});

app.listen(8080);