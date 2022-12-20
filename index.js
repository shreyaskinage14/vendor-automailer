const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mail = require('./api/mail');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use("/api/mail", mail);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})