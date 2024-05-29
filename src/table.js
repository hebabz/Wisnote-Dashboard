function fillTable(tableData) {
  const columns = [
    "Web pages",
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

  const symbolsImages = {
    defect: "triangle.png",
    question: "diamond.png",
    comment: "square.png",
    other: "star.png",
    thesaurus: "resource.png",
  };

  const headerRow = document.getElementsByTagName("tr")[0];
  columns.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });

  const webPages = [...new Set(tableData.map((rowData) => rowData["pageUrl"]))];

  const tbody = document.getElementById("table-body");

  webPages.forEach((pageUrl) => {
    const row = document.createElement("tr");
    const pageCell = document.createElement("td");
    const pageLink = document.createElement("a");
    pageLink.href = pageUrl;
    pageLink.textContent = pageUrl;
    pageCell.appendChild(pageLink);
    row.appendChild(pageCell);

    connectionTypes.forEach((connectionType) => {
      const annotations = tableData.filter(
        (rowData) =>
          rowData["pageUrl"] === pageUrl &&
          rowData["connectionType"] === connectionType
      );
      const cell = document.createElement("td");
      annotationTypes.forEach((annotationType) => {
        const annotationTypeLength = annotations.filter(
          (rowData) => rowData["annotationType"] === annotationType
        ).length;
        if (annotationTypeLength > 0) {
          const img = document.createElement("img");
          img.src = `./images/${symbolsImages[annotationType]}`;
          if (annotationTypeLength > 1) {
            img.classList.add("multiple");
            img.onclick = extendAnnotation(annotations, annotationType);
            img.setAttribute("alt", annotationTypeLength + " " + annotationType + " annotations");
          } else {
            img.classList.add("single");
            img.setAttribute("data-toggle", "tooltip");
            img.setAttribute("data-placement", "top");
            img.setAttribute("data-bs-html", "true");
            img.setAttribute("title", tooltipContent(annotations[0]));
          }
          img.classList.add("mx-1");
          cell.appendChild(img);
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

  function extendAnnotation(annotations, annotationType) {
    return function () {
      const cell = this.parentElement;
      annotations.forEach((annotation) => {
        if (annotation["annotationType"] === annotationType) {
          const img = document.createElement("img");
          img.src = `./images/${symbolsImages[annotation["annotationType"]]}`;
          img.classList.add("single");
          img.setAttribute("data-toggle", "tooltip");
          img.setAttribute("data-placement", "top");
          img.setAttribute("data-bs-html", "true");
          img.setAttribute("title", tooltipContent(annotation));
          img.classList.add("mx-1");
          img.setAttribute("style", "animation: rotation 0.7s ease-in;");
          img.onanimationend = function () {
            img.style.animation = "";
          };
          cell.appendChild(img);
        }
      });
      this.remove();
      //enable tooltips
      document
        .querySelectorAll('[data-toggle="tooltip"]')
        .forEach((tooltip) => {
          new bootstrap.Tooltip(tooltip);
        });
    };

  }

  //enable tooltips
  document.querySelectorAll('[data-toggle="tooltip"]').forEach((tooltip) => {
    new bootstrap.Tooltip(tooltip);
  });
}
