

var userRoutes = [];

userRoutes.forEach(route => {
    $("#routeRow").append("<div class='col-sm-3'><div class='card'><div class='card-body'>" +
        "<h5 class='card-title'>" + route.name + "</h5>" +
        "<div class='btn-group btn-group' role='group' aria-label=" + route.name + ">"+
        "<a href='#' class='btn btn-success'>Share</a>" +
        "<a href='#' class='btn btn-primary'>See</a>" +
        "<a href='#' class='btn btn-danger'>Delete</a>" +
        "</div>"+
        "</div></div></div>");
});




