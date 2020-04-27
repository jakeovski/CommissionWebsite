const php = require("php-to-node");


searchTerm = _GET['term'];

getDeviantResults(searchTerm);

//==== Boring test stuff ====
//accessString = getAccessToken();
//deviantName = "TokoWH";
//var_dump(checkDeviantHasOpenCommission(deviantName,accessString));
//getDeviantFeatImages(deviantName,accessString);
//var_dump(accessString);
//Searches deviant art for tags , returns echo of artist names and if commissions are open
//getUsernamesFromSearchTerm("pizza",24,0,accessString);
//getUsernamesFromSearchTerm("Animie",6,6,accessString);
//===========================

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