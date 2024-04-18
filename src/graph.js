//https://observablehq.com/@d3/scatterplot-with-shapes?intent=fork

function fromURItoLastPart(uri) {
  const lastSlashIndex = uri.lastIndexOf("/");
  if (lastSlashIndex !== -1) {
    return decodeURIComponent(
      decodeURIComponent(uri.substring(lastSlashIndex + 1))
    );
  }
  return uri;
}

function fillGraph(tableData) {
  const webPages = [...new Set(tableData.map((rowData) => rowData["pageUrl"]))];

  // the webpage addresses but only the last part is kept
  const formattedWebPages = [
    ...new Set(
      webPages.map((url) => {
        return fromURItoLastPart(url);
      })
    ),
  ];

  const annotationTypes = [
    ...new Set(tableData.map((rowData) => rowData["annotationType"])),
  ];

  const symbolsImages = {
    "defect": "triangle.png",
    "question": "circle.png",
    "comment": "square.png",
    "other": "star.png"
  };

  // Count the number of annotations per webpage
  var annotationsCount = {};
  tableData.forEach((rowData) => {
    var pageUrl = fromURItoLastPart(rowData["pageUrl"]);
    var annotationType = rowData["annotationType"];
    if (!annotationsCount[pageUrl]) {
      annotationsCount[pageUrl] = {};
    }
    if (!annotationsCount[pageUrl][annotationType]) {
      annotationsCount[pageUrl][annotationType] = 0;
    }
    annotationsCount[pageUrl][annotationType]++;
  });

  // Set the dimensions and margins of the graph
  var margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Append the SVG object to the body of the page
  var svg = d3
    .select("#graph")
    .append("svg")
    .attr("viewBox", `0 0 ${width + (margin.left + margin.right) * 5} ${height + margin.top + margin.bottom}`) //TODO to fix
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // x axis is a categorical scale
  var xScale = d3
    .scaleBand()
    .domain(formattedWebPages)
    .range([0, 800])
    .padding(0.1);

  // Append x-axis to the SVG
  svg
    .append("g")
    .call(d3.axisBottom(xScale))
    .attr("transform", "translate(0," + height + ")");

  const maxY = Math.max(
    ...Object.values(annotationsCount).map((counts) =>
      Math.max(...Object.values(counts))
    )
  );

  //y axis is a numerical scale
  var yScale = d3.scaleLinear().domain([0, maxY + 5]).range([height, 0]);

  // Append y-axis to the SVG
  svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(-innerWidth))
    .selectAll(".tick line")
    .attr("opacity", 0.1);

  // Create an array of objects with webpage, annotation type, and count
  var data = [];
  for (var pageUrl in annotationsCount) {
    for (var annotationType in annotationsCount[pageUrl]) {
      var count = annotationsCount[pageUrl][annotationType];
      data.push({
        webpage: pageUrl,
        annotationType: annotationType,
        count: count,
      });
    }
  }

// Create a group for the dots
var dots = svg.append("g");

// Append image elements for each data point
dots
    .selectAll("image")
    .data(data)
    .enter()
    .append("image")
    .attr("xlink:href", function(d) {
        // Get the image URL based on the annotation type
        return "./images/" + symbolsImages[d.annotationType];
    })
    .attr("x", function(d) {
        // Calculate the x position based on the webpage
        return xScale(d.webpage) + xScale.bandwidth() / 2 - 10; // Adjust the position based on the image size
    })
    .attr("y", function(d) {
        // Calculate the y position based on the count
        return yScale(d.count) - 10; // Adjust the position based on the image size
    })
    .attr("width", 20) // Set the width of the image
    .attr("height", 20); // Set the height of the image
}
