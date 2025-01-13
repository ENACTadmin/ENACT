const { MONGODB_URI, dbName } = require("../../env");
const { MongoClient } = require("mongodb");

const uri = MONGODB_URI;
const collectionName = "deleteme";

const extractAuthors = (description) => {
  if (!description) return [];

  // Regex to match names after "written by" or "by"
  const byRegex = /(?:written by|by)\s+([^…]+)/i;
  const match = description.match(byRegex);

  if (match && match[1]) {
    // Truncate after any of these keywords (on, regarding, includes)
    let authorsString = match[1].split(
      /\b(?:on|regarding|includes|for| An | about | at)\b/i
    )[0];

    // Extract and clean names
    return authorsString
      .split(/,\s*|and\s+/) // split by commas or "and"
      .map((name) => name.replace(/\s'\d{2}/g, "").trim()) // remove years like '24, '25
      .filter((name) => name.length > 0);
  }

  return [];
};

(async () => {
  const client = new MongoClient(uri);

  try {
    // Connect to the database
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all documents with a description
    const documents = await collection
      .find({ description: { $exists: true } })
      .toArray();

    // Process and update each document
    for (const doc of documents) {
      const { _id, description } = doc;

      // Extract only the authors
      const authors = extractAuthors(description);

      // Add the new `author` key to the document
      const updateResult = await collection.updateOne(
        { _id },
        { $set: { author: authors } }
      );

      // Print the result
      console.log(`Document ID: ${_id}`);
      console.log(
        `Authors: ${
          authors.length > 0 ? authors.join(", ") : "No authors found"
        }`
      );
      console.log(
        `Update Result: Matched ${updateResult.matchedCount}, Modified ${updateResult.modifiedCount}`
      );
    }

    console.log("\nFinished processing and updating documents.");
  } catch (error) {
    console.error(
      "Error connecting to the database or processing documents:",
      error
    );
  } finally {
    // Close the database connection
    await client.close();
    console.log("Database connection closed");
  }
})();
