const { MONGODB_URI, dbName } = require("../../env");
const { MongoClient } = require("mongodb");

const uri = MONGODB_URI;
const collectionName = "resources";

const consolidateInstitutionNames = async (searchWord, replacementString) => {
  const client = new MongoClient(uri);

  try {
    // Connect to the database
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all documents with the `institution` field containing the search word
    const documents = await collection
      .find({
        institution: { $exists: true, $regex: searchWord, $options: "i" }
      })
      .toArray();

    console.log(`Found ${documents.length} documents to process.`);

    // Process and update each document
    for (const doc of documents) {
      const { _id, institution } = doc;

      // Replace the institution with the replacement string
      const updateResult = await collection.updateOne(
        { _id },
        { $set: { institution: replacementString } }
      );

      // Log the result
      console.log(`Document ID: ${_id}`);
      console.log(`Old Institution: ${institution}`);
      console.log(`Updated Institution: ${replacementString}`);
      console.log(
        `Update Result: Matched ${updateResult.matchedCount}, Modified ${updateResult.modifiedCount}`
      );
    }

    console.log("\nFinished processing and updating institutions.");
  } catch (error) {
    console.error("Error processing institutions:", error);
  } finally {
    // Close the database connection
    await client.close();
    console.log("Database connection closed");
  }
};

// Call the function with the search word and replacement string
consolidateInstitutionNames("Randolph", "Randolph Macon College");
consolidateInstitutionNames(
  "Florida Agricultural",
  "Florida Agricultural and Mechanical University"
);
consolidateInstitutionNames("of Maine", "University of Maine");
