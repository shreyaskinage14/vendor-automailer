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
            subject: `Please Approve ${data.name} for Vendor Portal`,
            html: `
            <div style="display: "flex"; flex-direction: "column";">
                <ul>
                    <li><b>Name: </b>${data.name}</li>
                    <li><b>Email: </b>${data.email}</li>
                    <li><b>Location: </b>${data.location}</li>
                    <li><b>Pan Number: </b>${data.pan}</li>
                    <li>
                        <b>Remarks: </b>
                        <br>
                        <ul>
                            <li><b>GST Team: </b>${remarks.gstteam}</li>
                            <li><b>Vendor Team: </b>${remarks.vendorteam}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            
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