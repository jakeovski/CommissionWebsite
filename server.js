const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

//Main Page
app.get('/', function(req,res) {
    res.render('public/views/pages/index');
});

app.listen(8080);