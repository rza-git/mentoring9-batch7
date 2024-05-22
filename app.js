const express = require('express')
const app = express()
const port = 3000
const router = require("./routes")
const morgan = require("morgan")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./task-middleware.json');

app.use(morgan("dev"))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// bodyparser (middleware)
// parsing json to javascript object literal
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// routes / route handler
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})