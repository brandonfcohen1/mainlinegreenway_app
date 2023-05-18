import { NextApiRequest, NextApiResponse } from "next";
//import { MongoClient } from "mongodb";
import sgMail from "@sendgrid/mail";

// const mongoConnectionString =
//   process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017";

sgMail.setApiKey(process.env.MLG_SENDGRID || ""); // Set SendGrid API Key

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { drawing, comment, contactInfo } = req.body;

    // // Connect to the MongoDB database
    // const client = await MongoClient.connect(mongoConnectionString);
    // const db = client.db("mainlinegreenway");
    // const drawingsCollection = db.collection("drawings");

    // // Insert the drawing and comment data into the database
    // await drawingsCollection.insertOne({
    //   drawing,
    //   comment,
    //   contactInfo,
    //   createdAt: new Date(),
    // });

    // Send an email notification using SendGrid
    const msg = {
      to: "brandon.f.cohen@gmail.com",
      from: "mainlinegreenwayapp@gmail.com",
      subject: "New MLG comment",
      html: `New drawing submitted: ${comment}<br><br>Contact info: ${contactInfo}<br><br>Location: ${JSON.stringify(
        drawing.coordinates
      )}`,
    };

    await sgMail.send(msg);

    // Close the database connection and respond to the API request
    //client.close();
    res.status(200).json({ message: "Drawing submitted successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
