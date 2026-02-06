const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

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
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  }),
);

// Rate Limiting: Protect against brute force and DoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine Setup
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "./layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory with caching
app.use(express.static(path.join(__dirname, "../public"), {
  maxAge: '1d',
  etag: false,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (/\.(jpg|jpeg|png|webp|gif)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days for images
    } else if (/\.(css|js)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day for CSS/JS
    }
  }
}));

// Routes
const indexRoutes = require('./routes/index');
const aboutRoutes = require('./routes/about');
const contactRoutes = require("./routes/contact");
const servicesRoutes = require('./routes/services');

app.use('/', indexRoutes);
app.use('/about', aboutRoutes);
app.use('/contact', contactRoutes);
app.use('/services', servicesRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render("404", { title: "404 Not Found" });
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error("Server error occurred", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  const errorMessage = process.env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again later.'
    : err.message;

  res.status(500).send(errorMessage);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
