/*-----------------------------------------------------------------Simple Button Click Script-----------------------------------------------
* Created by Exposure Team
* Version 1/05/2020 */

function showFavorites() {
    //Selects the element by the id 'favorite'
    var y = document.getElementById("favorite");
    //Button color change function
    if (y.style.backgroundColor === "#e0782e") {
        y.style.backgroundColor = "#555 !important";
    } else {
        y.style.backgroundColor = "#e0782e ! important";
    }
    //Gets the element by the id 'show'
    var x = document.getElementById("show");
    //If div is not shown show it else hide
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}
