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
            subject: `Welcome ${data.name} to Vendor Portal`,
            html: `
        <h2>You have been invited as an ${data.usertype} in the Vendor Portal.</h3>
        <h3>PFB your Login Credentials to login and start referring</h3>
        <p>EmailID: ${data.email}</p>
        <p>Password: ${data.password}</p>
        Login to <a href="https://testing-omg.vercel.app/">Vendor Portal</a>
        <p><b>Note: Before logging to the portal, please verify your account. The verification link has been sent to your email. Please check spam folder, if not found</b></p>
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