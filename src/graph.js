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
    "other": "star.png",
    "thesaurus": "star.png",
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
    width = 1160 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Append the SVG object to the body of the page and make it responsive
  var svg = d3
    .select("#graph-svg")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " 420")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // x axis is a categorical scale and make it responsive
  var xScale = d3
    .scaleBand()
    .domain(formattedWebPages)
    .range([0, width])
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
    .style("max-height", "100%")
    .selectAll(".tick line")
    .attr("opacity", 0.1);

    // Append y-axis and x-axis labels to the SVG
  svg
    .append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Web pages");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of annotations");

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
        // Calculate the x position based on the total of x data
        return xScale(d.webpage) + xScale.bandwidth() / 2 - 7.5; // Adjust the position based on the image size
    })
    .attr("y", function(d) {
        // Calculate the y position based on the count
        return yScale(d.count) - 7.5;
    })
    .attr("width", 15) // Set the width of the image
    .attr("height", 15) // Set the height of the image
    .on("mouseover", function(e, d) {
      d3
        .select("#graph")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + 10 + "px")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .style("z-index", 1000)
        .html(
          "Page name: " +
            d.webpage +
            "</br>Annotation Type: " +
            d.annotationType +
            "</br>Count: " +
            d.count
        );
    })
    .on("mouseout", function() {
      d3.select("#tooltip").remove();
    });
}
