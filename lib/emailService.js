const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" });

const sender_email = "lalalivecs@gmail.com";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sender_email,
    pass: "wtijnsbsiaazpblf",
  },
});

exports.emailVerification = async function (token, user) {
  transport
    .sendMail({
      from: sender_email,
      to: user.email,
      subject: "Welcome to Lala-live! Please Confirm Your Email for Login",
      html: `<h1><b>Hello ${user.userName} !</b></h1>

                <h4><i>You're on your way!</i></h4>
                <h5>Let's confirm your email address</h5>
                <p>By clicking on the following link, you are confirming your email address to verify your registration.</p>
                <a href="${process.env.BASE_URL}/user/VerifyAccount?token=${token}"><b><i> Verify Account </i></b></a>`,
    })
    .then(() => {
      console.log("Email Sent to " + user.email + " for account verification");
    })
    .catch(() => {
      console.log(
        "Email Not Sent to " + user.email + " for account verification"
      );
    });
};

exports.sendForgotEmail = async function (token, user) {
  transport
    .sendMail({
      from: sender_email,
      to: user.email,
      subject: "Reset your password",
      html: `     
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
              
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="${process.env.BASE_URL}/user/resetpassword?token=${token}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; 
                                            font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.rakeshmandal.com</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>
                `,
    })
    .then(() => {
      console.log("Email Sent to " + user.email + " for Reset Password");
    })
    .catch(() => {
      console.log("Email Not Sent to " + user.email + " for Reset Password");
    });
};

exports.sendOtpEmail = async function (email, otp) {
  transport
    .sendMail({
      from: sender_email,
      to: email,
      subject: "Your OTP",
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your OTP</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>This OTP is valid for 2 minutes only.</p>
        <hr/>
        <p>This email may contain sensitive data.</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;"><br />Z-Live</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Z-Live</p>
     
    </div>
  </div>
</div>
      
      
      `,
    })
    .then(() => {
      console.log("Email Sent to " + email + " for OTP");
    })
    .catch(() => {
      console.log("Email Not Sent to " + email + " for OTP");
    });
};

exports.sendPointEmail = async function (amount, user) {
  transport
    .sendMail({
      from: sender_email,
      to: user.email,
      subject: "payment successfull",
      html: `    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Hello ,${user.userName}</h2>
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your payment has been successed</a>
    </div>
<p>You have successfully paid ${amount}</p>
        <p>This email may contain sensitive data.</p>

    <p style="font-size:0.9em;"><br />Z-Live</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Z-Live</p>
     
    </div>
  </div>
</div>
      
      
      `,
    })
    .then(() => {
      console.log("Email Sent to " + user.email + " for OTP");
    })
    .catch(() => {
      console.log("Email Not Sent to " + user.email + " for OTP");
    });
};

exports.sendWithdrawEmail = async function (withdraw) {
  transport
    .sendMail({
      from: sender_email,
      to: withdraw.email,
      subject: "Withdrawal successfull",
      html: ` <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Hello ,${withdraw.fullName}</h2>
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your withdrawal has been successed</a>
    </div>
          <p><h4>Full Name: ${withdraw.fullName}</h4></p>
          <p><h4>Amount: ${withdraw.amount}$</h4></p>
          <p><h4>Bank Name: ${withdraw.bankName}</h4></p>
          <p><h4>Acc. Number: ${withdraw.accountNumber}</h4></p>
          <p><h4>Acc. Type: ${withdraw.accountType}</h4></p>
          <p><h4>Address: ${withdraw.address}</h4></p>
          <p><h4>Postal Code: ${withdraw.postalCode}</h4></p>
          <p><h4>Date: ${withdraw.date}</h4></p>
          <p><h4>Time: ${withdraw.time}</h4></p>
          <p><h4>Country: ${withdraw.country}</h4></p>
          <p><h4>Comments: ${withdraw.comments}</h4></p>

        <p><h4>This email may contain sensitive data.</h4></p>
        

    <p style="font-size:0.9em;"><br />Z-Live</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Z-Live</p>
     
    </div>
  </div>
</div>
      
      
      `,
    })
    .then(() => {
      console.log("Email Sent to " + withdraw.email + " for withdraw");
    })
    .catch(() => {
      console.log("Email Not Sent to " + withdraw.email + " for withdraw");
    });
};
