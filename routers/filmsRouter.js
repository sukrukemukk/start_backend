const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gs_1905gs",
  database: "actors_films",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the database");
});

router.get("/", (req, res) => {
  const sql = "SELECT * FROM films";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ errorMessage: "Database query failed" });
    }
    res.status(200).json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM films WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ errorMessage: "Database query failed" });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send("Id Not Found");
    }
  });
});

router.post("/", (req, res, next) => {
  const { title, actorId } = req.body;
  if (title && actorId) {
    const sql = "INSERT INTO films (title) VALUES (?)";
    connection.query(sql, [title, actorId], (err, results) => {
      if (err) {
        return next({ statusCode: 500, errorMessage: "Database query failed" });
      }
      const newFilm = { id: results.insertId, title, actorId };
      res.status(201).json(newFilm);
    });
  } else {
    next({
      statusCode: 400,
      errorMessage: "Please provide title and actorId.",
    });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM films WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ errorMessage: "Database query failed" });
    }
    if (results.affectedRows > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ errorMessage: "Id Not Found" });
    }
  });
});

router.put("/:id", (req, res) => {
  const { title, actorId } = req.body;
  const sql = "UPDATE films SET title = ?, actorId = ?";
  connection.query(sql, [title, actorId], (err, results) => {
    if (err) {
      return res.status(500).json({ errorMessage: "Database query failed" });
    }
    if (results.affectedRows > 0) {
      const updatedFilm = { title, actorId };
      res.status(200).json(updatedFilm);
    } else {
      res.status(404).json({ errorMessage: "Id Not Found" });
    }
  });
});

module.exports = router;
