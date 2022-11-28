const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mail = require('./api/mail');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ externded: false }))
app.use(cors())

app.use("/api/mail", mail);

// app.use('/api/sendMail', (req, res) => {



// })

// app.get("/", (req, res) => {
//     app.use(express.static(path.resolve(__dirname, 'client', 'build')))
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
// })

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})