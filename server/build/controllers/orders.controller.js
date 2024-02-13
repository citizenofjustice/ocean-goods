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
exports.getOrderById = void 0;
const db_1 = require("../db");
const index_1 = require("../index");
const orderMessage_1 = require("../bot/commands/orderMessage");
const orderCamelCase = 'id as "orderId", order_details as "orderDetails", customer_name as "customerName", customer_phone as "customerPhone", customer_email as "customerEmail", contact_method as "contactMethod", created_at as "createdAt"';
// Function to get order by ID
function getOrderById(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query the database for the order (join with product types)
            const orderData = yield (0, db_1.dbQuery)({
                text: `SELECT 
        orders.id as "orderId", orders.customer_name as "customerName", orders.customer_phone as "customerPhone",
        orders.customer_email as "customerEmail", orders.contact_method as "contactMethod", orders.created_at as "createdAt",
        json_build_object(
          'orderItems', json_agg(
            jsonb_set(
              elems::jsonb, 
              '{type}', 
              to_jsonb(product_types.type)
            )
          ),
          'totalPrice', orders.order_details->'totalPrice'
        ) AS "orderDetails"
      FROM 
        orders
      JOIN 
        jsonb_array_elements(orders.order_details->'orderItems') AS elems ON TRUE
      JOIN 
        product_types ON product_types.id = (elems->'productTypeId')::text::integer
      WHERE orders.id = $1
      GROUP BY 
        orders.id`,
                values: [orderId],
            });
            // Extract the order from the query result
            const foundOrder = orderData.rows[0];
            // Return the order
            return foundOrder;
        }
        catch (error) {
            // Log the error and rethrow it
            console.error(error);
            throw error;
        }
    });
}
exports.getOrderById = getOrderById;
class OrderController {
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Destructure the request body
                const { orderDetails, customerName, customerPhone, customerEmail, contactMethod, } = req.body;
                if (JSON.parse(orderDetails).orderItems.length === 0)
                    return res.status(422).json({ error: "Order details is empty" });
                // Prepare the SQL query
                const sqlQuery = `
        INSERT INTO orders (order_details, customer_name, customer_phone, customer_email, contact_method)
        VALUES ($1, $2, $3, $4, $5) RETURNING ${orderCamelCase}
      `;
                // Execute the query and get the result
                const createOrderQuery = yield (0, db_1.dbQuery)({
                    text: sqlQuery,
                    values: [
                        orderDetails,
                        customerName,
                        customerPhone,
                        customerEmail,
                        contactMethod,
                    ],
                });
                // Extract the new order from the result
                const newOrder = createOrderQuery.rows[0];
                // Pass new order to a telegram bot message
                yield (0, orderMessage_1.handleOrderMessage)(index_1.ordersBot.bot, newOrder);
                // Send the response
                res.json(newOrder);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Destructure the query parameters from the request
                const { startDate, endDate, filterType, filter, orderBy, direction, page = 1, limit = 10, } = req.query;
                // Initialize an array to hold our WHERE clauses
                let whereClauses = [];
                // If a filter and filterType are provided, add a WHERE clause for the filter
                if (filter && filterType) {
                    whereClauses.push(`${filterType}::text ILIKE '%${filter}%'`);
                }
                // If a startDate and endDate are provided, add a WHERE clause for the date range
                if (startDate && endDate) {
                    whereClauses.push(`created_at BETWEEN '${startDate}' AND '${endDate}'`);
                }
                // Initialize the WHERE string
                let where = "";
                // If there are any WHERE clauses, join them with " AND " and prepend with "WHERE "
                if (whereClauses.length > 0) {
                    where = `WHERE ${whereClauses.join(" AND ")}`;
                }
                // Default ORDER BY clause
                let orderByQuery = "ORDER BY created_at DESC";
                // If an orderBy and direction are provided, update the ORDER BY clause
                if (orderBy && direction) {
                    if (orderBy === "totalPrice") {
                        // If orderBy is "totalPrice", we need to cast it as an integer
                        orderByQuery = `ORDER BY cast(order_details->>'totalPrice' as integer) ${direction}`;
                    }
                    else {
                        // Otherwise, we can just use the provided orderBy field
                        orderByQuery = `ORDER BY ${orderBy} ${direction}`;
                    }
                }
                // Calculate the offset for pagination
                const offset = (Number(page) - 1) * Number(limit);
                // Construct the final query
                const query = `SELECT COUNT(*) OVER() as total, ${orderCamelCase} FROM orders ${where} ${orderByQuery} LIMIT ${limit} OFFSET ${offset}`;
                const ordersQuery = yield (0, db_1.dbQuery)({ text: query });
                // Extract the totalRows and orders from the result set
                const totalRows = ordersQuery.rows[0]
                    ? Number(ordersQuery.rows[0].total)
                    : 0;
                const orders = ordersQuery.rows.map((row) => {
                    delete row.total;
                    return row;
                });
                // Calculate the cursor for the next page
                const nextPage = Number(page) + 1;
                // Include the cursor for the next page in the response
                res.json({ totalRows, orders, nextPage });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOneOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Check if id is a number
                if (isNaN(Number(id)))
                    return res.status(400).json({ error: "Invalid order ID." });
                // Get the order
                const foundOrder = yield getOrderById(Number(id));
                // Check if the order exists
                if (!foundOrder)
                    return res.status(404).json({ error: "Order not found." });
                // Send the order as the response
                res.json(foundOrder);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    deleteOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = new OrderController();
