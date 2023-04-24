const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();
// const db = require("./../firebase");

router.post("/sendquery", async (req, res) => {
    try {
        let data = req.body;
        let smtptransport = nodemailer.createTransport({
            host: process.env.SMTPHOST,
            port: process.env.SMTPPORT,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPWD,
            },
        });

        const { bank, einvoicing, general, vendorform, msa, nonapplicability } =
            data.queries;

        let mailOptions = {
            from: `${process.env.FROMEMAIL}`,
            to: `${data.email}, ${data.introducerEmail}, ${process.env.FROMEMAIL}`,
            subject: `${data.name}, queries have been raised from the Onboarding Portal.`,
            html: `
        <div>
            <div style="display:flex; font-size: 16px;">
            ${general
                    ? `<div style="width: 50%; font-size: 14px;">
                        <p style="margin-bottom: 0px;"><b>General</b></p>
                        <ol style="margin: 0px; padding: 0px;">
                            ${general.map(
                        (b) =>
                            `<li style="font-weight: 400">${b.title}</li>`
                    )}
                        </ol>
                    </div> `
                    : ""
                }
                ${bank
                    ? `<div style="width: 50%; font-size: 14px;">
                        <p style="margin-bottom: 0px;"><b>Bank</b></p>
                        <ol>
                            ${bank.map(
                        (b) =>
                            `<li style="font-weight: 400">${b.title}</li>`
                    )}
                        </ol>
                    </div> `
                    : ""
                }
            </div>
            <div style="display:flex; font-size: 16px;">
            ${einvoicing
                    ? `<div style="width: 50%; font-size: 14px;">
                        <p style="margin-bottom: 0px;"><b>E-Invoicing</b></p>
                        <ol>
                            ${einvoicing.map(
                        (b) =>
                            `<li style="font-weight: 400">${b.title}</li>`
                    )}
                        </ol>
                    </div> `
                    : ""
                }
            ${vendorform
                    ? `<div style="width: 50%; font-size: 14px;">
                    <p style="margin-bottom: 0px;"><b>Vendor Form</b></p>
                    <ol>
                        ${vendorform.map(
                        (b) => `<li style="font-weight: 400">${b.title}</li>`
                    )}
                    </ol>
                </div> `
                    : ""
                }
            </div>
            <div style="display:flex; font-size: 16px;">
            ${msa
                    ? `<div style="width: 50%; font-size: 14px;">
                        <p style="margin-bottom: 0px;"><b>Master Service Agreement</b></p>
                        <ol>
                            ${msa.map(
                        (b) =>
                            `<li style="font-weight: 400">${b.title}</li>`
                    )}
                        </ol>
                    </div> `
                    : ""
                }
            ${nonapplicability
                    ? `<div style="width: 50%; font-size: 14px;">
                        <p style="margin-bottom: 0px;"><b>Non-applicability of GST</b></p>
                        <ol>
                            ${nonapplicability.map(
                        (b) =>
                            `<li style="font-weight: 400">${b.title}</li>`
                    )}
                        </ol>
                    </div> `
                    : ""
                }
            </div>
        </div >
        <p>Please ignore the resolved queries</p>
        <p>Please login to your account and resolve the queries, <a href="https://vendoronboarding.omnicommediagroup.in/">click here</a></p>
    `,
        };

        smtptransport.sendMail(mailOptions, (err, info) => {
            console.log(err, info);
            if (err) {
                res.json({ message: err });
                res.send({ message: err });
            } else {
                res.json({
                    message: `Email send successfully`,
                    messageID: info.messageId,
                });
                res.send({
                    message: `Email send successfully`,
                    messageID: info.messageId,
                });
            }
        });
        smtptransport.close();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

router.post("/approvemail", async (req, res) => {
    try {
        let data = req.body;
        let smtptransport = nodemailer.createTransport({
            host: process.env.SMTPHOST,
            port: process.env.SMTPPORT,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPWD,
            },
        });
        let mailOptions = {
            from: `${process.env.FROMEMAIL}`,
            // to: "naresh.chippa@omnicommediagroup.com",
            to: `raghuraaman.janakiraman@omnicommediagroup.com`,
            // to: "shreyaskinage14@gmail.com",
            subject: `Please Approve ${data.name} for Onboarding Portal`,
            html: `
                <div style="display: flex; flex-direction: row;  font-size: 16px; padding: 10px;">
                    <ul style="list-style: none; padding-left: 0px; padding: 0px;">
                        <li style="margin-bottom: 10px"><b>Name:</b><br> ${data.name}</li> 
                        <li style="margin-bottom: 10px"><b>Email:</b><br> ${data.email}</li>
                        <li style="margin-bottom: 10px"><b>Location:</b><br> ${data.location}</li>
                        <li style="margin-bottom: 10px"><b>Pan Number:</b><br> ${data.pan}</li>
                        <li style="margin-bottom: 10px"><b>Vendor Type:</b><br> ${data.vendorType}</li>
                        <li style="margin-bottom: 10px"><b>Introducer Name: </b><br>${data.introducerName}</li>
                        <li style="margin-bottom: 10px"><b>Introducer Email: </b><br>${data.introducerEmail}</li>
                        <li style="margin-bottom: 10px"><b>GST Team Remarks: </b><br>${data.remarks.gstteam}</li>
                        <li style="margin-bottom: 10px"><b>Vendor Team Remarks: </b><br>${data.remarks.vendorteam}</li>
                    </ul>
                </div>
                <div>
                    <a type='button' href="https://vendoronboarding.omnicommediagroup.in/approve/${data.uid}?action=accept&vendorName=${data.name}" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: green; color: #FFF;">Approve</a>
                    <a type='button' href="https://vendoronboarding.omnicommediagroup.in/approve/${data.uid}?action=acceptasexception&vendorName=${data.name}" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: #1E429F; color: #FFF;">Approve as Exception</a>
                    <a type='button' href="https://vendoronboarding.omnicommediagroup.in/approve/${data.uid}?action=deny&vendorName=${data.name}" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: #FF0000; color: #FFF;">Deny</a>
                </div>
        `,
        };

        smtptransport.sendMail(mailOptions, (err, info) => {
            if (err) {
                res.json({ message: err });
                res.send({ message: err });
            } else {
                res.json({
                    message: `Email send successfully`,
                    messageID: info.messageId,
                });
                res.send({
                    message: `Email send successfully`,
                    messageID: info.messageId,
                });
            }
        });
        smtptransport.close();
    } catch (error) {
        return res.status(500).send("Server Error");
    }
});

router.post("/createuser", async (req, res) => {
    try {
        let data = req.body;
        let smtptransport = nodemailer.createTransport({
            host: process.env.SMTPHOST,
            port: process.env.SMTPPORT,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPWD,
            },
        });

        let mailOptions = {
            from: `${process.env.FROMEMAIL}`,
            to: data.email,
            subject: `Welcome ${data.name} to Onboarding Portal`,
            html: `
        <h2> You have been invited to the Onboarding Portal.</h2>
        <h3>PFB your Login Credentials to login</h3>
        <p>Email ID: ${data.email}</p>
        <p>Password: ${data.password}</p>
        Login to the <a href = ${data.usertype == "Trainee" ? "https://traineeonboarding.omnicommediagroup.in/" : "https://vendoronboarding.omnicommediagroup.in/"}> Portal</a>
        <p><b>Note: Before logging to the portal, please verify your account. The verification link has been sent to your email. Please check spam folder, if not found</b></p>
    `,
        };

        smtptransport.sendMail(mailOptions, (err, info) => {
            if (err) {
                res.json({ message: err });
                res.send({ message: err });
            } else {
                res.json({
                    message: `Email send successfully`,
                    messageID: info.messageId,
                });
                res.send({
                    message: `Email send successfully`,
                    messageID: info.messageId,
                });
            }
        });
        smtptransport.close();
    } catch (error) {
        return res.status(500).send("Server Error");
    }
});

