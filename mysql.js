const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  port: process.env.DB_PORT || 3306,
});

const createDbSql = "CREATE DATABASE IF NOT EXISTS actors_films";
const useDbSql = "USE actors_films";
const createActorsTableSql = `
  CREATE TABLE IF NOT EXISTS actors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
  )
`;
const createFilmsTableSql = `
  CREATE TABLE IF NOT EXISTS films (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL
  )
`;
const createActorsFilmsTableSql = `
  CREATE TABLE IF NOT EXISTS actors_films (
    actor_id INT,
    film_id INT,
    PRIMARY KEY (actor_id, film_id),
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE,
    FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE
  )
`;

connection.connect((err) => {
  if (err) {
    console.log("Error connecting:", err);
    return;
  }

  console.log("Connected");

  connection.query(createDbSql, (err) => {
    if (err) {
      console.log("Error creating database:", err);
      return;
    }

    console.log("Database created or already exists");

    connection.query(useDbSql, (err) => {
      if (err) {
        console.log("Error selecting database:", err);
        return;
      }

      connection.query(createActorsTableSql, (err) => {
        if (err) {
          console.log("Error creating actors table:", err);
          return;
        }

        console.log("Actors table created or already exists");

        connection.query(createFilmsTableSql, (err) => {
          if (err) {
            console.log("Error creating films table:", err);
            return;
          }

          console.log("Films table created or already exists");

          connection.query(createActorsFilmsTableSql, (err) => {
            if (err) {
              console.log("Error creating actors_films table:", err);
              return;
            }

            console.log("Actors_films table created or already exists");
            connection.end();
          });
        });
      });
    });
  });
});
