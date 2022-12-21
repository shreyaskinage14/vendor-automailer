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
            to: 'raghuraaman.janakiraman@omnicommediagroup.com',
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
            // to: data.email,
            to: 'shreyaskinage14@gmail.com',
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

        let mailOptions = {
            from: 'Shreyas Sanjay Kinage <xcage584@gmail.com>',
            to: data.email,
            cc: `${data.introducerEmail}, gsthelpdeskapindia@omnicommediagroup.com`,
            subject: `${data?.title}, ${data.name}`,
            attachments: [{
                filename: 'download.png',
                path: 'images/download.png',
                cid: 'omg@bannerimage'
            }],
            html: `
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                    <head>
                    <meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport">
                    <meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta content="telephone=no" name="format-detection">
                    <title>User creation</title>
                    <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
                    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                    <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]-->
                    <style type="text/css">
                    .rollover div { font - size: 0; } #outlook a { padding: 0; }.ExternalClass { width: 100 %; }.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div { line - height: 100 %; }.es - button { mso - style - priority: 100!important; text - decoration: none!important; } a[x - apple - data - detectors] { color: inherit!important; text - decoration: none!important; font - size: inherit!important; font - family: inherit!important; font - weight: inherit!important; line - height: inherit!important; }.es - desk - hidden { display: none; float: left; overflow: hidden; width: 0; max - height: 0; line - height: 0; mso - hide: all; }.es - button - border:hover a.es - button, .es - button - border:hover button.es - button { background: #ffffff!important; border - color: #ffffff!important; }.es - button - border:hover { background: #ffffff!important; border - style:solid solid solid solid!important; border - color:#3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3!important; } [data - ogsb].es - button { border - width: 0!important; padding: 15px 20px 15px 20px!important; } td.es - button - border:hover a.es - button - 1 { background:#3f538b!important; border - color:#3f538b!important; } td.es - button - border - 2:hover { background:#3f538b!important; } [data - ogsb].es - button.es - button - 3 { padding: 15px 20px!important; } @media only screen and(max - width: 600px) { p, ul li, ol li, a { line - height: 150 % !important } h1, h2, h3, h1 a, h2 a, h3 a { line - height: 120 % !important } h1 { font - size: 20px!important; text - align: center } h2 { font - size: 16px!important; text - align: left } h3 { font - size: 20px!important; text - align: center } .es - header - body h1 a, .es - content - body h1 a, .es - footer - body h1 a { font - size: 20px!important } h2 a { text - align: left } .es - header - body h2 a, .es - content - body h2 a, .es - footer - body h2 a { font - size: 16px!important } .es - header - body h3 a, .es - content - body h3 a, .es - footer - body h3 a { font - size: 20px!important } .es - menu td a { font - size: 14px!important } .es - header - body p, .es - header - body ul li, .es - header - body ol li, .es - header - body a { font - size: 10px!important } .es - content - body p, .es - content - body ul li, .es - content - body ol li, .es - content - body a { font - size: 16px!important } .es - footer - body p, .es - footer - body ul li, .es - footer - body ol li, .es - footer - body a { font - size: 12px!important } .es - infoblock p, .es - infoblock ul li, .es - infoblock ol li, .es - infoblock a { font - size: 12px!important } * [class= "gmail-fix"] { display: none!important } .es - m - txt - c, .es - m - txt - c h1, .es - m - txt - c h2, .es - m - txt - c h3 { text - align: center!important } .es - m - txt - r, .es - m - txt - r h1, .es - m - txt - r h2, .es - m - txt - r h3 { text - align: right!important } .es - m - txt - l, .es - m - txt - l h1, .es - m - txt - l h2, .es - m - txt - l h3 { text - align: left!important } .es - m - txt - r img, .es - m - txt - c img, .es - m - txt - l img { display: inline!important } .es - button - border { display: block!important } a.es - button, button.es - button { font - size: 14px!important; display: block!important; border - left - width: 0px!important; border - right - width: 0px!important } .es - btn - fw { border - width: 10px 0px!important; text - align: center!important } .es - adaptive table, .es - btn - fw, .es - btn - fw - brdr, .es - left, .es - right { width: 100 % !important } .es - content table, .es - header table, .es - footer table, .es - content, .es - footer, .es - header { width: 100 % !important; max - width: 600px!important } .es - adapt - td { display: block!important; width: 100 % !important } .adapt - img { width: 100 % !important; height: auto!important } .es - m - p0 { padding: 0px!important } .es - m - p0r { padding - right: 0px!important } .es - m - p0l { padding - left: 0px!important } .es - m - p0t { padding - top: 0px!important } .es - m - p0b { padding - bottom: 0!important } .es - m - p20b { padding - bottom: 20px!important } .es - mobile - hidden, .es - hidden { display: none!important } tr.es - desk - hidden, td.es - desk - hidden, table.es - desk - hidden { width: auto!important; overflow: visible!important; float: none!important; max - height: inherit!important; line - height: inherit!important } tr.es - desk - hidden { display: table - row!important } table.es - desk - hidden { display: table!important } td.es - desk - menu - hidden { display: table - cell!important } .es - menu td { width: 1 % !important } table.es - table - not - adapt, .esd - block - html table { width: auto!important } table.es - social { display: inline - block!important } table.es - social td { display: inline - block!important } .es - desk - hidden { display: table - row!important; width: auto!important; overflow: visible!important; max - height: inherit!important } .h - auto { height: auto!important } }
                    </style >
                    </head>
            <body style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;padding:0;Margin:0">
            <div class="es-wrapper-color" style="background-color:transparent">
            <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="transparent"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:transparent"><tr style="border-collapse:collapse"><td valign="top" style="padding:0;Margin:0"><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr style="border-collapse:collapse"><td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center"><table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:20px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:600px"><table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top" width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0px"><img src="cid:omg@bannerimage" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" class="adapt-img" width="600" height="150"></td>
            </tr><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;padding-top:25px;padding-bottom:25px"><h1 style="Margin:0;line-height:42px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:28px;font-style:normal;font-weight:normal;color:#333333"><b>${data.title}</b></h1><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:27px;color:#333333;font-size:18px">${data.name}</p></td>
            </tr><tr style="border-collapse:collapse"><td align="center" style="padding:20px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#333333;font-size:16px">As a leading global media network, Omnicom Media Group (OMG) sets itself apart with an agile, client-first approach that helps businesses thrive today and into the future. With more than 21,000 employees globally, OMG has the talent, expertise and clout to deliver unprecedented levels of innovation for our clients.</p></td>
            </tr><tr style="border-collapse:collapse"><td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:20px;padding-bottom:40px"><!--[if mso]><a href="https://testing-omg.vercel.app/" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://testing-omg.vercel.app/" style="height:46px; v-text-anchor:middle; width:172px" arcsize="22%" strokecolor="#3d5ca3" strokeweight="2px" fillcolor="#26366a"> <w:anchorlock></w:anchorlock> <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:14px; font-weight:700; line-height:14px; mso-text-raise:1px'>Log in to the Portal</center> </v:roundrect></a><![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border-2 es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#26366a;border-width:2px;display:inline-block;border-radius:10px;width:auto;mso-hide:all"><a href="https://testing-omg.vercel.app/" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#ffffff;font-size:14px;border-style:solid;border-color:#26366a;border-width:15px 20px;display:inline-block;background:#26366a;border-radius:10px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">Log in to the Portal</a></span><!--<![endif]--></td>
            </tr></table></td></tr></table></td></tr></table></td>
            </tr></table><table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse"><td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center"><table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse"><td align="left" bgcolor="#26366A" style="Margin:0;padding-top:10px;padding-bottom:15px;padding-left:20px;padding-right:20px;background-color:#26366a"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><h2 style="Margin:0;line-height:19px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:16px;font-style:normal;font-weight:normal;color:#f8f7f7"><strong>Have questions?</strong></h2>
            </td></tr><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-bottom:5px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;color:#ffffff;font-size:14px">We are here to help, <a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#ffffff;font-size:14px" href="">contact us at xyz@omnicommediagroup.com</a></p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table>
            </div>
            </body>
            </html>
                    `,
        }

        console.log(mailOptions);
        smtptransport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
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
        return res.status(500).send(error);
    }
})

module.exports = router;


