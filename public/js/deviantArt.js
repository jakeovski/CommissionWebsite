$(function () {
  $('#search').submit(function () {
    var searchItem = $("searchInput").val();
    getAccessToken(searchItem);
    return false;
  });
});

function getAccessToken(searchItem) {
  //var url = "https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=12052&client_secret=13ae1cb7fdfb9753668db6e2310c9323";
  $.ajax({
    url: "https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=12052&client_secret=13ae1cb7fdfb9753668db6e2310c9323",
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    type: "POST", /* or type:"GET" or type:"PUT" */
    headers: {  'Access-Control-Allow-Origin': '*' },
    dataType: "json",
    data: {
    },
    success: function (result) {
      // printJSON(jsondata);
      console.log(result)
    },
    error: function () {
      console.log("error");
    }
  });
}

function printJSON(jsondata) {
  var normal = JSON.stringify(jsondata);
  $('#results').append("<p>" + normal + "</p>");
}

