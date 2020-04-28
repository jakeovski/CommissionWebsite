//Declaring variables
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/exposure";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const deviantnode = require('deviantnode');
const app = express();


var clientid = '12052';
var clientSecret = '13ae1cb7fdfb9753668db6e2310c9323';
var output = "";
//Using sessions
app.use(session({ secret: 'example' }));

//Using body Parser
app.use(bodyParser.urlencoded({
    extended: true
}));

//Setting the view engine to ejs
app.set('view engine', 'ejs');

//Database
var db;

//CurrentUser
var currentUser;

//Connection to mongo db
MongoClient.connect(url, function (err, database) {
    if (err) throw err;
    db = database;
    app.listen(8080);
    console.log('Listening on 8080');
});

//Make server use public folder
app.use(express.static(__dirname + '/public'));




//---------------Get Routes Section ----------------------------
//Index Page Route
app.get('/', function (req, res) {
    res.render('pages/index');
});

//Main Page Route
app.get('/MainPage', function (req, res) {
    //if the user is not logged in redirect them to login page
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    res.render('pages/main', {
        currentUser: currentUser
    });
});

//About Route
app.get('/about', function (req, res) {
    if (!req.session.loggedin) { res.render('pages/about'); return; }
    res.render('pages/about2', {
        currentUser: currentUser
    });
});

//Login Route
app.get('/login', function (req, res) {
    res.render('pages/login');
});

//Register Route
app.get('/register', function (req, res) {
    res.render('pages/reg');
});

//LogOut Route
app.get('/logout', function (req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/');
});

//Porfile Route
app.get('/profile', function (req, res) {
    var uname = req.query.username;

    db.collection('people').findOne({
        "login.username": uname
    }, function (err, result) {
        if (err) throw err;

        //Sending the result to the user page
        res.render('pages/profile', {
            user: result,
            currentUser: currentUser
        });
    });
});
//Deletes a user from the database
app.get('/delete', function (req, res) {
    //check for login
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    //if so get the username
    var uname = currentUser;

    //checks for username in database if exists --> delete
    db.collection('people').deleteOne({ "login.username": uname }, function (err, result) {
        if (err) throw err;
        //when complete redirect to the index
        res.redirect('/');
    });
});




//---------------Post Routes Section----------------------------
app.post('/results', function (req, res) {
    //Search Item entered by user with added commission filter
    var searchItem = req.body.search + " commission";
    //console.log(searchItem);
    //As DeviantArt API uses returns only promises we will have to work with that
    //Getting the promise into a variable for convinience
    var deviantsearch = deviantnode.getPopularDeviations(clientid, clientSecret, { category: "digitalart/paintings", q: searchItem, time: "alltime" });
    //Clearing the search collection so it is ready for new search results
    console.log("Collection pre-cleaning complete: " + db.collection('search').drop());
    //Promise work
    deviantsearch.then(response => {
        //Loop through the response and add all the necessary info into our database
        for (var i = 0; i < response.results.length; i++) {
            var datatostore = {
                "user": { "username": response.results[i].author.username, "userIcon": response.results[i].author.usericon },
                "profile": response.results[i].url,
                "image": response.results[i].thumbs[1].src
            }

            db.collection('search').save(datatostore, function (err, result) {
                if (err) throw err;
                console.log("Saved to database");
            })
        };
        res.render('pages/results', {
            currentUser : currentUser,
            deviantName : db.collection('search').distinct("user.username"),
            deviantProfile : db.collection('search').distinct("profile"),
            devinatImage : db.collection('search').distinct("image")
        });
    });

});

//Gets the data from the login screen
app.post('/dologin', function (req, res) {
    console.log(JSON.stringify(req.body))
    var uname = req.body.username;
    var pword = req.body.password;

    db.collection('people').findOne({ "login.username": uname }, function (err, result) {
        if (err) throw err;

        if (!result) { res.redirect('/login'); return }

        if (result.login.password == pword) { req.session.loggedin = true; res.redirect('/MainPage'); currentUser = uname; }

        else { res.redirect('/login') }
    });
});

//Creates an entry of the user in the databaase
app.post('/register', function (req, res) {
    //if you are already logged in
    if (req.session.loggedin) { console.log("Already logged in"); res.redirect('/'); return; }
    // if passwords do not match
    if (req.body.password != req.body.password2) { console.log("Passwords do not match"); return; }

    //Data to be stored from the form
    var datatostore = {
        "name": req.body.fullname,
        "login": { "username": req.body.username, "password": req.body.password },
        "email": req.body.email
    }

    //Adding it to the database
    db.collection('people').save(datatostore, function (err, result) {
        if (err) throw err;
        console.log("Saved to database");
        //when completed redirect to main page
        res.redirect('/login');
    });

});

