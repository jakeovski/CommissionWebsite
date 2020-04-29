
function phpRequest(){

  //var termInput = "animal";


  $('#searchResultsBox').empty();
  //$('#resultsOverview').empty();

  $('#loadBox').append(
  '<div class="container d-flex justify-content-center">'+
    '<div class="spinner-border" role="status">'+
      '<span class="sr-only">Loading...</span>'+
    '</div>'+
  '</div>'
  );
  var termInput = $("#searchInput").val();

  alert("Search Started give it time deviant is slow");



  var searchTerm = {
        term: termInput,
    };

  $(document).ready(function(){
      $.ajax({
          url: '/results',
          type: 'get',
          data: searchTerm,
          dataType: 'JSON',
          success: function(response){

                  //console.log(response);
                  for (i = 0; i < (response.length)/2; i++) {
                  displayUser(response[0+i],response[1+i]);
                  console.log(response[0+i]);
                  console.log(response[1+i]);
                  }
                  //$("#searchResultsBox").append(response[0][0]);
                  basicAlert();

                  $('#loadBox').empty();

                  resultOverviewFunc( termInput , response.length , 15 , 25 );

              }
          })
      });
}

function resultOverviewFunc(searchTerm,results, commisions , repititions){

  $('#resultsOverview').append(
    '<div class="container">'+
      '<div class="container d-flex justify-content-center">'+
        '<h3> ' + searchTerm + ' </h3>'+
      '</div>'+

      '<div class="row">'+
        '<div class="col-sm"><div class="container d-flex justify-content-center">results : ' + results + '</div></div>'+
        '<div class="col-sm"><div class="container d-flex justify-content-center">Commissions Open : ' + commisions + '</div></div>'+
        '<div class="col-sm"><div class="container d-flex justify-content-center">Repititions : ' + repititions + '</div></div>'+
      '</div>'+
    '</div>'
  );


}

function basicAlert(){alert("Results Returned");}

function displayUser(deviant0 , deviant1){

  //Set Background colour
  //Deviant 0
  if (deviant0[1]){
    var deviant0Color = "rgba(0,255,0,0.3)";}
  else{
    var deviant0Color = "rgba(255,0,0,0.3)";}

    //Deviant 1
    if (deviant1[1]){
      var deviant1Color = "rgba(0,255,0,0.3)";}
    else{
      var deviant1Color = "rgba(255,0,0,0.3)";}


  //var deviant1Color = rgba(0,255,0,0.7);


  $('#searchResultsBox').append(


    '<div class="container">'+
        '<div class="row" style="display: flex; align-items: flex-start;">'+


      //First Deviant
      '<div class="col-lg-5 col-md-5 col-sm-12 col-xs-12 border border-dark rounded" style="background-color:' + deviant0Color + ';">'+
          '<h3 id="Artist" class=" d-flex justify-content-center" style="margin-bottom: 20px;">' + deviant0[0] + '</h3>'+
          '<div class="container" style="margin-top: 40px;">'+
              '<div class="row" style="display: flex; align-items: flex-end;">'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-left img-thumbnail border-warning" src="' +  deviant0[2][0] + '" alt="Drawing example" id="myImg">'  +
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-right img-thumbnail border-warning" src="' +  deviant0[2][1] + '" alt="Drawing example" id="myImg2">'   +
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-left img-thumbnail border-warning" src="' +  deviant0[2][2] + '" alt="Drawing example" id="myImg3">'+
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-right img-thumbnail border-warning" src="' +  deviant0[2][3] + '" alt="Drawing example" id="myImg4">'+
                  '</div>'+
              '</div>'+
          '</div>'+
      '</div>'+

      //Spacer
      '<div class="col-lg-2 col-md-2">'+
      '</div>'+

      //Second Deviant
      '<div class="col-lg-5 col-md-5 col-sm-12 col-xs-12 border border-dark rounded" style="background-color:' + deviant1Color + ';">'+
          '<h3 id="Artist" class=" d-flex justify-content-center" style="margin-bottom: 20px;">' + deviant1[0] + '</h3>'+
          '<div class="container" style="margin-top: 40px;">'+
              '<div class="row" style="display: flex; align-items: flex-end;">'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-left img-thumbnail border-warning" src="' +  deviant1[2][0] + '" alt="Drawing example" id="myImg">'  +
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-right img-thumbnail border-warning" src="' +  deviant1[2][1] + '" alt="Drawing example" id="myImg2">'   +
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-left img-thumbnail border-warning" src="' +  deviant1[2][2] + '" alt="Drawing example" id="myImg3">'+
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-right img-thumbnail border-warning" src="' +  deviant1[2][3] + '" alt="Drawing example" id="myImg4">'+
                  '</div>'+
              '</div>'+
          '</div>'+
      '</div>'+

    '</div>'+
  '</div>'

  );



/*
function displayUser(
  deviant0,commission0,image00,image01,image02,image03,
  deviant1,commission1,image10,image11,image12,image13
  ){

  $('#searchResultsBox').append(


    '<div class="container">'+
        '<div class="row" style="display: flex; align-items: flex-start;">'+

      //First Deviant
      '<div class="col-lg-5 col-md-5 col-sm-12 col-xs-12 border border-dark rounded">'+
          '<h3 id="Artist" class=" d-flex justify-content-center" style="margin-bottom: 20px;">' + deviant0 + '</h3>'+
          '<div class="container" style="margin-top: 40px;">'+
              '<div class="row" style="display: flex; align-items: flex-end;">'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-left img-thumbnail border-warning" src="' +  image00 + '" alt="Drawing example" id="myImg">'  +
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-right img-thumbnail border-warning" src="' +  image01 + '" alt="Drawing example" id="myImg2">'   +
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-left img-thumbnail border-warning" src="' +  image02 + '" alt="Drawing example" id="myImg3">'+
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-right img-thumbnail border-warning" src="' +  image03 + '" alt="Drawing example" id="myImg4">'+
                  '</div>'+
              '</div>'+
          '</div>'+
      '</div>'+

      //Spacer
      '<div class="col-lg-2 col-md-2">'+
      '</div>'+

      //Second Deviant
      '<div class="col-lg-5 col-md-5 col-sm-12 col-xs-12 border border-dark rounded">'+
          '<h3 id="Artist" class=" d-flex justify-content-center" style="margin-bottom: 20px;">' + deviant1 + '</h3>'+
          '<ul class="social-network social-circle d-flex justify-content-center">'+
              '<li><a href="#" class="icoInstagram" title="Instagram"> <i class="fa fa-instagram"></i></a></li>'+
              '<li><a href="#" class="icoTwitter" title="Twitter"><i class="fa fa-twitter"></i></a></li>'+
              '<li><a href="#" class="icoDeviant" title="DeviantArt"><i class="fa fa-deviantart"></i></a></li>'+
          '</ul>'+
          '<div class="container" style="margin-top: 40px;">'+
              '<div class="row" style="display: flex; align-items: flex-end;">'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-left img-thumbnail border-warning" src="' +  image10 + '" alt="Drawing example" id="myImg">'  +
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-right img-thumbnail border-warning" src="' +  image11 + '" alt="Drawing example" id="myImg2">'   +
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-left img-thumbnail border-warning" src="' +  image12 + '" alt="Drawing example" id="myImg3">'+
                  '</div>'+
                  '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
                      '<img class="img-fluid rounded float-right img-thumbnail border-warning" src="' +  image13 + '" alt="Drawing example" id="myImg4">'+
                  '</div>'+
              '</div>'+
          '</div>'+
      '</div>'+

    '</div>'+
  '</div>'

  );
*/


}
