

function fillTable(tableData) {
  const columns = [
    "Web pages",
    "Object annotations",
    "Web page annotations",
    "Website annotations",
  ];
  
  const connectionTypes = [
    "object",
    "dashboard",
    "--"
  ];
  
  const annotationTypes = [
    "defect",
    "question",
    "comment",
    "other"
  ];

  const symbolsImages = {
    "defect": "triangle.png",
    "question": "circle.png",
    "comment": "square.png",
    "other": "star.png"
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
    pageCell.textContent = pageUrl;
    row.appendChild(pageCell);

    connectionTypes.forEach((connectionType) => {
      const annotations = tableData.filter(
        (rowData) => rowData["pageUrl"] === pageUrl && rowData["connectionType"] === connectionType
      );
      const cell = document.createElement("td");
      annotationTypes.forEach((annotationType) => {
        const annotationTypeLength = annotations.filter(
          (rowData) => rowData["annotationType"] === annotationType
        ).length;
        if(annotationTypeLength > 0) {
          const img = document.createElement("img");
          img.src = `./images/${symbolsImages[annotationType]}`;
          if(annotationTypeLength > 1) {
            img.classList.add("multiple");
          } else {
            img.classList.add("single");
          }
          cell.appendChild(img);
        }
      });
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
}



  /*

  tableData.forEach((rowData) => {
    if (rowData["item"].length === 0) {
      const row = document.createElement("tr");
      jsonAttributes.forEach((attr) => {
        const cell = document.createElement("td");
        cell.textContent = rowData[attr];
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    } else {
      rowData["item"].forEach((item) => {
        const row = document.createElement("tr");
        jsonAttributes.forEach((attr) => {
          const cell = document.createElement("td");
          if (
            attr === "objectType" ||
            attr === "objectValue" ||
            attr === "objectDescription"
          ) {
            cell.textContent = item[attr];
          } else {
            cell.textContent = rowData[attr];
          }
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
    }
  });*/