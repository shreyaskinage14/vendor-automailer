const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const path = require('path')

router.post("/", async (req, res) => {
    try {
        let data = req.body
        console.log(data);
        let smtptransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'shreyaskinage14@gmail.com',
                pass: 'xfquwaskymdeixue',
            },
            tls: {
                rejectUnauthorized: false,
            }
        })

        let mailOptions = {
            from: 'Shreyas Sanjay Kinage <shreyaskinage14@gmail.com>',
            to: data.email,
            subject: `${data.name}, a Query has been raised in Vendor Portal`,
            html: `
        <h3>General Information</h3>
        <ul>
        <li>Name: ${data.name}</li>
        <li>Email: xcage584@gmail.com</li>
        </ul>
        <h3>Query</h3>
        <p>Testing the nodemailer</p>
        `
        }

        smtptransport.sendMail(mailOptions, (err, info) => {
            if (err) {
                res.json({ message: err });
                res.send({ message: err });
            } else {
                res.json({ message: `Email send to ${data.name} successfully`, messageID: info.messageId });
                res.send({ message: `Email send to ${data.name} successfully`, messageID: info.messageId });
            }
            console.log(err);
            console.log(info);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server Error");
    }
})

module.exports = router;