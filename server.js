const express    = require("express");
const app        = express();
const http       = require("http").createServer(app);
const port       = process.env.PORT || 80;
const path       = require("path");
const morgan     = require("morgan");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

require("./app/routes.js")(app);

http.listen(port, () => {
    console.log(`The server is running on port ${port}.`);
});
