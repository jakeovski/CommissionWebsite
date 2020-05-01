/*Created by Exposure Team
---- Version 1/05/2020*/

//Declaring variables
//MongoDB
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/exposure";
//Express
const express = require('express');
const session = require('express-session');
//BodyParser
const bodyParser = require('body-parser');
//Request
var request = require('request');
const app = express();


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

//CurrentUser stores currently logged in user username
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
    //Render main.ejs
    res.render('pages/main', {
        currentUser: currentUser
    });
});

//About Route
app.get('/about', function (req, res) {
    //If user is not logged in send him to aboute.ejs if he is send to about2.ejs
    if (!req.session.loggedin) { res.render('pages/about'); return; }
    res.render('pages/about2', {
        currentUser: currentUser
    });
});

//Login Route
app.get('/login', function (req, res) {
    //Render login.ejs
    res.render('pages/login');
});

//Register Route
app.get('/register', function (req, res) {
    //Render reg.ejs
    res.render('pages/reg');
});

//LogOut Route
app.get('/logout', function (req, res) {
    //Loggs Out the current user
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/');
});

//Profile Route
app.get('/profile', function (req, res) {
    //If not logged in send to log in page
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    //Gets username from query
    var uname = req.query.username;
    //Finds the user in the database and renders profile page
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
    //Check if user is logged in
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    db.collection('search').find().toArray(function (err, result) {
        if (err) throw err;
        res.render('pages/results', {
            currentUser: currentUser,
            data: result
        });
    });
});
//Gets addFavorite route and add selected artist to favorite
app.get('/addFavorite', function (req, res) {
    //Check if user is logged in
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    //Artist Details
    var link = req.query.profile;
    var thumb = req.query.image;
    //Add new field to user in people collection
    db.collection('people').update(
        { "login.username": currentUser },
        { $push: { "favorite": { "profile": link, "image": thumb } } }
    )
    //Redirect to 
    res.redirect('/results');
});

//Gets userProfile route and renders the page
app.get('/userProfile', function (req, res) {
    //Check if the user is logged in
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    //Artist details
    var uname = req.query.user;
    var icon = req.query.icon;

    //Main Function// Renders the Page
    getProfie();

    //Sends a request for DeviantArt access token, returns a promise
    function oAuth2() {

        var accesToken;
        //Create new promise
        return new Promise(function (resolve, reject) {
            //Request
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
                accesToken = json.access_token;
                resolve(accesToken);
            });
        });
    }

    //Function waits for request to resolve and returns access token
    async function getAccessToken() {
        var accessToken = await oAuth2();
        return accessToken;
    }
    //Function waits for access token then makes request for artist details
    async function connectToDeviantArt() {

        var accessToken = await getAccessToken();

        return new Promise(function (resolve, reject) {

            request('https://www.deviantart.com/api/v1/oauth2/user/profile/' + uname + '?ext_collections=false&ext_galleries=true&access_token=' + accessToken, function (err, res, body) {
                if (err) reject(err);
                var json = JSON.parse(body);
                resolve(json);
            });
        });
    }
    //Function waits for request to resolve and returns artist details
    async function getData() {
        var data = await connectToDeviantArt();
        return data;
    }
    //Function gets Artists Folder ID
    async function getFolderId() {
        var data = await getData();
        var folderId = data.galleries[0].folderid;
        return folderId;
    }
    //Function gets link to artist's profile
    async function getUrl() {
        var data = await getData();
        var url = data.profile_url;
        return url;
    }
    //Function gets artist's country
    async function getCountry() {
        var data = await getData();
        var country = data.country;
        return country;
    }
    //Function gets artists tagline
    async function getTagline() {
        var data = await getData();
        var tagline = data.tagline;
        return tagline;
    }
    //Function makes a request for artists gallery
    async function connectToGallery() {
        var folderId = await getFolderId();
        var accessToken = await getAccessToken();

        return new Promise(function (resolve, reject) {

            request('https://www.deviantart.com/api/v1/oauth2/gallery/' + folderId + '?username=' + uname + '&mode=popular&mature_content=true&access_token=' + accessToken, function (err, res, body) {
                if (err) reject(err);
                var json = JSON.parse(body);
                resolve(json);
            });
        });
    }
    //Function returns artists gallery
    async function getGallery() {
        var data = await connectToGallery();
        return data;
    }
    //Function gets array of images from artist's gallery
    async function getImages() {
        var gallery = await getGallery();
        var featured = [];
        for (var i = 0; i < 5; i++) {
            featured.push(gallery.results[i].thumbs[1].src);
        }
        return featured;
    }
    //Main function, waits for all the promises to resolve and renders the artist profile page
    async function getProfie() {
        var tagline = await getTagline();
        var country = await getCountry();
        var profile = await getUrl();
        var featured = await getImages();
        res.render('pages/userProfile', {
            username: uname,
            icon: icon,
            tagline: tagline,
            country: country,
            link: profile,
            featured: featured,
            currentUser: currentUser
        });
    }
})



//---------------Post Routes Section----------------------------
//results post route, does all the request handling
app.post('/results', function (req, res) {
    //Term to be searched
    var searchItem = req.body.searchBar + " commission";
    //Main function that redirects to results page
    sendToPage();

    //Sends a request for DeviantArt access token, returns a promise
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
    //Returns access token from the response
    async function getAccessToken() {
        var accessToken = await oAuth2();
        return accessToken;
    }

    //Makes a request for entered search term
    async function connectToDeviantArt() {
        var accessToken = await getAccessToken();

        return new Promise(function (resolve, reject) {

            request('https://www.deviantart.com/api/v1/oauth2/browse/popular?category_path=digitalart%2Fpaintings&q=' + searchItem + '&timerange=1month&limit=8&access_token=' + accessToken, function (err, res, body) {
                if (err) reject(err);
                var json = JSON.parse(body);
                resolve(json);
            });
        });
    }

    //Gets data from the response
    async function getData() {
        var data = await connectToDeviantArt();
        return data;
    }

    //Erasing 'search' collection for new data to be stored
    function EraseDatabase() {
        db.collection('search').drop(function (err, delOK) {
            if (err) {
                console.log("Database was empty => continue");
            }

        });
    }
    //Adds the data from response to a 'search' collection
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

    //Waits for a promise to be resolved and redirects to results page
    async function sendToPage() {
        await addToCollection();
        res.redirect('/results');
    }
});


//Gets the data from the login screen
app.post('/dologin', function (req, res) {
    console.log(JSON.stringify(req.body))
    //Gets user credentials
    var uname = req.body.username;
    var pword = req.body.password;
    //If user is in the database check if passwords match and redirect to main page 
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
        "email": req.body.email,
        "favorite": []
    }

    //Adding it to the database
    db.collection('people').save(datatostore, function (err, result) {
        if (err) throw err;
        console.log("Saved to database");
        //when completed redirect to main page
        res.redirect('/login');
    });

});

//-------------------------------------------------------------Server.js END------------------------------------------------------------