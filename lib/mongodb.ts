import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Defina a variável de ambiente MONGODB_URI");
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    // Se a URI não tiver um nome de banco (ex: ...mongodb.net/?retryWrites=...),
    // o driver usa "test" por padrão. Aqui garantimos um dbName consistente.
    const uriHasDbName = /mongodb(?:\+srv)?:\/\/[^/]+\/[^?]+/.test(MONGODB_URI);

    const options: ConnectOptions = uriHasDbName
      ? {}
      : { dbName: process.env.MONGODB_DB_NAME || "estoque-celma" };

    cached!.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongooseInstance) => mongooseInstance);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

