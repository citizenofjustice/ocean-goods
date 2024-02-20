import { db } from "@vercel/postgres";
import { Pool, QueryConfig, QueryResult } from "pg";

// Creating a new pool with the database configuration
const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "ocean_goods_db",
});

// Creating a new pool with the database configuration
export const dbQuery = async (
  queryStream: QueryConfig
): Promise<QueryResult> => {
  try {
    let res: QueryResult;
    // Exporting an async function dbQuery
    if (process.env.IS_DB_LOCAL === "true") {
      res = await pool.query(queryStream);
    } else {
      // If the database is not local, use db to query
      res = await db.query(queryStream);
    }
    // Return the result of the query
    return res;
  } catch (err) {
    // If there is an error, log it and throw it
    console.error(err);
    throw err;
  }
};

export default pool;