router.post("/welcomemail", async (req, res) => {
    try {
        let data = req.body;
        function getActionType() {
            if (data.action == "accept") {
                return "Welcome Onboard";
            }
            if (data.action == "acceptasexception") {
                return "Welcome Onboard";
            }
            if (data.action == "deny") {
                return "Vendor Denied";
            }
        }
        let smtptransport = nodemailer.createTransport({
            host: process.env.SMTPHOST,
            port: process.env.SMTPPORT,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPWD,
            },
        });

        const title = getActionType();

        let mailOptions = {
            from: `${process.env.FROMEMAIL}`,
            // to: data.email,
            to:
                data.action == "deny"
                    ? `${data.introducerEmail} ${process.env.FROMEMAIL}`
                    : `${data.email}, ${data.introducerEmail} ${process.env.FROMEMAIL}`,
            subject: `${title}, ${data.name} `,
            html: `
        <div class="es-wrapper-color" style="background-color:transparent">
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:transparent"><tr style="border-collapse:collapse"><td valign="top" style="padding:0;Margin:0"><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr style="border-collapse:collapse"><td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center"><table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:20px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:600px"><table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top" width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://firebasestorage.googleapis.com/v0/b/omg-vendor-portal.appspot.com/o/download.png?alt=media&token=99813458-00cd-46b5-8f4a-3a0cc2323b92" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" class="adapt-img" width="600" height="150"></td>
    </tr><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;padding-top:25px;padding-bottom:25px"><h1 style="Margin:0;line-height:42px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:28px;font-style:normal;font-weight:normal;color:#333333"><b>${title}</b></h1><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:27px;color:#333333;font-size:18px">${data.name}</p></td>
        </tr><tr style="border-collapse:collapse"><td align="center" style="padding:20px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#333333;font-size:16px">As a leading global media network, Omnicom Media Group (OMG) sets itself apart with an agile, client-first approach that helps businesses thrive today and into the future. With more than 21,000 employees globally, OMG has the talent, expertise and clout to deliver unprecedented levels of innovation for our clients.</p></td>
        </tr><tr style="border-collapse:collapse"><td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:20px;padding-bottom:40px"><!--[if mso]><a href="https://vendoronboarding.omnicommediagroup.in/" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://vendoronboarding.omnicommediagroup.in/" style="height:46px; v-text-anchor:middle; width:172px" arcsize="22%" strokecolor="#3d5ca3" strokeweight="2px" fillcolor="#26366a"> <w:anchorlock></w:anchorlock> <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:14px; font-weight:700; line-height:14px; mso-text-raise:1px'>Log in to the Portal</center> </v:roundrect></a><![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border-2 es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#26366a;border-width:2px;display:inline-block;border-radius:10px;width:auto;mso-hide:all"><a href="https://vendoronboarding.omnicommediagroup.in/" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#ffffff;font-size:14px;border-style:solid;border-color:#26366a;border-width:15px 20px;display:inline-block;background:#26366a;border-radius:10px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">Log in to the Portal</a></span><!--<![endif]--></td>
        </tr></table></td></tr></table></td></tr></table></td>
    </tr></table><table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse"><td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center"><table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"><tr style="border-collapse:collapse"><td align="left" bgcolor="#26366A" style="Margin:0;padding-top:10px;padding-bottom:15px;padding-left:20px;padding-right:20px;background-color:#26366a"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><h2 style="Margin:0;line-height:19px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:16px;font-style:normal;font-weight:normal;color:#f8f7f7"><strong>Have questions?</strong></h2>
    </td></tr><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-bottom:5px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;color:#ffffff;font-size:14px">We are here to help, <a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#ffffff;font-size:14px" href="">contact us at vendoronboarding@omnicommediagroup.com</a></p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table>
            </div>
        `,
        };

        smtptransport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                res.json({ message: err });
                res.send({ message: err });
            } else {
                res.json({
                    message: `Email send successfully`,
                    messageID: info.messageId,
                });
                res.send({
                    message: `Email send successfully`,
                    messageID: info.messageId,
                });
            }
        });
        smtptransport.close();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

