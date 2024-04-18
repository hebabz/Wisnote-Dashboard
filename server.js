const express = require("express");
const app = express();
const port = 3008;

// Cette ligne indique le répertoire qui contient
// les fichiers statiques: html, css, js, images etc.
app.use(express.static("src"));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
