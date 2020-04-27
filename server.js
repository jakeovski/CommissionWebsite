//Declaring variables
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/exposure";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const php = require("php-to-node");
const app = express();



//Using sessions
app.use(session({secret : 'example'}));

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
MongoClient.connect(url,function(err,database) {
    if(err) throw err;
    db = database;
    app.listen(8080);
    console.log('Listening on 8080');
});

//Make server use public folder
app.use(express.static(__dirname + '/public'));

//---------------Get Routes Section ----------------------------
//Index Page Route
app.get('/', function(req,res) {
    res.render('pages/index');
});

//Main Page Route
app.get('/MainPage',function(req,res) {
    //if the user is not logged in redirect them to login page
    if(!req.session.loggedin){res.redirect('/login');return;}
    res.render('pages/main', {
        currentUser : currentUser
    });
});

//About Route
app.get('/about',function(req,res) {
    if(!req.session.loggedin){res.render('pages/about');return;}
    res.render('pages/about2', {
        currentUser : currentUser
    });
});

//Login Route
app.get('/login', function(req,res) {
    res.render('pages/login');
});

//Register Route
app.get('/register',function(req,res) {
    res.render('pages/reg');
});

//LogOut Route
app.get('/logout',function(req,res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/');
});

//Porfile Route
app.get('/profile',function(req,res) {
    var uname = req.query.username;

    db.collection('people').findOne({
        "login.username": uname
    }, function(err,result) {
        if (err) throw err;

        //Sending the result to the user page
        res.render('pages/profile', {
            user:result,
            currentUser : currentUser
        });
    });
});
//Deletes a user from the database
app.get('/delete',function(req,res) {
    //check for login
    if(!req.session.loggedin){res.redirect('/login');return;}
    //if so get the username
    var uname = currentUser;

    //checks for username in database if exists --> delete
    db.collection('people').deleteOne({"login.username" : uname}, function(err,result){
        if (err) throw err;
        //when complete redirect to the index
        res.redirect('/');
    });
});




//---------------Post Routes Section----------------------------
app.post('/results',function(req,res) {
    searchTerm = req.body.search;
    getDeviantResults(searchTerm);

})

//Gets the data from the login screen
app.post('/dologin', function(req,res) {
    console.log(JSON.stringify(req.body))
    var uname = req.body.username;
    var pword = req.body.password;

    db.collection('people').findOne({"login.username" :uname},function(err,result) {
        if (err) throw err;

        if (!result){res.redirect('/login');return}

        if (result.login.password == pword){ req.session.loggedin = true;res.redirect('/MainPage');currentUser = uname;}

        else {res.redirect('/login')}
    });
});

//Creates an entry of the user in the databaase
app.post('/register',function(req,res) {
    //if you are already logged in
    if(req.session.loggedin){console.log("Already logged in");res.redirect('/');return;}
    // if passwords do not match
    if (req.body.password != req.body.password2){console.log("Passwords do not match");return;}

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
            res.redirect('/login');
        });

});