router.post("/sendgst", async (req, res) => {
    try {
        let data = req.body;
        let smtptransport = nodemailer.createTransport({
            host: process.env.SMTPHOST,
            port: process.env.SMTPPORT,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPWD,
            },
        });

        let mailOptions = {
            from: `${process.env.FROMEMAIL}`,
            to: `rukesh.chippa2@omnicommediagroup.com, ${process.env.FROMEMAIL}`,
            subject: `${data.name} added GSTIN Number`,
            html: `
        <p> Vendor <b> ${data.name}</b> with <b>${data.gstin}</b> GSTIN Number, have registered on the portal.</p>
            <p>Please validate GST filing status on Portal, <a href="https://admin.omnicommediagroup.in/">click here</a></p>
    `,
        };

        smtptransport.sendMail(mailOptions, (err, info) => {
            if (err) {
                res.json({ message: err });
                res.send({ message: err });
            } else {
                res.json({
                    message: `Email send to GST Team successfully`,
                    messageID: info.messageId,
                });
                res.send({
                    message: `Email send to GST Team successfully`,
                    messageID: info.messageId,
                });
            }
        });
        smtptransport.close();
    } catch (error) {
        return res.status(500).send("Server Error");
    }
});

// let usersRef = db.collection("users").doc('kXOPD3tjdzaPTLuz3tbEI2FcGu12');

// usersRef.get().then((querySnapshot) => {
//     console.log(querySnapshot.data());
// })

module.exports = router;
