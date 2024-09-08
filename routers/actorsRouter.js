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
  const sql = "SELECT * FROM actors";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ errorMessage: "Database query failed" });
    }
    res.status(200).json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM actors WHERE id = ?";
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
  const { name, films } = req.body;
  if (name && films) {
    const sql = "INSERT INTO actors (name) VALUES (?)";
    connection.query(sql, [name], (err, results) => {
      if (err) {
        return next({ statusCode: 500, errorMessage: "Database query failed" });
      }
      const newActor = { id: results.insertId, name, films };
      res.status(201).json(newActor);
    });
  } else {
    next({ statusCode: 400, errorMessage: "Please provide a name and films." });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM actors WHERE id = ?";
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
  const { id } = req.params;
  const { name, films } = req.body;
  const sql = "UPDATE actors SET name = ?, films = ? WHERE id = ?";
  connection.query(sql, [name, films, id], (err, results) => {
    if (err) {
      return res.status(500).json({ errorMessage: "Database query failed" });
    }
    if (results.affectedRows > 0) {
      const updatedActor = { id, name, films };
      res.status(200).json(updatedActor);
    } else {
      res.status(404).json({ errorMessage: "Id Not Found" });
    }
  });
});

module.exports = router;
