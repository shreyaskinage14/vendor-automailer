const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mail = require('./api/mail');
const createuser = require('./api/createuser');
const approvemail = require('./api/approvemail');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ externded: false }))
app.use(cors())

app.use("/api/mail", mail);
app.use("/api/createuser", createuser);
// app.use("/api/approvemail", approvemail);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})