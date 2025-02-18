import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;

// Session Middleware
app.use(session({
    secret: "yourSecretKey", // Change this to a secure key
    resave: false,
    saveUninitialized: true
}));

// Middleware for parsing body and serving static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Logo and title
const logo = "NBlog";
const title = "NBlog - Your Blogging Platform";

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware to set common variables
app.use((req, res, next) => {
    res.locals.title = title;
    res.locals.logo = logo;
    res.locals.name = req.session.name || "Guest";
    next();
});

// Routes
app.get("/", (req, res) => {
    res.render("welcomePage.ejs");
});

app.get("/posts", (req, res) => {
    res.render("index.ejs");
});

app.get("/submit", (req, res) => {
    res.render("form.ejs");
});

app.post("/submit", (req, res) => {
    req.session.name = req.body.uName;
    res.redirect("/posts");
});

// Handle image upload and caption submission
app.post("/upload", upload.single("uploadedImage"), (req, res) => {
    const caption = req.body.caption;
    const imagePath = `/uploads/${req.file.filename}`;
    
    res.render("index.ejs", { imagePath, caption });
});

app.get("/profile", (req, res) => {
    res.render("myProfile.ejs");
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
