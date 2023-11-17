import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") }); // duita path join kora hoise
// dotenv.config(//file path )

// we got everything from .env by config the file
export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
};
