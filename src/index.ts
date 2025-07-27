import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "./connection/db.ts";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  renderHome,
  renderLogin,
  renderProfile,
  renderRegister,
  handleCreatePost,
  handleVotePost,
  handlePostDelete,
  renderEditPost,
  handleEditPost,
} from "./routes/index.ts";
import requireLogin from "./middlewares/requireLogin.ts";
import redirectIfAuthenticated from "./middlewares/guestOnly.ts";
import loadCurrentUser from "./middlewares/loadCurrentUser.ts";
import type { HelperOptions } from "handlebars";
import { format } from "date-fns";
import flash from "connect-flash";
import { upload, uploadDir } from "./middlewares/multer.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3069;

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      ifEquals: (
        a: string | number,
        b: string | number,
        options: HelperOptions
      ) => {
        return a == b ? options.fn(this) : options.inverse(this);
      },
      formatDate: (date: string | Date) => format(new Date(date), "dd/MM/yyyy"),
      json: (context: any) => JSON.stringify(context, null, 2), // DEBUG only
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(uploadDir));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PgSession = pgSession(session);
app.use(
  session({
    store: new PgSession({ pool }),
    secret: "hardcodedsecretmustbeplacedinenv99",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(loadCurrentUser);

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// auth routes
app.get("/register", redirectIfAuthenticated, renderRegister);
app.post("/register", handleRegister);
app.get("/login", redirectIfAuthenticated, renderLogin);
app.post("/login", handleLogin);
app.post("/logout", handleLogout);

// me
app.get("/me", requireLogin, renderProfile);

// home
app.get("/", requireLogin, renderHome);

// posts
app.post("/posts", requireLogin, upload.single("attachment"), handleCreatePost);
app.post("/posts/:id/vote", requireLogin, handleVotePost);
app.delete("/posts/:id", requireLogin, handlePostDelete);

app.get("/posts/:id/edit", requireLogin, renderEditPost);
app.put(
  "/posts/:id",
  requireLogin,
  upload.single("attachment"),
  handleEditPost
);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
