const sgMail = require("@sendgrid/mail");
const path = require("path");
const fs = require("fs");

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("⚠️ SENDGRID_API_KEY is not set. Emails will not be sent.");
}

// Replace placeholders like #{name}
const replaceContent = (content, metaData) => {
  return Object.keys(metaData || {}).reduce((updatedContent, key) => {
    return updatedContent.replace(new RegExp(`#{${key}}`, "g"), metaData[key]);
  }, content);
};

const emailHelper = async (templateName, receiverEmail, metaData = {}, attachments = []) => {
  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error("EMAIL_FROM is not set in environment variables");
    }

    const templatePath = path.join(__dirname, "email_templates", templateName);
    let content = await fs.promises.readFile(templatePath, "utf-8");
    content = replaceContent(content, metaData);

    const emailDetails = {
      to: receiverEmail,
      from: { email: process.env.EMAIL_FROM, name: "VehicleHub" },
      subject: "Mail from VehicleHub",
      html: content,
    };

    if (attachments && attachments.length > 0) {
      emailDetails.attachments = attachments;
    }

    if (!process.env.SENDGRID_API_KEY) {
      console.warn("⚠️ Cannot send email: SENDGRID_API_KEY missing");
      return;
    }

    const response = await sgMail.send(emailDetails);
    console.log("Email sent successfully");
    return response;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("Template file not found:", err.message);
    } else if (err.response?.body) {
      console.error("SendGrid Response Error:", JSON.stringify(err.response.body, null, 2));
    } else {
      console.error("Error:", err.message);
    }
    throw err;
  }
};

module.exports = emailHelper;
