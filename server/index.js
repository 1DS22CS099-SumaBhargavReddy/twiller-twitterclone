require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

// Load environment variables
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("database");
    const postCollection = db.collection("posts");
    const userCollection = db.collection("users");

    // Register a user
    app.post("/register", async (req, res) => {
      try {
        const user = req.body;
        const existingUser = await userCollection.findOne({ email: user.email });

        if (existingUser) {
          return res.status(400).json({ error: "User already exists" });
        }

        user.followers = [];
        const result = await userCollection.insertOne(user);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get logged-in user details
    app.get("/loggedinuser", async (req, res) => {
      try {
        const email = req.query.email;
        const user = await userCollection.findOne({ email });
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Post a tweet (with restrictions)
    app.post("/post", async (req, res) => {
      try {
        const { email, content } = req.body;

        const user = await userCollection.findOne({ email });

        if (!user) {
          return res.status(400).json({ error: "User not found" });
        }

        const followerCount = user.followers.length;
        const userPostsToday = await postCollection.countDocuments({
          email,
          timestamp: { $gte: new Date().setHours(0, 0, 0, 0) },
        });

        const now = new Date();
        const ISTTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        const currentHour = ISTTime.getHours();
        const currentMinutes = ISTTime.getMinutes();

        // Restriction: If user has no followers, they can post only between 10:00 - 10:30 AM IST
        if (followerCount === 0) {
          if (!(currentHour === 10 && currentMinutes >= 0 && currentMinutes <= 30)) {
            return res.status(403).json({
              error: "You can only post between 10:00 - 10:30 AM IST if you have no followers.",
            });
          }
        }

        // Restriction: If user has exactly 2 followers, allow only 2 posts per day
        if (followerCount >= 2 && followerCount < 10 && userPostsToday >= 2) {
          return res.status(403).json({ error: "You can only post 2 times a day." });
        }

        // If user has 10+ followers, allow unlimited posts

        const result = await postCollection.insertOne({
          email,
          content,
          timestamp: new Date(),
        });

        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get all posts
    app.get("/post", async (req, res) => {
      try {
        const posts = await postCollection.find().sort({ timestamp: -1 }).toArray();
        res.json(posts);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get user-specific posts
    app.get("/userpost", async (req, res) => {
      try {
        const email = req.query.email;
        const posts = await postCollection.find({ email }).sort({ timestamp: -1 }).toArray();
        res.json(posts);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get all users
    app.get("/user", async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Update user profile
    app.patch("/userupdate/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const profile = req.body;
        const options = { upsert: true };

        const updateDoc = { $set: profile };
        const result = await userCollection.updateOne({ email }, updateDoc, options);

        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // API to follow a user
    app.post("/follow", async (req, res) => {
      try {
        const { followerEmail, followingEmail } = req.body;

        const follower = await userCollection.findOne({ email: followerEmail });
        const following = await userCollection.findOne({ email: followingEmail });

        if (!follower || !following) {
          return res.status(400).json({ error: "Invalid user emails" });
        }

        // Check if already following
        if (follower.followers.includes(followingEmail)) {
          return res.status(400).json({ error: "Already following this user" });
        }

        // Update followers list
        await userCollection.updateOne(
          { email: followingEmail },
          { $push: { followers: followerEmail } }
        );

        res.json({ message: "User followed successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

// Test API endpoint
app.get("/", (req, res) => {
  res.send("Twiller API is running successfully");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
