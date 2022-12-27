const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

router.post("/", async (req, res) => {
    try {
        let data = req.body
        let smtptransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'shivamnarkhede11@gmail.com',
                pass: 'txopgcyilvlpgsvi',
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
                user: 'shivamnarkhede11@gmail.com',
                pass: 'txopgcyilvlpgsvi',
            },
            tls: {
                rejectUnauthorized: false,
            }
        })
        let mailOptions = {
            from: 'Shreyas Sanjay Kinage <xcage584@gmail.com>',
            to: 'naresh.chippa@omnicommediagroup.com',
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

        smtptransport.close();
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
                user: 'shivamnarkhede11@gmail.com',
                pass: 'txopgcyilvlpgsvi',
            },
            tls: {
                rejectUnauthorized: false,
            }
        })

        let mailOptions = {
            from: 'Shreyas Sanjay Kinage <xcage584@gmail.com>',
            to: data.email,
            // to: 'shreyaskinage14@gmail.com',
            cc: data.introducerEmail,
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
        smtptransport.close();
    } catch (error) {
        return res.status(500).send("Server Error");
    }
})

router.post("/welcomemail", async (req, res) => {
    try {
        let data = req.body
        function getActionType() {
            if (data.action == "accept") {
                return "Welcome Onboard"
            }
            if (data.action == "acceptasexception") {
                return "Welcome Onboard"
            }
            if (data.action == "deny") {
                return "Vendor Denied"
            }
        }
        let smtptransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'shivamnarkhede11@gmail.com',
                pass: 'txopgcyilvlpgsvi',
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        const title = getActionType();

        let mailOptions = {
            from: 'Shreyas Sanjay Kinage <xcage584@gmail.com>',
            // to: data.email,
            // to: data.action == "deny" ? `xcage584@gmail.com, shivamnarkhede11@gmail.com` : `${data.email}, xcage584@gmail.com, shivamnarkhede11@gmail.com`,
            to: data.action == "deny" ? `${data.introducerEmail}` : `${data.email}, ${data.introducerEmail}`,
            // cc: `shreyaskinage14@gmail.com`,
            // cc: `${data.introducerEmail}, gsthelpdeskapindia@omnicommediagroup.com`,
            subject: `${title}, ${data.name}`,
            html: `
            <div class="es-wrapper-color" style="background-color:transparent">
            <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="transparent"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:transparent"><tr style="border-collapse:collapse"><td valign="top" style="padding:0;Margin:0"><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr style="border-collapse:collapse"><td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center"><table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:20px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:600px"><table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top" width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://firebasestorage.googleapis.com/v0/b/omg-vendor-portal.appspot.com/o/download.png?alt=media&token=99813458-00cd-46b5-8f4a-3a0cc2323b92" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" class="adapt-img" width="600" height="150"></td>
            </tr><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;padding-top:25px;padding-bottom:25px"><h1 style="Margin:0;line-height:42px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:28px;font-style:normal;font-weight:normal;color:#333333"><b>${title}</b></h1><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:27px;color:#333333;font-size:18px">${data.name}</p></td>
            </tr><tr style="border-collapse:collapse"><td align="center" style="padding:20px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#333333;font-size:16px">As a leading global media network, Omnicom Media Group (OMG) sets itself apart with an agile, client-first approach that helps businesses thrive today and into the future. With more than 21,000 employees globally, OMG has the talent, expertise and clout to deliver unprecedented levels of innovation for our clients.</p></td>
            </tr><tr style="border-collapse:collapse"><td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:20px;padding-bottom:40px"><!--[if mso]><a href="https://testing-omg.vercel.app/" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://testing-omg.vercel.app/" style="height:46px; v-text-anchor:middle; width:172px" arcsize="22%" strokecolor="#3d5ca3" strokeweight="2px" fillcolor="#26366a"> <w:anchorlock></w:anchorlock> <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:14px; font-weight:700; line-height:14px; mso-text-raise:1px'>Log in to the Portal</center> </v:roundrect></a><![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border-2 es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#26366a;border-width:2px;display:inline-block;border-radius:10px;width:auto;mso-hide:all"><a href="https://testing-omg.vercel.app/" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#ffffff;font-size:14px;border-style:solid;border-color:#26366a;border-width:15px 20px;display:inline-block;background:#26366a;border-radius:10px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">Log in to the Portal</a></span><!--<![endif]--></td>
            </tr></table></td></tr></table></td></tr></table></td>
            </tr></table><table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse"><td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center"><table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse"><td align="left" bgcolor="#26366A" style="Margin:0;padding-top:10px;padding-bottom:15px;padding-left:20px;padding-right:20px;background-color:#26366a"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><h2 style="Margin:0;line-height:19px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:16px;font-style:normal;font-weight:normal;color:#f8f7f7"><strong>Have questions?</strong></h2>
            </td></tr><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-bottom:5px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;color:#ffffff;font-size:14px">We are here to help, <a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#ffffff;font-size:14px" href="">contact us at xyz@omnicommediagroup.com</a></p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table>
            </div>
            `,
        }

        smtptransport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                res.json({ message: err });
                res.send({ message: err });
            } else {
                res.json({ message: `Email send to ${data.name} successfully`, messageID: info.messageId });
                res.send({ message: `Email send to ${data.name} successfully`, messageID: info.messageId });
            }
        });
        smtptransport.close();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

module.exports = router;


