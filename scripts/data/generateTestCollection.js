const { MONGODB_URI, dbName } = require("../../env");
const { MongoClient } = require("mongodb");
const uri = MONGODB_URI;
const sourceCollectionName = "resources";
const targetCollectionName = "resources_copy";

(async () => {
  const client = new MongoClient(uri);

  try {
    // Connect to the database
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const sourceCollection = db.collection(sourceCollectionName);

    // Copy the collection using the $out stage
    const pipeline = [
      {
        $match: {} // Optionally add filters if you want to copy specific documents
      },
      {
        $out: targetCollectionName // Specify the target collection name
      }
    ];

    await sourceCollection.aggregate(pipeline).toArray(); // Execute the aggregation

    console.log(
      `Collection '${sourceCollectionName}' copied to '${targetCollectionName}'`
    );
  } catch (error) {
    console.error("Error copying the collection:", error);
  } finally {
    // Close the database connection
    await client.close();
    console.log("Database connection closed");
  }
})();