//functions
function getAccessToken(){
    //Set URL that the http request is based off
    var url = "https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=12001&client_secret=819912f75515c010d93879e9c70f8d9e";
  
    var ch = curl_init();
    // Will return the response, if false it print the response
    curl_setopt(ch, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    curl_setopt(ch, CURLOPT_URL,url);
    // Execute
    var result=curl_exec(ch);
    // Closing
    curl_close(ch);
  
     //initialize blank string to store access token
     var accessString = "";
     //decode json into array
     var AccessJson = JSON.parse(result, true);
     //Search array for index "access_token" and set value
     accessString = AccessJson["access_token"];
     //return access token
     return accessString;
   
   }
   //echo accessString;
   
   //gets usernames find if commisons open(using function : checkDeviantHasOpenCommission)
   //returns 2D array that has usernames and commissions open
   function getUsernamesFromSearchTerm(searchTerm , limitImages, offsetAmount , accessString ){
     //Set URL that the http request is based off
     var urlTag = "https://www.deviantart.com/api/v1/oauth2/browse/tags?tag={searchTerm}&limit={limitImages}&offset={offsetAmount}&access_token={accessString}";
   
     var chTag = curl_init();
     // Will return the response, if false it print the response
     curl_setopt(chTag, CURLOPT_RETURNTRANSFER, true);
     // Set the url
     curl_setopt(chTag, CURLOPT_URL,urlTag);
     // Execute
     var resultTag=curl_exec(chTag);
     // Closing
     curl_close(chTag);
   
   
     //var_dump(resultTag);
     //Decodes initial JSON to array
   var json = JSON.parse(resultTag, true);
   //var_dump(json);
   //echo resultTag;
 
   var usernameArray = array();
   var commisonArray = array();
 
   //Loops through the arrays to find the usernames in the json file
   if (php.array_key_exists("results",json))
   {
     var resultString = json["results"];
     //var_dump(resultString);

      //var_dump(json);
    for (x = 0; x <= limitImages; x++) {
        //echo x;
        if (php.array_key_exists(x,resultString))
        {
          var resultStrings = resultString[x];
          //var_dump(resultStrings);
          //echo x;
  
          if (php.array_key_exists("author",resultStrings))
          {
            var resultStringss = resultStrings["author"];
            //var_dump (resultStringss);
  
            if (php.array_key_exists("username",resultStringss))
            {
              var resultStringsss = resultStringss["username"];
  
              //echo resultStringsss;
              var bool = checkDeviantHasOpenCommission(resultStringsss,accessString);
              //var_dump(bool);
              //echo nl2br("\n");
              //echo nl2br("\n");
  
              array_push(usernameArray,resultStringsss);
              array_push(commisonArray,bool);
  
            }
          }
  
        }
      }
    }
  
    //var_dump(usernameArray);
    //echo nl2br("\n");
    //var_dump(commisonArray);
  
    var outputArray = array(
      usernameArray,
      commisonArray
    );
    //var_dump(outputArray);
    return  outputArray ;
  }

  //Returns boolean true if client has commisions open -- Search needs improved
function checkDeviantHasOpenCommission(userNameToGet, accessString){

    //Set URL that the http request is based off
    var urlProfile = "https://www.deviantart.com/api/v1/oauth2/user/profile/{userNameToGet}?access_token={accessString}";
  
    var chProfile = curl_init();
    // Will return the response, if false it print the response
    curl_setopt(chProfile, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    curl_setopt(chProfile, CURLOPT_URL,urlProfile);
    // Execute
    var resultProfile=curl_exec(chProfile);
    // Closing
    curl_close(chProfile);
  
    //echo resultProfile;
  
    var commissionsOpen = false;
  
    //var_dump(resultProfile);
    //Decode Json into array
    var ProfileArray = JSON.parse(resultProfile, true);
    //var_dump(ProfileArray);
  
    //Search Array for the index bio and return it as a string
    if (php.array_key_exists("bio",ProfileArray))
    {
      var bioString = ProfileArray["bio"];
    }
  
  
    //word to look for
    var word = "commission";
  
    //Searches for word in the string
    if(strpos(bioString, word) !== false){
        //  echo nl2br("\n");
        //  echo "word Found!";
        commissionsOpen = true;
    } else{
        //  echo nl2br("\n");
        //  echo "word Not Found!";
        commissionsOpen = false;
    }

    //Returns array length of 4 strings html for images
function getDeviantFeatImages(deviantName,accessString){

    var urlTag = "https://www.deviantart.com/api/v1/oauth2/gallery/featured?username={deviantName}&limit=6&access_token={accessString}";
  
    var chTag = curl_init();
    // Will return the response, if false it print the response
    curl_setopt(chTag, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    curl_setopt(chTag, CURLOPT_URL,urlTag);
    // Execute
    var resultTag=curl_exec(chTag);
    // Closing
    curl_close(chTag);
  
    var output = JSON.parse(resultTag, true);
  
    //var_dump(output);
    var imagesArray = array();
  
    if (php.array_key_exists("results",output))
    {
      var resultString = output["results"];
  
      for (x = 1; x <= 4; x++) {
        //echo x;
        if (php.array_key_exists(x,resultString))
        {
          var resultStrings = resultString[x];
          //echo x;
          if (php.array_key_exists("content",resultStrings))
          {
            var resultStringsss = resultStrings["content"];
  
            if (php.array_key_exists("src",resultStringsss))
            {
              var resultStringsssss = resultStringsss["src"];
              //echo resultStringsssss;
              array_push(imagesArray,resultStringsssss);
              //echo nl2br("\n");
              //echo nl2br("\n");
            }
          }
        }
      }

    }
    //var_dump(imagesArray);
    return imagesArray;
  
  }
  
  
  /*
  Returns array of deviants each deviant has:
      Username
      commission
      4 featured images
  */
  function getDeviantResults(searchTerm){
  
    var outputArray = array();
  
    var accessString = getAccessToken();
  
    //24 is limit for normal API key, no offset needed since max is 24
    var usernameCommissionArray = getUsernamesFromSearchTerm(searchTerm,24,0,accessString);
    //getUsernamesFromSearchTerm(searchTerm , limitImages, offsetAmount , accessString );
    //var_dump(usernameCommissionArray);
  
    for(i=1; i<=20; i++){
  
      var userArray = array();
  
      //Adding username to array
      var currentUsername = usernameCommissionArray[0][i];
      array_push(userArray,currentUsername);
  
      //adding if they have commisions open to array
      var commissionArray = usernameCommissionArray[1];
      var currentCommission = commissionArray[i];
      array_push(userArray,currentCommission);
  
      //adding images array to array
      var currentImageArray = getDeviantFeatImages(currentUsername,accessString);
      array_push(userArray,currentImageArray);
      //echo currentUsername;
      //var_dump(currentCommission);
      //echo nl2br("\n");
  
      //Add user to outputarray
      array_push(outputArray,userArray);

    }

    //var_dump(outputArray);
    var output = JSON.stringify(outputArray);
    return output;
  
  };
  
};
