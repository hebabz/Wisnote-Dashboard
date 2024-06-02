var fileData = null;

var filePath = null;
var fileURL = null;

function toggleUpload(value) {
  const upload = document.querySelector("#file");
  const url = document.querySelector("#url");
  if (value === "file") {
    upload.style.display = "block";
    url.style.display = "none";
  } else {
    upload.style.display = "none";
    url.style.display = "block";
  }
}

function upload() {
  uploadFile();
}

function filePathToData() {
  const reader = new FileReader();
  reader.onload = function (e) {
    tmpData = e.target.result;
    fileData = dataToJson(tmpData);
  };
  reader.onloadend = function () {
    fillTable(fileData);
    fillOverview(fileData);
    fillFilters(fileData);
  };
  reader.readAsText(filePath);
}

function httpRequest(url) {
  document.querySelector("#loading").style.display = "";
  document.querySelector("#loading > *").style.display = "";
  document.querySelector("#upload").disabled = true;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      fileData = dataToJson(xhr.responseText);
      fillTable(fileData);
      fillOverview(fileData);
      fillFilters(fileData);
      document.querySelector("#loading").style.display = "none";
      document.querySelector("#loading > *").style.display = "none";
      document.querySelectorAll(".zone").forEach((zone) => {
        zone.classList.remove("hidden");
      });
      document.querySelector("#upload").disabled = false;
      //else if fail then display error message
    } else if (xhr.readyState == 4 && xhr.status != 200) {
      document.querySelector("#loading").style.display = "none";
      document.querySelector("#loading > *").style.display = "none";
      document.querySelector("#error").style.display = "block";
      document.querySelector("#error-message").innerHTML = "Error " + xhr.status + ": " + xhr.statusText;
      document.querySelector("#upload").disabled = false;
    }
  };
  xhr.send();
}

function uploadFile() {
  document.querySelectorAll(".zone").forEach((zone) => {
    if(!zone.classList.contains("hidden")) {
      zone.classList.add("hidden");
    }
  });
  document.querySelector("thead > tr").innerHTML = "";
  document.querySelector("#table-body").innerHTML = "";
  document.querySelector("#error").style.display = "none";

  const file = document.querySelector("#file").files[0];
  if (file) {
    filePath = file;
    filePathToData();
    document.querySelectorAll(".zone").forEach((zone) => {
      zone.classList.remove("hidden");
    });
    fileURL = null;
  } else if(document.querySelector("#url").value) {
    fileURL = document.querySelector("#url").value;
    httpRequest(fileURL);
    filePath = null;
  }
}
