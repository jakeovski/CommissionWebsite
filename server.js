const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/exposure";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

//Using sessions
app.use(session({secret : 'example'}));

app.use(bodyParser.urlencoded({
    extended: true
}));

//Setting the view engine to ejs
app.set('view engine', 'ejs');

//Database
var db;

//Connection to mongo db
MongoClient.connect(url,function(err,database) {
    if(err) throw err;
    db = database;
    app.listen(8080);
    console.log('Listening on 8080');
});

app.use(express.static(__dirname + '/public'));

//Main Page
app.get('/', function(req,res) {
    res.render('pages/index');
});

//About Route
app.get('/about',function(req,res) {
    res.render('pages/about');
});

//Login Route
app.get('/login', function(req,res) {
    res.render('pages/login');
});

//Register Route
app.get('/register',function(req,res) {
    res.render('pages/reg');
});
