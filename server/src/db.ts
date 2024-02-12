import { Pool, QueryConfig, QueryResult } from "pg";
import { db } from "@vercel/postgres";

const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "ocean_goods_db",
});

export const dbQuery = async (
  queryStream: QueryConfig,
  values: any[] = []
): Promise<QueryResult> => {
  try {
    let res: QueryResult;
    if (process.env.IS_DB_LOCAL === "true") {
      res = await pool.query(queryStream, values);
    } else {
      res = await db.query(queryStream, values);
    }
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default pool;
