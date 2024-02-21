"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbQuery = exports.prisma = void 0;
const postgres_1 = require("@vercel/postgres");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
exports.prisma = new client_1.PrismaClient();
// Creating a new pool with the database configuration
const pool = new pg_1.Pool({
    user: "postgres",
    password: "root",
    host: "localhost",
    port: 5432,
    database: "ocean_goods_db",
});
// Creating a new pool with the database configuration
const dbQuery = (queryStream) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res;
        // Exporting an async function dbQuery
        if (process.env.IS_DB_LOCAL === "true") {
            res = yield pool.query(queryStream);
        }
        else {
            // If the database is not local, use db to query
            res = yield postgres_1.db.query(queryStream);
        }
        // Return the result of the query
        return res;
    }
    catch (err) {
        // If there is an error, log it and throw it
        console.error(err);
        throw err;
    }
});
exports.dbQuery = dbQuery;
exports.default = pool;
