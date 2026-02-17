const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// exports.sendMail = async(receiverEmail,subject,body) => {
//     await transporter.sendMail({
//     from: process.env.EMAIL,
//     to: receiverEmail,
//     subject: subject,
//     html: body
//   });
// };

exports.sendMail = async (receiverEmail, subject, body) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: receiverEmail,
      subject: subject,
      html: body,
    });
    console.log("Mail sent successfully");
  } catch (error) {
    console.error("Mail send error:", error);
    throw error;
  }
};
