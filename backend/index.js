const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./db/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  const { originalname, filename, mimetype } = req.file;

  const allowedMimeTypes = [
    "text/plain",
    "application/json",
    "image/png",
    "image/jpeg",
  ];

  if (!allowedMimeTypes.includes(mimetype)) {
    return res.status(400).json({ success: false, message: "Unsupported file type" });
  }

  try {
    await db.query(
      "INSERT INTO files (original_name, stored_name, type) VALUES ($1, $2, $3)",
      [originalname, filename, mimetype]
    );
    res.json({ success: true, message: "File uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving file info to DB" });
  }
});


// List files of all users
app.get("/files", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM files ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching files:", err);  // Add this log
    res.status(500).send("Error fetching files");
  }
});

// Preview file content
app.get("/files/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM files WHERE id = $1", [req.params.id]);
    const file = result.rows[0];

    if (!file) return res.status(404).send("File not found");

    const filePath = path.join(__dirname, "uploads", file.stored_name);

    // Only allow previewing well-known formats
    const allowedPreviewTypes = [
      "text/plain",
      "application/json",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedPreviewTypes.includes(file.type)) {
      return res.status(415).send("Unsupported preview format");
    }

    res.setHeader("Content-Type", file.type);

    if (file.type.startsWith("image/")) {
      res.sendFile(filePath);
    } else {
      const fs = require("fs");
      const content = fs.readFileSync(filePath, "utf-8");
      res.send(content);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error previewing file");
  }
});


// Download file
app.get("/download/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM files WHERE id = $1", [req.params.id]);
    const file = result.rows[0];

    if (!file) return res.status(404).send("File not found");

    const filePath = path.join(__dirname, "uploads", file.stored_name);
    res.download(filePath, file.original_name);
  } catch (err) {
    res.status(500).send("Error downloading file");
  }
});
// homepage route
app.get("/", (req, res) => {
  res.send("Welcome to Dropbox Clone API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
