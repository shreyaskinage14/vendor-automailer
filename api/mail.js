const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
var admin = require("firebase-admin");
require("dotenv").config();
// const db = require("./../firebase");

const service = {
  "type": process.env.type,
  "project_id": process.env.project_id,
  "private_key_id": process.env.private_key_id,
  "private_key": process.env.private_key,
  "client_email": process.env.client_email,
  "client_id": process.env.client_id,
  "auth_uri": process.env.auth_uri,
  "token_uri": process.env.token_uri,
  "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
  "client_x509_cert_url": process.env.client_x509_cert_url,
  "universe_domain": process.env.universe_domain
};

admin.initializeApp({
  credential: admin.credential.cert(service),
  databaseURL: process.env.databaseURL
});

router.post('/deleteuser', async (req, res) => {
  try {
    const { uid } = req.body;

    console.log(`Received request to delete user: ${uid}`);

    // Check if user exists in Authentication
    let user;
    try {
      user = await admin.auth().getUser(uid);
      console.log(`User found in Authentication: ${uid}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`User ${uid} already deleted from Authentication.`);

        // Still attempt to delete the user document from Firestore
        const userRef = admin.firestore().collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          await userRef.delete();
          console.log(`User document deleted from Firestore: ${uid}`);
        } else {
          console.log(`No Firestore document found for user: ${uid}`);
        }

        return res.status(200).json({ code: 1, message: 'User was already deleted from Authentication, but removed from Firestore (if existed).' });
      } else {
        throw error; // Re-throw unexpected errors
      }
    }

    // Check if the user has an email/password provider
    const emailProvider = user.providerData.find(provider => provider.providerId === 'password');

    if (emailProvider) {
      // Delete user from Authentication
      await admin.auth().deleteUser(uid);
      console.log(`User deleted from Authentication: ${uid}`);

      // Delete user document from Firestore
      const userRef = admin.firestore().collection('users').doc(uid);
      await userRef.delete();
      console.log(`User document deleted from Firestore: ${uid}`);

      return res.status(200).json({ code: 0, message: 'User Deleted Successfully!' });
    } else {
      console.log(`User ${uid} does not have an email/password provider.`);
      return res.status(400).json({ code: -1, message: 'User does not have an email/password provider.' });
    }
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    return res.status(500).json({ code: -1, message: `Error deleting user: ${error.message}` });
  }
});

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

    const { bank, einvoicing, general, vendorform, msa, nongst } = data.queries;

    let mailOptions = {
      from: `${process.env.FROMEMAIL}`,
      to: `${data.email}, ${data.introducerEmail}, ${process.env.FROMEMAIL}`,
      subject: `${data.name}, queries have been raised from the Onboarding Portal.`,
      html: `
        <div>
            ${general
          ? `<div style="font-size: 14px;">
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
          ? `<div style="font-size: 14px;">
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
            ${einvoicing
          ? `<div style="font-size: 14px;">
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
          ? `<div style="font-size: 14px;">
                    <p style="margin-bottom: 0px;"><b>Vendor Form</b></p>
                    <ol>
                        ${vendorform.map(
            (b) => `<li style="font-weight: 400">${b.title}</li>`
          )}
                    </ol>
                </div> `
          : ""
        }
            ${msa
          ? `<div style="font-size: 14px;">
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
            ${nongst
          ? `<div style="font-size: 14px;">
                        <p style="margin-bottom: 0px;"><b>Non-applicability of GST</b></p>
                        <ol>
                            ${nongst.map(
            (b) =>
              `<li style="font-weight: 400">${b.title}</li>`
          )}
                        </ol>
                    </div> `
          : ""
        }
        </div >
        <p>Please ignore the resolved queries</p>
        <p>Please login to your account and resolve the queries, <a href=${data?.vendorType == "trainee"
          ? "https://traineeonboarding.omnicommediagroup.co.in/"
          : "https://vendoronboarding.omnicommediagroup.co.in/"
        }>click here</a></p>
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
    let _mailTo = data.introducerEmail?.includes("@annalect.com") ? "diwakar.gupta@annalect.com, sumit.grover@annalect.com" : "preyash.parekh@omnicommediagroup.com";
    let mailOptions = {
      from: `${process.env.FROMEMAIL}`,
      // to: "naresh.chippa@omnicommediagroup.com",
      to: `${_mailTo}, ${process.env.FROMEMAIL}`,
      // to: "shreyaskinage14@gmail.com",
      subject: `Please Approve ${data.name} for Onboarding Portal`,
      html: `
                <div style="display: flex; flex-direction: row;  font-size: 16px; padding: 10px;">
                    <ul style="list-style: none; padding-left: 0px; padding: 0px;">
                        <li style="margin-bottom: 10px"><b>Name:</b><br> ${data.name
        }</li> 
                        <li style="margin-bottom: 10px"><b>Email:</b><br> ${data.email
        }</li>
                        <li style="margin-bottom: 10px"><b>Location:</b><br> ${data.location
        }</li>
                        <li style="margin-bottom: 10px"><b>Pan Number:</b><br> ${data.pan
        }</li>
                        <li style="margin-bottom: 10px"><b>Vendor Type:</b><br> ${data.vendorType
        }</li>
                        <li style="margin-bottom: 10px"><b>Introducer Name: </b><br>${data.introducerName
        }</li>
                        <li style="margin-bottom: 10px"><b>Introducer Email: </b><br>${data.introducerEmail
        }</li>
                        <li style="margin-bottom: 10px"><b>GST Filing Status: </b><br>${data.gstFillingStatus
          ? data.gstFillingStatus.toUpperCase()
          : "NA"
        }</li>
                        <li style="margin-bottom: 10px"><b>GST Team Remarks: </b><br>${data.remarks.gstteam
        }</li>
                        <li style="margin-bottom: 10px"><b>Vendor Team Remarks: </b><br>${data.remarks.vendorteam
        }</li>
                    </ul>
                </div>
                <div>
                    <a type='button' href="https://vendoronboarding.omnicommediagroup.co.in/approve/${data.uid
        }?action=accept&vendorName=${data.name
        }" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: green; color: #FFF;">Approve</a>
                    <a type='button' href="https://vendoronboarding.omnicommediagroup.co.in/approve/${data.uid
        }?action=acceptasexception&vendorName=${data.name
        }" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: #1E429F; color: #FFF;">Approve as Exception</a>
                    <a type='button' href="https://vendoronboarding.omnicommediagroup.co.in/approve/${data.uid
        }?action=deny&vendorName=${data.name
        }" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: #FF0000; color: #FFF;">Deny</a>
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

router.post("/approveauditor", async (req, res) => {
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
      to: `raghuraaman.janakiraman@omnicommediagroup.com, ${process.env.FROMEMAIL}`,
      //   to: "shreyaskinage14@gmail.com",
      subject: `Please Approve ${data.name} as Auditor for Onboarding Portal`,
      html: `
                <div style="display: flex; flex-direction: row;  font-size: 16px; padding: 10px;">
                    <ul style="list-style: none; padding-left: 0px; padding: 0px;">
                        <li style="margin-bottom: 10px"><b>Name:</b><br> ${data.name}</li> 
                        <li style="margin-bottom: 10px"><b>Email:</b><br> ${data.email}</li>
                    </ul>
                </div>
                <div>
                    <a type='button' href="http://localhost:3000/validate/${data.uid}?action=accept&vendorName=${data.name}" style="margin-right: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; background-color: green; color: #FFF;">Approve</a>
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

router.post("/createauditor", async (req, res) => {
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
        Login to the <a href="http://admin.omnicommediagroup.co.in/"}> Portal</a>
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

router.post("/rejectauditor", async (req, res) => {
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
      subject: `${data.name} rejected to Admin Portal`,
      html: `
        <h2>Please contact the </h2>
        <h3>PFB your Login Credentials to login</h3>
        <p>Email ID: ${data.email}</p>
        <p>Password: ${data.password}</p>
        Login to the <a href="http://admin.omnicommediagroup.co.in/"}> Portal</a>
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
      to: `${data.email}, ${process.env.FROMEMAIL}`,
      subject: `Welcome ${data.name} to Onboarding Portal`,
      html: `
        <h2> You have been invited to the Onboarding Portal.</h2>
        <h3>PFB your Login Credentials to login</h3>
        <p>Email ID: ${data.email}</p>
        <p>Password: ${data.password}</p>
        <p>Userid: ${data.userid}</p>
        Login to the <a href = ${data.usertype == "Trainee"
          ? "https://traineeonboarding.omnicommediagroup.co.in/"
          : "https://vendoronboarding.omnicommediagroup.co.in/"
        }> Portal</a>
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
        </tr><tr style="border-collapse:collapse"><td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:20px;padding-bottom:40px"><!--[if mso]><a href="https://vendoronboarding.omnicommediagroup.co.in/" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://vendoronboarding.omnicommediagroup.co.in/" style="height:46px; v-text-anchor:middle; width:172px" arcsize="22%" strokecolor="#3d5ca3" strokeweight="2px" fillcolor="#26366a"> <w:anchorlock></w:anchorlock> <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:14px; font-weight:700; line-height:14px; mso-text-raise:1px'>Log in to the Portal</center> </v:roundrect></a><![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border-2 es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#26366a;border-width:2px;display:inline-block;border-radius:10px;width:auto;mso-hide:all"><a href="https://vendoronboarding.omnicommediagroup.co.in/" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#ffffff;font-size:14px;border-style:solid;border-color:#26366a;border-width:15px 20px;display:inline-block;background:#26366a;border-radius:10px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center">Log in to the Portal</a></span><!--<![endif]--></td>
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
            <p>Please validate GST filing status on Portal, <a href="https://admin.omnicommediagroup.co.in/">click here</a></p>
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

router.post("/sendforapproval", async (req, res) => {
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

    const html = `
<div style="display: flex; flex-direction: row;  font-size: 16px; padding: 10px;">
    <ul style="list-style: none; padding-left: 0px; padding: 0px;">
        <li style="margin-bottom: 10px"><b>Vendor Name:</b><br> ${data.legalName}</li>
        <li style="margin-bottom: 10px"><b>Address:</b><br> ${data.address}</li>
        <li style="margin-bottom: 10px"><b>Contact Name:</b><br> ${data.contactName}</li>
        <li style="margin-bottom: 10px"><b>Phone Number:</b><br> ${data.contactNo}</li>
        <li style="margin-bottom: 10px"><b>Email Address:</b><br> ${data.emailAddress}</li>
        <li style="margin-bottom: 10px"><b>Services to be provided by Vendor:</b><br> ${data.services}</li>
        <li style="margin-bottom: 10px"><b>What is the estimated annual spend with this Vendor?:</b><br> ${data.annualSpend}</li>
        <li style="margin-bottom: 10px"><b>Is the vendor introduced by Client or Agency?:</b><br> ${data.vendorIntroduced}</li>
        <li style="margin-bottom: 10px"><b>Is the vendor to be engaged for the specific client Activity? -Please provide the name of the client:</b><br> ${data.vendorEngaged}</li>
        <li style="margin-bottom: 10px"><b>Is this service restricted to this vendor or any other vendor can give this service:</b><br> ${data.vendorServiceRestricted}</li>
        <li style="margin-bottom: 10px"><b>Is this client requirements. If yes then please attach the client’s mail:</b><br> ${data.isClientRequirement}</li>
        <li style="margin-bottom: 10px"><b>Client Email:</b><br> 
            <a href="${data.clientEmail}" target="_blank" style="color: blue; text-decoration: underline;">View File</a>
        </li>
        <li style="margin-bottom: 10px"><b>Are you satisfied the Vendor has the capacity and capability to deliver the service required?:</b><br> ${data.isVendorCapable}</li>
        <li style="margin-bottom: 10px"><b>Requester's name / title / department:</b><br> ${data.requesterName}</li>
        <li style="margin-bottom: 10px"><b>Requester Signature:</b><br> 
            ${data.signImage ? `<img src="${data.signImage}" alt="Sign Image" style="max-width: 100px; max-height: 100px;">` : 'No Sign Image'}
        </li>
        <li style="margin-bottom: 10px"><b>Risk Assessment:</b><br> 
            <a href="${data.riskAssesment}" target="_blank" style="color: blue; text-decoration: underline;">View File</a>
        </li>
        <li style="margin-bottom: 10px"><b>Date:</b><br> ${data.date}</li>
        <br>
        <br>
        <li style="margin-bottom: 10px"><b>Introducer:</b><br> ${data.name} (${data.email})</li>
        <li style="margin-bottom: 10px"><b>Business Head:</b><br> ${data.businessHeadName} (${data.businessHeadEmail})</li>
        <li style="margin-bottom: 10px"><b>Brand Approver Email:</b><br> ${data.firstApprover}</li>
        
    </ul>
</div>
<div>
    <a type='button' href="https://vendoronboarding.omnicommediagroup.co.in/${data?.approval == "1" ? "firstapprove" : "secondapprove"}/${data.new_useruid}/${data.uid}?action=accept&vendorName=${data.legalName}" style="margin-right: 10px; padding: 15px 20px; border-radius: 8px; text-decoration: none; background-color: green; color: #FFF;">Approve</a>
    <a type='button' href="https://vendoronboarding.omnicommediagroup.co.in/${data?.approval == "1" ? "firstapprove" : "secondapprove"}/${data.new_useruid}/${data.uid}?action=reject&vendorName=${data.legalName}" style="margin-right: 10px; padding: 15px 20px; border-radius: 8px; text-decoration: none; background-color: #FF0000; color: #FFF;">Reject</a>
    <br>
</div>
`;

    console.log(html);


    // let _mailTo = data.email?.includes("@annalect.com") ? "diwakar.gupta@annalect.com" : "preyash.parekh@omnicommediagroup.com";
    let mailOptions = {
      from: `${process.env.FROMEMAIL}`,
      // to: "naresh.chippa@omnicommediagroup.com",
      // to: `${data?.businessHeadEmail}, ${process.env.FROMEMAIL}, vikesh.agarwal@omnicommediagroup.com, gsthelpdeskapindia@omnicommediagroup.com`,
      to: `${process.env.FROMEMAIL}, vikesh.agarwal@omnicommediagroup.com, shreyaskinagee@gmail.com`,
      subject: `Please Approve ${data.legalName} for Onboarding Portal`,
      html: html,
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

router.post("/finalapprove", async (req, res) => {
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

    const html = `
<div style="display: flex; flex-direction: row;  font-size: 16px; padding: 10px;">
    <ul style="list-style: none; padding-left: 0px; padding: 0px;">
        <li style="margin-bottom: 10px"><b>Vendor Name:</b><br> ${data.legalName}</li>
        <li style="margin-bottom: 10px"><b>Address:</b><br> ${data.address}</li>
        <li style="margin-bottom: 10px"><b>Contact Name:</b><br> ${data.contactName}</li>
        <li style="margin-bottom: 10px"><b>Phone Number:</b><br> ${data.contactNo}</li>
        <li style="margin-bottom: 10px"><b>Email Address:</b><br> ${data.emailAddress}</li>
        <li style="margin-bottom: 10px"><b>Client Email:</b><br> 
            <a href="${data.clientEmail}" target="_blank" style="color: blue; text-decoration: underline;">View File</a>
        </li>
        <li style="margin-bottom: 10px"><b>Requester's name / title / department:</b><br> ${data.requesterName}</li>
        <li style="margin-bottom: 10px"><b>Requester Signature:</b><br> 
            ${data.signImage ? `<img src="${data.signImage}" alt="Sign Image" style="max-width: 100px; max-height: 100px;">` : 'No Sign Image'}
        </li>
        <li style="margin-bottom: 10px"><b>Risk Assessment:</b><br> 
            <a href="${data.riskAssesment}" target="_blank" style="color: blue; text-decoration: underline;">View File</a>
        </li>
        <li style="margin-bottom: 10px"><b>Date:</b><br> ${data.date}</li>
        <br>
        <br>
        <li style="margin-bottom: 10px"><b>Introducer:</b><br> ${data.name} (${data.email})</li>
        <li style="margin-bottom: 10px"><b>Business Head:</b><br> ${data.businessHeadName} (${data.businessHeadEmail})</li>
        <li style="margin-bottom: 10px"><b>Brand Approver Email:</b><br> ${data.firstApprover}</li>
        
    </ul>
</div>
<div>
    <a type='button' href="https://vendoronboarding.omnicommediagroup.co.in/finalapproval/${data.new_useruid}/${data.uid}?action=accept&vendorName=${data.legalName}" style="margin-right: 10px; padding: 15px 20px; border-radius: 8px; text-decoration: none; background-color: green; color: #FFF;">Send Invite</a>
    <a type='button' href="https://vendoronboarding.omnicommediagroup.co.in/finalapproval/${data.new_useruid}/${data.uid}?action=reject&vendorName=${data.legalName}" style="margin-right: 10px; padding: 15px 20px; border-radius: 8px; text-decoration: none; background-color: #FF0000; color: #FFF;">Reject</a>
    <br>
</div>
`;

    console.log(html);


    // let _mailTo = data.email?.includes("@annalect.com") ? "diwakar.gupta@annalect.com" : "preyash.parekh@omnicommediagroup.com";
    let mailOptions = {
      from: `${process.env.FROMEMAIL}`,
      // to: "naresh.chippa@omnicommediagroup.com",
      // to: `${data?.businessHeadEmail}, ${process.env.FROMEMAIL}, vikesh.agarwal@omnicommediagroup.com, gsthelpdeskapindia@omnicommediagroup.com`,
      to: `${process.env.FROMEMAIL}, vikesh.agarwal@omnicommediagroup.com, shreyaskinagee@gmail.com`,
      subject: `Please Approve ${data.legalName} for Onboarding Portal`,
      html: html,
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

// let usersRef = db.collection("users").doc('kXOPD3tjdzaPTLuz3tbEI2FcGu12');

// usersRef.get().then((querySnapshot) => {
//     console.log(querySnapshot.data());
// })

module.exports = router;
