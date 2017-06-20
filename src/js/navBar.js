
function Nav_gotoCode(){
    document.getElementById("currentPage").innerHTML = " / PASM Code"

    return false;
}

function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
    document.getElementsByClassName("CodeMirror-fullscreen")[0].style.marginLeft = "200px";
    document.getElementById("MenuBar").style.marginLeft = "200px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementsByClassName("CodeMirror-fullscreen")[0].style.marginLeft = "0px";
    document.getElementById("MenuBar").style.marginLeft = "0px";
}

