const symbolsImages = {
  defect: "triangle.png",
  question: "diamond.png",
  comment: "square.png",
  other: "star.png",
  thesaurus: "resource.png",
};

var sortById = 0;

var removedAnnotations = [];

function fillTable(tableData) {
  const columns = [
    "Web pages",
    "Total visible annotations",
    "Object annotations",
    "Web page annotations",
    "Website annotations",
  ];

  const connectionTypes = ["object", "dashboard", "--"];

  const annotationTypes = [
    "defect",
    "question",
    "comment",
    "other",
    "thesaurus",
  ];

  const webPages = [...new Set(tableData.map((rowData) => rowData["pageUrl"]))];

  function fromURItoLastPart(uri) {
    const lastSlashIndex = uri.lastIndexOf("/");
    if (lastSlashIndex !== -1) {
      return decodeURIComponent(
        decodeURIComponent(uri.substring(lastSlashIndex + 1))
      );
    }
    return uri;
  }

  const headerRow = document.getElementsByTagName("tr")[0];
  columns.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    if (key === "Web pages") {
      const sortBy = document.createElement("div");
      sortBy.classList.add("sort-by");
      const label = document.createElement("label");
      label.setAttribute("for", "sortBy");
      label.textContent = "Sort by:";
      sortBy.appendChild(label);
      const select = document.createElement("select");
      select.id = "sortBy";
      select.classList.add("form-select");
      select.onchange = function () {
        sortTable(false);
      };
      const options = [
        "Web page (A ➔ Z)",
        "Web page (Z ➔ A)",
        "Date (chronological)",
        "Date (reverse chronological)",
        "Total annotations (ascending)",
        "Total annotations (descending)",
      ];
      options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        opt.id = options.indexOf(option);
        select.appendChild(opt);
      });
      sortBy.appendChild(select);
      th.appendChild(sortBy);

      /* Filter web pages */
      const filterWebPages = document.createElement("div");
      filterWebPages.classList.add("filter-web-pages");
      const button = document.createElement("button");
      button.classList.add("btn");
      button.classList.add("dropdown-toggle");
      button.setAttribute("type", "button");
      button.setAttribute("id", "dropdownMenuButton");
      button.setAttribute("data-bs-toggle", "dropdown");
      button.setAttribute("aria-expanded", "false");
      button.textContent = "Filter web pages:";

      filterWebPages.appendChild(button);
      const ul = document.createElement("ul");
      ul.classList.add("dropdown-menu");
      ul.setAttribute("id", "filter-web-pages");
      ul.setAttribute("aria-labelledby", "dropdownMenuButton");
      const li = document.createElement("li");
      li.classList.add("form-check");
      const inputSelectAll = document.createElement("input");
      inputSelectAll.classList.add("form-check-input");
      inputSelectAll.setAttribute("type", "checkbox");
      inputSelectAll.setAttribute("id", "selectAll");
      inputSelectAll.setAttribute("checked", true);
      inputSelectAll.onclick = function () {
        const checked = this.checked;
        document
          .querySelectorAll("#filter-web-pages input")
          .forEach((input) => {
            input.checked = checked;
          });
        filterByWebPages();
      };
      li.appendChild(inputSelectAll);
      const labelSelectAll = document.createElement("label");
      labelSelectAll.classList.add("form-check-label");
      labelSelectAll.setAttribute("for", "selectAll");
      labelSelectAll.textContent = "Select all";
      li.appendChild(labelSelectAll);
      ul.appendChild(li);
      webPages.forEach((page) => {
        const pageName = fromURItoLastPart(page);
        const li = document.createElement("li");
        li.classList.add("form-check");
        const input = document.createElement("input");
        input.classList.add("form-check-input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("id", pageName);
        input.setAttribute("data-url", page);
        input.setAttribute("checked", true);
        input.onclick = function () {
          const selectAll = document.getElementById("selectAll");
          if (
            document.querySelectorAll(
              "#filter-web-pages input:checked:not(#selectAll)"
            ).length === webPages.length
          ) {
            selectAll.checked = true;
          } else {
            selectAll.checked = false;
          }
          filterByWebPages();
        };
        li.appendChild(input);
        const label = document.createElement("label");
        label.classList.add("form-check-label");
        label.setAttribute("for", pageName);
        label.textContent = pageName;
        li.appendChild(label);
        ul.appendChild(li);
      });
      filterWebPages.appendChild(ul);
      th.appendChild(filterWebPages);
    }
    headerRow.appendChild(th);
  });

  const tbody = document.getElementById("table-body");

  webPages.forEach((pageUrl) => {
    const row = document.createElement("tr");
    row.id = pageUrl;
    const pageCell = document.createElement("td");
    const pageLink = document.createElement("a");
    pageLink.href = pageUrl;
    pageLink.textContent = fromURItoLastPart(pageUrl);
    pageLink.setAttribute("data-toggle", "tooltip");
    pageLink.setAttribute("data-placement", "top");
    pageLink.setAttribute("title", pageUrl);
    pageCell.appendChild(pageLink);
    row.appendChild(pageCell);

    const totalCell = document.createElement("td");
    const removedAnnotationsInTable = removedAnnotations.filter((id) =>
      tableData.some((rowData) => rowData["_id"] === id)
    );
    const removedAnnotationsCount = removedAnnotationsInTable.filter(
      (id) => tableData.find((rowData) => rowData["_id"] === id)["pageUrl"] === pageUrl
    ).length;
    console.log(pageUrl, removedAnnotationsCount);
    const totalAnnotations = tableData.filter(
      (rowData) => rowData["pageUrl"] === pageUrl
    ).length - removedAnnotationsCount;
    totalCell.classList.add("text-center");
    totalCell.classList.add("total-cell");
    totalCell.textContent = totalAnnotations;
    row.appendChild(totalCell);

    connectionTypes.forEach((connectionType) => {
      const annotations = tableData.filter(
        (rowData) =>
          rowData["pageUrl"] === pageUrl &&
          rowData["connectionType"] === connectionType
      );
      const cell = document.createElement("td");
      annotationTypes.forEach((annotationType) => {
        const cellAnnotationsOfType = annotations.filter(
          (rowData) => rowData["annotationType"] === annotationType
        );
        const annotationTypeLength = cellAnnotationsOfType.length;
        if (annotationTypeLength > 0) {
          link = null;
          if (annotationTypeLength > 1) {
            link = document.createElement("a");
            link.href = "javascript:void(0)";
            link.classList.add("position-relative");
            link.style.display = "inline-block";
            const img = document.createElement("img");
            img.src = `./images/${symbolsImages[annotationType]}`;
            img.classList.add("multiple");
            img.onclick = extendAnnotation(annotations, annotationType);
            img.setAttribute(
              "alt",
              annotationTypeLength + " " + annotationType + " annotations"
            );
            img.classList.add("mx-1");
            const badge = document.createElement("span");
            badge.classList.add("badge");
            badge.classList.add("bg-danger");
            badge.classList.add("rounded-pill");
            badge.classList.add("position-absolute");
            badge.textContent = annotationTypeLength;
            link.appendChild(badge);
            link.appendChild(img);
          } else {
            link = createSingleAnnotation(cellAnnotationsOfType[0], false);
          }
          cell.appendChild(link);
        }
      });
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  function tooltipContent(annotation) {
    var items = "";
    annotation["item"].forEach((item) => {
      items +=
        "&nbsp;&nbsp; Item annotated: " +
        item["objectValue"] +
        "<br>" +
        "&nbsp;&nbsp; Item description: " +
        (item["objectDescription"] ?? item["objectPath"]["objectDescription"]) +
        "<br>" +
        (item["objectPosition"] !== undefined
          ? "&nbsp;&nbsp; Item position: " + item["objectPosition"] + "<br>"
          : "") +
        "&nbsp;&nbsp; Item type: " +
        item["objectType"] +
        "<br><br>";
    });
    items = items.slice(0, -8);

    return (
      "Type: " +
      annotation["annotationType"] +
      "<br>" +
      "Author: " +
      annotation["author"] +
      "<br>" +
      "Date: " +
      formatDate(annotation["createdAt"]) +
      "<br>" +
      "Description: " +
      annotation["body"] +
      "<br>" +
      items
    );
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function createSingleAnnotation(annotation, isChild) {
    const link = document.createElement("a");
    link.href = "javascript:void(0)";
    link.setAttribute("data-toggle", "tooltip");
    link.setAttribute("data-placement", "top");
    link.setAttribute("data-bs-html", "true");
    link.setAttribute("title", tooltipContent(annotation));
    const img = document.createElement("img");
    img.src = `./images/${symbolsImages[annotation["annotationType"]]}`;
    img.setAttribute("alt", annotation["annotationType"] + " annotation");
    img.setAttribute("id", annotation["_id"]);
    img.classList.add("single");
    img.classList.add("mx-1");
    if (isChild) img.classList.add("child");
    if(removedAnnotations.includes(annotation["_id"])) link.classList.add("manual-hide");
    img.onclick = function () {
      const cell = this.parentElement.parentElement;
      this.parentElement.classList.toggle("manual-hide");
      const totalCell = cell.parentElement.children[1];
      const total = parseInt(totalCell.textContent);
      if (this.parentElement.classList.contains("manual-hide")) {
        removedAnnotations.push(this.id);
        totalCell.textContent = total - 1;
      } else {
        removedAnnotations = removedAnnotations.filter((id) => id !== this.id);
        totalCell.textContent = total + 1;
      }
      if (this.parentElement.classList.contains("hidden-annotation")) {
        img.parentElement.classList.add("hidden-annotation");
      }
    };
    link.appendChild(img);
    return link;
  }

  function extendAnnotation(annotations, annotationType) {
    return function () {
      const cell = this.parentElement.parentElement;
      this.parentElement.classList.add("hidden");
      annotations.forEach((annotation) => {
        if (annotation["annotationType"] === annotationType) {
          cell.appendChild(createSingleAnnotation(annotation, true));
        }
      });
      document
        .querySelectorAll('[data-toggle="tooltip"]')
        .forEach((tooltip) => {
          new bootstrap.Tooltip(tooltip);
        });

      sortTable(true);
    };
  }

  document.querySelectorAll('[data-toggle="tooltip"]').forEach((item) => {
    new bootstrap.Tooltip(item);
  });

  sortTable(true);
}

function sortTable(isRefreshed) {
  const sortBy = document.getElementById("sortBy");
  if (isRefreshed) {
    sortBy.options[sortById].selected = true;
  } else {
    sortById = sortBy.selectedIndex;
  }
  const tbody = document.getElementById("table-body");
  const rows = Array.from(document.getElementsByTagName("tr"));
  rows.shift();
  rows.sort((a, b) => {
    if (sortById == 0 || sortById == 1) {
      const aPage = a.children[0].children[0].href;
      const bPage = b.children[0].children[0].href;
      if (sortById == 0) {
        return aPage < bPage ? -1 : 1;
      } else {
        return aPage < bPage ? 1 : -1;
      }
    } else if (sortById == 4 || sortById == 5) {
      const aTotal = a.children[1].textContent;
      const bTotal = b.children[1].textContent;
      if (sortById == 4) {
        return aTotal - bTotal;
      } else {
        return bTotal - aTotal;
      }
    }
  });
  rows.forEach((row) => {
    tbody.appendChild(row);
  });
  if (sortById != 2 && sortById != 3) return;
  //sort annotations in each cell per date
  const cells = document.querySelectorAll("td");
  cells.forEach((cell) => {
    const imgs = cell.querySelectorAll("img.single");
    const annotations = [];
    imgs.forEach((img) => {
      annotations.push(img.parentElement);
    });
    annotations.sort((a, b) => {
      const aDate = new Date(
        a
          .getAttribute("data-bs-original-title")
          .split("Date: ")[1]
          .split("<br>")[0]
          .split("/")
          .reverse()
          .join("-")
      );
      const bDate = new Date(
        b
          .getAttribute("data-bs-original-title")
          .split("Date: ")[1]
          .split("<br>")[0]
          .split("/")
          .reverse()
          .join("-")
      );
      if (sortById == 2) {
        return aDate < bDate ? -1 : 1;
      } else {
        return aDate < bDate ? 1 : -1;
      }
    });
    annotations.forEach((annotation) => {
      cell.appendChild(annotation);
    });
  });
}
