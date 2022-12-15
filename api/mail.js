const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const path = require('path')

router.post("/", async (req, res) => {
    try {
        let data = req.body
        let smtptransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'xcage584@gmail.com',
                pass: 'sxpzijhfvpbakznp',
            },
            // auth: {
            //     user: 'shreyaskinage14@gmail.com',
            //     pass: 'xfquwaskymdeixue',
            // },
            tls: {
                rejectUnauthorized: false,
            }
        })

        let mailOptions = {
            from: 'Shreyas Sanjay Kinage <shreyaskinage14@gmail.com>',
            to: data.email,
            subject: `${data.name}, a Query from OMG Vendor Portal has been raised`,
            html: `
        <h2>${data.type} Query</h3>
        <h3>${data.query}</h3>
        <p>Please login to your vendor account and rectify the query asap. <a href="https://testing-omg.vercel.app/">Click to Open Vendor Portal</a></p>
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
        })
    } catch (error) {
        return res.status(500).send("Server Error");
    }
})

module.exports = router;