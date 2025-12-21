import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const uri = process.env.MONGODB_URI ?? process.env.MONGODB_URL;
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Example:\nMONGODB_URI=mongodb+srv://<user>:<pwd>@cluster.mongodb.net/FitnessApp"
    );
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  // Select FitnessApp database
  cachedDb = cachedClient.db("FitnessApp");
  return cachedDb;
}
