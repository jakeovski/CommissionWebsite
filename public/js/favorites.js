function showFavorites() {
    var y = document.getElementById("favorite");
    if (y.style.backgroundColor === "#e0782e") {
        y.style.backgroundColor = "#555";
    }else{
        y.style.backgroundColor = "#e0782e"
    }
    var x = document.getElementById("show");
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}
