function showMore() {

  $('#showMoreButton').empty();

  $('#mainResults').append(
    "<div class='col-lg-5 col-md-5 col-sm-12 col-xs-12 border border-dark rounded' style='margin: auto; margin-top: 20px;' id = 'result'>< img src = '<%=data[4].user.userIcon%>' class= 'd-flex justify-content-center img-raised rounded-circle' style = 'margin: auto;width: 100px;' ><h3 id='Artist' class=' d-flex justify-content-center' style='margin-bottom: 10px; font-size: 40px;'><%= data[4].user.username %></h3><ul class='social-network social-circle d-flex justify-content-center'><li><a href='<%=data[4].profile %>' class='icoDeviant' title='DeviantArt'><i class='fa fa-deviantart'></i></a></li></ul><div class='container' style='margin-top: 40px;'><div class='row' style='display: flex; align-items: flex-end;'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><img class='img-fluid rounded mx-auto d-block img-thumbnail border-warning' src='<%=data[4].image %>' alt='Drawing example' id='myImg'></div></div></div></div>"
  );
}