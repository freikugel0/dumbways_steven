import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "src", "views", "index.html"));
});

app.get("/letter", (req, res) => {
  res.sendFile(join(__dirname, "src", "views", "letter.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(join(__dirname, "src", "views", "404.html"));
});

app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
