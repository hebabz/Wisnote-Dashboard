const attributes = [
  "Page",
  "Annotation",
  "Author",
  "Object type",
  "Object value",
  "Object description",
  "Connection type",
  "Annotation type",
  "Created at",
  "Updated at",
];

const jsonAttributes = [
    "pageUrl",
    "body",
    "author",
    "objectType",
    "objectValue",
    "objectDescription",
    "connectionType",
    "annotationType",
    "createdAt",
    "updatedAt",
    ];

function fillTable(tableData) {
  const headerRow = document.getElementsByTagName("tr")[0];
  attributes.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });

  const tbody = document.getElementById("table-body");

  tableData.forEach((rowData) => {
    rowData["item"].forEach((item) => {
      const row = document.createElement("tr");
      jsonAttributes.forEach((attr) => {
        const cell = document.createElement("td");
        if(attr === "objectType" || attr === "objectValue" || attr === "objectDescription") {
          cell.textContent = item[attr];
        } else {
          cell.textContent = rowData[attr];
        }
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
    
  });
}