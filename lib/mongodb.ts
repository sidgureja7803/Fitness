import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const uri =
    process.env.MONGODB_URI || process.env.MONGODB_URL;

  if (!uri) {
    throw new Error(
      "Missing MongoDB connection string. Set MONGODB_URI in environment variables."
    );
  }

  const dbName = process.env.MONGODB_DB_NAME || "fitness_app";

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}
