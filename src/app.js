const express = require("express");
const helmet = require("helmet");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Security Middleware: Helmet
// Sets various HTTP headers to help secure the app
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust based on needs
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  }),
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine Setup
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "./layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Routes
const resumeRoutes = require("./routes/resume");
const contactRoutes = require("./routes/contact");
app.use("/resume", resumeRoutes);
app.use("/contact", contactRoutes);

// Basic Home Route
app.get("/", (req, res) => {
  const fs = require('fs');
  const imagesDir = path.join(__dirname, "../public/images");
  
  fs.readdir(imagesDir, (err, files) => {
    let images = [];
    if (!err) {
      // Filter for image files only and exclude hidden files
      images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    }
    res.render("index", { title: "Portfolio", images: images });
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about", { title: "About Me" });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render("404", { title: "404 Not Found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
