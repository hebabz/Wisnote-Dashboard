var annotationsForFilters = [];
var isRegrouped = false;
var hiddenRows = [];

function fillFilters(data) {
  let minDate = data.reduce((acc, curr) => {
    return acc.createdAt < curr.createdAt ? acc : curr;
  }).createdAt;
  let maxDate = data.reduce((acc, curr) => {
    return acc.createdAt > curr.createdAt ? acc : curr;
  }).createdAt;

  minDate = new Date(minDate).toISOString().split("T")[0];
  maxDate = new Date(maxDate).toISOString().split("T")[0];

  document.getElementById("dateFrom").value = minDate;
  document.getElementById("dateTo").value = maxDate;

  document.getElementById("dateFrom").min = minDate;
  document.getElementById("dateFrom").max = maxDate;

  document.getElementById("dateTo").min = minDate;
  document.getElementById("dateTo").max = maxDate;

  annotationsForFilters = data;

  let objectDescription = [];
  let objectPosition = [];
  data.forEach((annotation) => {
    annotation.item.forEach((item) => {
      if (item.objectDescription) {
        if (!objectDescription.includes(item["objectDescription"])) {
          objectDescription.push(item["objectDescription"]);
        }
      }
      if (item.objectPosition) {
        if (!objectPosition.includes(item["objectPosition"])) {
          objectPosition.push(item["objectPosition"]);
        }
      }
    });
  });

  objectDescription.forEach((description) => {
    let option = document.createElement("option");
    option.value = description;
    option.innerText = description;
    document.getElementById("objectDescription").appendChild(option);
  });

  objectPosition.forEach((position) => {
    let option = document.createElement("option");
    option.value = position;
    option.innerText = position;
    document.getElementById("objectPosition").appendChild(option);
  });
}

function updateAllFilters() {
  filterByDate();
  filterByDescription();
  filterByPosition();

  let table = document.getElementById("table-body");
  table.innerHTML = "";
  table = document.getElementsByTagName("tr")[0];
  table.innerHTML = "";
  fillTable(annotationsForFilters);

  let webPages = document.getElementById("filter-web-pages");
  Array.from(webPages.children).forEach((li) => {
    if (li.children[1]) {
      let page = li.children[0].getAttribute("data-url");
      if (hiddenRows.some((row) => row === page)) {
        li.children[0].checked = false;
      } else {
        li.children[0].checked = true;
      }
    }
  });

  filterByWebPages();

  if (isRegrouped) {
    document.querySelectorAll(".multiple").forEach((img) => {
      img.click();
    });
  }

  sortTable(true);

  annotationsForFilters = fileData;
}

function toggleRegroup(e) {
  isRegrouped = e.checked;
  if (e.checked) {
    document.getElementById("regroup-switch").disabled = true;
    document.querySelectorAll(".multiple").forEach((img) => {
      if (!img.parentElement.classList.contains("hidden")) {
        img.click();
      }
    });
    document.getElementById("regroup-switch").disabled = false;
  } else {
    document.querySelectorAll(".multiple").forEach((img) => {
      img.parentElement.classList.remove("hidden");
    });
    document.querySelectorAll(".single.child").forEach((img) => {
      img.remove();
    });
  }

}

function toggleAnnoType(e) {
  e.classList.toggle("low-opacity");

  let siblings = e.parentElement.children;

  annotationsForFilters = annotationsForFilters.filter((annotation) => {
    let sibling = null;
    for (let i = 0; i < siblings.length; i++) {
      if(siblings[i].tagName !== "IMG") continue;
      if (
        siblings[i].src.includes(symbolsImages[annotation["annotationType"]])
      ) {
        sibling = siblings[i];
        break;
      }
    }

    return !sibling.classList.contains("low-opacity");
  });

  updateAllFilters();
}

function filterByDate() {
  const minDate = new Date(document.getElementById("dateFrom").value);
  const maxDate = new Date(document.getElementById("dateTo").value);

  minDate.setHours(0, 0, 0, 0);
  maxDate.setHours(23, 59, 59, 999);

  annotationsForFilters = annotationsForFilters.filter((annotation) => {
    return (
      new Date(annotation.createdAt) >= minDate &&
      new Date(annotation.createdAt) <= maxDate
    );
  });
}

function filterByDescription() {
  const objectDescription = document.getElementById("objectDescription").value;

  if (objectDescription === "") {
    return;
  }
  annotationsForFilters = annotationsForFilters.filter((annotation) => {
    return annotation.item.some(
      (item) => item.objectDescription === objectDescription
    );
  });
}

function filterByPosition() {
  const objectPosition = document.getElementById("objectPosition").value;

  if (objectPosition === "") {
    return;
  }
  annotationsForFilters = annotationsForFilters.filter((annotation) => {
    return annotation.item.some(
      (item) => item.objectPosition === objectPosition
    );
  });
}

function filterByWebPages() {
  const webPages = document.getElementById("filter-web-pages");

  const checkedWebPages = Array.from(webPages.children).filter(
    (li) => li.children[0].checked
  );

  const table = document.getElementById("table-body");
  Array.from(table.children).forEach((row) => {
    let pageURL = row.id;
    if (checkedWebPages.some((li) => li.children[0].getAttribute("data-url") === pageURL)) {
      row.classList.remove("hidden");
      hiddenRows = hiddenRows.filter((row) => row !== pageURL);
    } else {
      row.classList.add("hidden");
      if (!hiddenRows.includes(pageURL)) {
        hiddenRows.push(pageURL);
      }
    }
  });
}
