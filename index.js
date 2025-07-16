import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");

app.get("/", (req, res) => {
  res.render("home", {
    title: "Welcome Page",
    message: "SSR Rendering with Express + Handlebars",
  });
});

app.listen(port, () => {
  console.log(`Listen on port: ${port}`);
});
