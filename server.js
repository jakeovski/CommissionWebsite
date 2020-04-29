//Declaring variables
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/exposure";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const deviantnode = require('deviantnode');
var request = require('request');
const app = express();


var clientid = '12052';
var clientSecret = '13ae1cb7fdfb9753668db6e2310c9323';

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

//Get route for the results
app.get('/results', function (req, res) {
    db.collection('search').find().toArray(function (err, result) {
        if (err) throw err;
        res.render('pages/results', {
            currentUser: currentUser,
            data: result
        });
    });
});

app.get('/search', function (req, res) {
    // var data = req.query.data;
    // var searchItem = req.query.searchItem;
    // res.send(data);
})



//---------------Post Routes Section----------------------------
app.post('/results', function (req, res) {
    //Search Item entered by user with added commission filter
    //     var searchItem = req.body.searchBar + " commission";


    //     let deviantSearch = function () {
    //         return deviantnode.getPopularDeviations(clientid, clientSecret, { category: "digitalart/paintings", q: searchItem, time: "alltime" })
    //     }

    //     deviantSearch().then(result => {
    //         return result;
    //     })

    //     var getResponse = async _ => {
    //         db.collection('search').drop();
    //         var result = await deviantSearch();
    //         return result;
    //     }

    //     var addToDatabase = async _ => {
    //         var result = await getResponse();
    //         for (var i = 0; i < result.results.length; i++) {
    //             var datatostore = {
    //                 "user": { "username": result.results[i].author.username, "userIcon": result.results[i].author.usericon },
    //                 "profile": result.results[i].url,
    //                 "image": result.results[i].thumbs[1].src
    //             }

    //             db.collection('search').save(datatostore, function (err, result) {
    //                 if (err) throw err;
    //                 console.log("Saved to database");
    //             })
    //         };
    //     };

    //     addToDatabase().then(renderResults());

    //     function renderResults() {
    //         res.redirect('/results');
    //     };
    var searchItem = req.body.searchBar + " commission";
    sendToPage();

    function oAuth2() {

        var accessToken;
        return new Promise(function (resolve, reject) {

            request({
                url: 'https://www.deviantart.com/oauth2/token',
                method: 'POST',
                form: {
                    'grant_type': 'client_credentials',
                    'client_id': '12052',
                    'client_secret': '13ae1cb7fdfb9753668db6e2310c9323'
                }
            }, function (err, res) {
                if (err) reject(err);
                var json = JSON.parse(res.body);
                //console.log("Access Token: ", json.access_token);
                accessToken = json.access_token;
                resolve(accessToken);
            });
        });
    }

    async function getAccessToken() {
        var accessToken = await oAuth2();
        return accessToken;
    }

    // auth : {
    //     'access_token' : accessToken
    // },
    // form: {
    //     'category_path' : 'digitalart/paintings',
    //     'q' : searchItem,
    //     'timerange' : '1month',
    // }
    async function connectToDeviantArt() {
        var accessToken = await getAccessToken();

        return new Promise(function (resolve, reject) {

            request('https://www.deviantart.com/api/v1/oauth2/browse/popular?category_path=digitalart%2Fpaintings&q=' + searchItem + '&timerange=1month&access_token=' + accessToken, function (err, res, body) {
                if (err) reject(err);
                var json = JSON.parse(body);
                resolve(json);
            });
        });
    }

    async function getData() {
        var data = await connectToDeviantArt();
        return data;
    }

    function EraseDatabase() {
        db.collection('search').drop(function(err,delOK) {
            if(err) {
                console.log("Database was empty => continue");
            }
            
        });
    }

    async function addToCollection() {
        await EraseDatabase();
        var data = await getData();
        for (var i = 0; i < data.results.length; i++) {
            var datatostore = {
                "user": { "username": data.results[i].author.username, "userIcon": data.results[i].author.usericon },
                "profile": data.results[i].url,
                "image": data.results[i].thumbs[1].src
            }

            db.collection('search').save(datatostore, function (err, result) {
                if (err) throw err;
                console.log("Saved to database");
            })
        };
    }

    async function sendToPage() {
        await addToCollection();
        res.redirect('/search');
    }

    
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

