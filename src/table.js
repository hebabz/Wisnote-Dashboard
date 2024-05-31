const symbolsImages = {
  defect: "triangle.png",
  question: "diamond.png",
  comment: "square.png",
  other: "star.png",
  thesaurus: "resource.png",
};

function fillTable(tableData) {
  const columns = [
    "Web pages",
    "Total",
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

  const headerRow = document.getElementsByTagName("tr")[0];
  columns.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });

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

  const formattedWebPages = [
    ...new Set(
      webPages.map((url) => {
        return fromURItoLastPart(url);
      })
    ),
  ];

  const tbody = document.getElementById("table-body");

  webPages.forEach((pageUrl) => {
    const row = document.createElement("tr");
    const pageCell = document.createElement("td");
    const pageLink = document.createElement("a");
    pageLink.href = pageUrl;
    pageLink.textContent = fromURItoLastPart(pageUrl);
    pageCell.appendChild(pageLink);
    row.appendChild(pageCell);

    const totalCell = document.createElement("td");
    const totalAnnotations = tableData.filter(
      (rowData) => rowData["pageUrl"] === pageUrl
    ).length;
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
        const annotationTypeLength = annotations.filter(
          (rowData) => rowData["annotationType"] === annotationType
        ).length;
        if (annotationTypeLength > 0) {
          const link = document.createElement("a");
          link.href = "javascript:void(0)";
          const img = document.createElement("img");
          img.src = `./images/${symbolsImages[annotationType]}`;
          if (annotationTypeLength > 1) {
            img.classList.add("multiple");
            img.onclick = extendAnnotation(annotations, annotationType);
            img.setAttribute(
              "alt",
              annotationTypeLength + " " + annotationType + " annotations"
            );
            const badge = document.createElement("span");
            badge.classList.add("badge");
            badge.classList.add("bg-secondary");
            badge.classList.add("rounded-pill");
            badge.classList.add("mx-1");
            badge.textContent = annotationTypeLength;
            link.appendChild(badge);
          } else {
            img.classList.add("single");
            link.setAttribute("data-toggle", "tooltip");
            link.setAttribute("data-placement", "top");
            link.setAttribute("data-bs-html", "true");
            link.setAttribute("title", tooltipContent(annotations[0]));
            img.setAttribute("alt", annotationType + " annotation");
          }
          img.classList.add("mx-1");
          link.appendChild(img);
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
        (item["objectPosition"] !== undefined ? "&nbsp;&nbsp; Item position: " + item["objectPosition"] + "<br>" : "") +
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
      const cell = this.parentElement.parentElement;
      this.parentElement.classList.add("hidden");
      annotations.forEach((annotation) => {
        if (annotation["annotationType"] === annotationType) {
          const link = document.createElement("a");
          link.href = "javascript:void(0)";
          link.setAttribute("data-toggle", "tooltip");
          link.setAttribute("data-placement", "top");
          link.setAttribute("data-bs-html", "true");
          link.setAttribute("title", tooltipContent(annotation));
          const img = document.createElement("img");
          img.src = `./images/${symbolsImages[annotation["annotationType"]]}`;
          img.setAttribute("alt", annotation["annotationType"] + " annotation");
          img.classList.add("single");
          img.classList.add("mx-1");
          img.classList.add("child");
          if (this.parentElement.classList.contains("hidden-annotation")) {
            img.parentElement.classList.add("hidden-annotation");
          }
          link.appendChild(img);
          cell.appendChild(link);
        }
      });
      //enable tooltips
      document
        .querySelectorAll('[data-toggle="tooltip"]')
        .forEach((tooltip) => {
          new bootstrap.Tooltip(tooltip);
        });
    };
  }

  //enable tooltips
  document.querySelectorAll('[data-toggle="tooltip"]').forEach((item) => {
    new bootstrap.Tooltip(item);
  });
}