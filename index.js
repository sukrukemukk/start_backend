const express = require('express');
const actorsRouter = require("./routers/actorsRouter");
const logger = require('./middlewares/logger');
const errorHandling = require('./middlewares/errorHandling');

const server = express();
server.use(express.json());
server.use(logger);

server.use("/actors", actorsRouter);

server.get('/', (req, res) => {
    res.send('Hello Express');
});

server.use(errorHandling);


server.listen(5000, () => {
    console.log("Running Server...");
});