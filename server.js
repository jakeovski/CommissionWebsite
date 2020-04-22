const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/exposure";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const popupS = require('popups');
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

//---------------Get Routes Section ----------------------------
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


//---------------Post Routes Section----------------------------
app.post('/register',function(req,res) {
    if(req.session.loggedin){popup.alert({content: "You are already logged in!"});res.redirect('/');return;}
    if (req.body.password != req.body.password2){popup.alert({content: "The passwords do not match"});return;}

    //Data to be stored from the form
    var datatostore = {
        "name": req.body.fullname,
        "login": {"username" : req.body.username, "password" : req.body.password},
        "email": req.body.email}

    //Adding it to the database
        db.collection('people').save(datatostore,function(err,result) {
            if(err) throw err;
            console.log("Saved to database");
            //when completed redirect to main page
            res.redirect('/');
        });

});