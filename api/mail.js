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

router.post("/approvemail", async (req, res) => {
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
            tls: {
                rejectUnauthorized: false,
            }
        })
        let mailOptions = {
            from: 'Shreyas Sanjay Kinage <shreyaskinage14@gmail.com>',
            to: data.email,
            subject: `Please Approve ${data.name} for Vendor Portal`,
            html: `
            <div style="display: 'flex'; flex-direction: 'column';  font-size: 16px">
                <ul style="list-style: none; padding-left: 0px; padding: 0px;">
                    <li style="margin-bottom: 0px; margin-bottom: 10px"><b>Name:</b><br> ${data.name}</li> 
                    <li style="margin-bottom: 0px; margin-bottom: 10px"><b>Email:</b><br> ${data.email}</li>
                    <li style="margin-bottom: 0px; margin-bottom: 10px"><b>Location:</b><br> ${data.location}</li>
                    <li style="margin-bottom: 0px; margin-bottom: 0px"><b>Pan Number:</b><br> ${data.pan}</li>
                    <li><div style="display: flex; justify-content: flex-start;">
                        <div style="word-break: break-all;">
                            <p><b>GST Team Remarks: </b><br>${data.remarks.gstteam}</p>
                        </div>
                        <div style="margin-left: 100px; word-break: break-all;">
                            <p><b>Vendor Team Remarks: </b><br>${data.remarks.vendorteam}</p>
                        </div>
                    </div>
                    </li>
                </ul>
                <div style="display: flex; justify-content: flex-start;">
                    <a type='button' href="https://testing-omg.vercel.app/approve/${data.uid}?action=accept&vendorName=${data.name}" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: green; color: #FFF;">Approve</a>
                    <a type='button' href="https://testing-omg.vercel.app/approve/${data.uid}?action=acceptasexception&vendorName=${data.name}" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: #1E429F; color: #FFF;">Approve as Exception</a>
                    <a type='button' href="https://testing-omg.vercel.app/approve/${data.uid}?action=deny&vendorName=${data.name}" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: #FF0000; color: #FFF;">Deny</a>
                </div>
            </div>
        `
        }

        smtptransport.sendMail(mailOptions, (err, info) => {
            console.log(err);
            if (err) {
                res.json({ message: err });
                res.send({ message: err });
            } else {
                res.json({ message: `Email send to ${data.name} successfully`, messageID: info.messageId });
                res.send({ message: `Email send to ${data.name} successfully`, messageID: info.messageId });
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server Error");
    }
})

router.post("/createuser", async (req, res) => {
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
        <h3>PFB your Login Credentials to login</h3>
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

router.post("/welcomemail", async (req, res) => {
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
            tls: {
                rejectUnauthorized: false,
            }
        })

        let mailOptions = {
            from: 'Shreyas Sanjay Kinage <shreyaskinage14@gmail.com>',
            to: data.email,
            subject: `Welcome Onboard, ${data.name}`,
            html: ``
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