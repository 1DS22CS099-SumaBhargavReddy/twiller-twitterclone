require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Load environment variables
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);

const otpStorage = {}; // Temporary storage for OTPs

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("database");
    const postCollection = db.collection("posts");
    const userCollection = db.collection("users");

    // Send OTP for language change
    app.post("/send-otp", async (req, res) => {
      const { email, language } = req.body;
      const otp = generateOTP();
      otpStorage[email] = otp;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Language Change OTP",
          text: `Your OTP for changing language to ${language} is: ${otp}`,
        });
        res.json({ message: "OTP sent successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to send OTP" });
      }
    });

    // Verify OTP and update language preference
    app.post("/verify-otp", async (req, res) => {
      const { email, otp, language } = req.body;
      if (otpStorage[email] === otp) {
        delete otpStorage[email];
        await userCollection.updateOne(
          { email },
          { $set: { preferredLanguage: language } },
          { upsert: true }
        );
        res.json({ success: true, message: "Language updated successfully" });
      } else {
        res.status(400).json({ error: "Invalid OTP" });
      }
    });

    // Get user profile
    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.findOne({ email });
      res.json(user);
    });

    // Test API endpoint
    app.get("/", (req, res) => {
      res.send("Twiller API is running successfully");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
