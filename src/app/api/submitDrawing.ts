import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import axios from "axios";

const mongoConnectionString =
  process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017";

const submitDrawing = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Extract the drawing and comment data from the request body
    const { drawing, comment, contactInfo } = req.body;

    // Connect to the MongoDB database
    const client = await MongoClient.connect(mongoConnectionString);
    const db = client.db("mainlinegreenway");
    const drawingsCollection = db.collection("drawings");

    // Insert the drawing and comment data into the database
    await drawingsCollection.insertOne({
      drawing,
      comment,
      contactInfo,
      createdAt: new Date(),
    });

    // Send a Slack notification
    // const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    // await axios.post(slackWebhookUrl!, {
    //   text: `New drawing submitted: ${comment}`,
    // });

    // Close the database connection and respond to the API request
    client.close();
    res.status(200).json({ message: "Drawing submitted successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default submitDrawing;