var fileData = null;

var filePath = null;
var fileURL = null;

function filePathToData() {
    const reader = new FileReader();
    reader.onload = function(e) {
        fileData = e.target.result;
        fileData = dataToJson(fileData);
    }
    reader.readAsText(filePath);
}

function httpRequest(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onload = function() {
            fileData = reader.result.toString();
            fileData = dataToJson(fileData);
        }
        reader.readAsText(xhr.response);
    }
    xhr.send();
}

function uploadFile(){
    if(filePath){
        filePathToData();
    } else if(fileURL){
        httpRequest(fileURL);
    } else {
        console.log("No file selected");
    }
}