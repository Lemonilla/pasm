
function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
    document.getElementById("MenuBar").style.marginLeft = "200px";
    document.getElementsByClassName("CodeMirror")[0].style.marginLeft = "200px"
    document.getElementsByClassName("CodeMirror")[1].style.marginLeft = "200px"
    document.getElementsByClassName("CodeMirror")[2].style.marginLeft = "200px"
    document.getElementsByClassName("CodeMirror")[3].style.marginLeft = "200px"
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("MenuBar").style.marginLeft = "0px";
    document.getElementsByClassName("CodeMirror")[0].style.marginLeft = "0px"
    document.getElementsByClassName("CodeMirror")[1].style.marginLeft = "0px"
    document.getElementsByClassName("CodeMirror")[2].style.marginLeft = "0px"
    document.getElementsByClassName("CodeMirror")[3].style.marginLeft = "0px"
}

function Nav_goto(id){
    var active_element_title = {
        "code":" / PASM Code",
        "name":" / Quest Name",
        "shrt":" / Short Description",
        "long":" / Long Description"
    }
    var CodeMirror_elements_enum = {
        "code":0,
        "name":1,
        "long":2,
        "shrt":3
    }

    if (document.getElementsByClassName("CodeMirror").length !== 0){
        document.getElementsByClassName("CodeMirror")[0].style.display = "none"
        document.getElementsByClassName("CodeMirror")[1].style.display = "none"
        document.getElementsByClassName("CodeMirror")[2].style.display = "none"
        document.getElementsByClassName("CodeMirror")[3].style.display = "none"
        document.getElementById("currentPage").innerHTML = active_element_title[id]
        document.getElementsByClassName("CodeMirror")[CodeMirror_elements_enum[id]].style.display = "block"
    }
    return false;
}