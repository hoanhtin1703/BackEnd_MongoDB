// set up server
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://anhtin:anh01263654142@testdb.z8jm8mj.mongodb.net/?retryWrites=true&w=majority";
const databaseName = "mongodbVSCodePlaygroundDB";

// Use async function to handle asynchronous operations
async function connectToDatabase() {
  try {
    // Create a MongoClient with Stable API version
    const client = new MongoClient(uri, {
      serverApi: {
        version: "1", // Use a string instead of ServerApiVersion.v1
        strict: true,
        deprecationErrors: true,
      },
    });
    // Connect to the MongoDB server
    await client.connect();
    // Access the specified database and collection
    const database = client.db(databaseName);

    return database;
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}
module.exports = connectToDatabase;
