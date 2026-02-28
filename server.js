const express = require("express");
const cors = require("cors")
const path = require("path");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use(cors({
  origin:function(origin, callback){
    if(!origin || allowedOrigins.includes (origin)) callback(null,true);
    else callback(new Error("Not allowed by CORS"))
  },
}))


const sendGridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;
const toEmail = process.env.SENDGRID_TO_EMAIL;

if (!sendGridApiKey || !fromEmail || !toEmail) {
  console.error("Missing required environment variables: SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, SENDGRID_TO_EMAIL");
  process.exit(1);
}

sgMail.setApiKey(sendGridApiKey);

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: `Website contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ ok: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message || error);
    return res.status(500).json({ error: "Failed to send message." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
