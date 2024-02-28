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
// Function to get order by ID
function getOrderById(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query the database for the order (join with product types)
            const orderData = yield db_1.prisma.order.findUnique({
                where: {
                    orderId: orderId,
                },
                include: {
                    orderItems: {
                        include: {
                            catalogItem: {
                                include: {
                                    productTypes: true,
                                },
                            },
                        },
                    },
                },
            });
            // Check if the order exists
            if (!orderData)
                throw new Error("Заказа с таким номером не существует");
            // Return the order
            return orderData;
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
    // Method to create a new order
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Destructure the request body
                const { customerName, customerPhone, customerEmail, contactMethod, orderItems, } = req.body;
                const parsedOrderItems = JSON.parse(orderItems);
                const opderProducts = yield db_1.prisma.catalog.findMany({
                    where: {
                        productId: {
                            in: parsedOrderItems.map((item) => item.productId),
                        },
                    },
                });
                const itemsWithAmount = opderProducts.map((item) => {
                    const orderItem = parsedOrderItems.find((orderItem) => orderItem.productId === item.productId);
                    return Object.assign(Object.assign({}, item), { amount: orderItem ? orderItem.amount : 0 });
                });
                let totalPrice = 0;
                for (const item of itemsWithAmount) {
                    const finalPrice = item.price - Math.round(item.price * (item.discount / 100));
                    totalPrice += item.amount * finalPrice;
                }
                // Check if order details is empty
                if (parsedOrderItems.length === 0)
                    return res.status(422).json({
                        error: "Не удалось создать заказ. В заказе отсутствуют продукты.",
                    });
                // Prepare the Prisma query
                const newOrder = yield db_1.prisma.order.create({
                    data: {
                        customerName: customerName,
                        customerPhone: customerPhone,
                        customerEmail: customerEmail,
                        contactMethod: contactMethod,
                        totalPrice: totalPrice,
                        orderItems: {
                            create: parsedOrderItems.map((item) => {
                                const snapshot = opderProducts.find((catalogItem) => catalogItem.productId === item.productId);
                                return {
                                    productId: item.productId,
                                    amount: item.amount,
                                    itemSnapshot: snapshot,
                                };
                            }),
                        },
                    },
                });
                const orderMessageContent = Object.assign(Object.assign({}, newOrder), { totalPrice });
                // Pass new order to a telegram bot message
                yield (0, orderMessage_1.handleOrderMessage)(index_1.ordersBot.bot, orderMessageContent);
                // Send the response status
                res.sendStatus(201);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // Method to get all orders
    getOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Destructure the query parameters from the request
                const { startDate, endDate, filterType, filter, orderBy, direction, page = 1, limit = 10, } = req.query;
                // Convert page and limit to numbers
                const pageNum = Number(page);
                const limitNum = Number(limit);
                // Check if page and limit are numbers
                if (isNaN(pageNum) || isNaN(limitNum)) {
                    return res.status(400).json({
                        error: {
                            message: "Возникла ошибка с параметрами загрузки страницы",
                        },
                    });
                }
                // Check if page and limit are natural numbers
                if (!Number.isInteger(pageNum) || pageNum <= 0) {
                    return res.status(400).json({
                        error: {
                            message: "Номер страницы не должен быть отрицательным",
                        },
                    });
                }
                if (!Number.isInteger(limitNum) || limitNum <= 0) {
                    return res.status(400).json({
                        error: {
                            message: "Параметр кол-ва элементов на странице не должен быть отрицательным",
                        },
                    });
                }
                // Calculate the offset for pagination
                const skip = (pageNum - 1) * limitNum;
                // Define the query parameters
                let queryParameters = {
                    take: limitNum,
                    skip: skip,
                    include: {
                        orderItems: true,
                    },
                };
                const startDateStr = startDate === null || startDate === void 0 ? void 0 : startDate.toString();
                const endDateStr = endDate === null || endDate === void 0 ? void 0 : endDate.toString();
                if (startDateStr && endDateStr) {
                    queryParameters.where = Object.assign(Object.assign({}, queryParameters.where), { createdAt: {
                            gte: new Date(startDateStr),
                            lte: new Date(endDateStr),
                        } });
                }
                // Check if orderBy and direction are valid
                const sortByValid = orderBy === "createdAt" ||
                    orderBy === "totalPrice" ||
                    orderBy === "customerName";
                const filterTypeIsValid = filterType === "orderId" || filterType === "customerName";
                const directionValid = direction === "asc" || direction === "desc";
                // Set the orderBy parameter based on the provided orderBy value
                if (sortByValid && directionValid) {
                    switch (orderBy) {
                        case "createdAt":
                            queryParameters.orderBy = {
                                createdAt: direction,
                            };
                            break;
                        case "customerName":
                            queryParameters.orderBy = {
                                customerName: direction,
                            };
                            break;
                        case "totalPrice":
                            queryParameters.orderBy = {
                                totalPrice: direction,
                            };
                            break;
                        default:
                            break;
                    }
                }
                if (filterTypeIsValid && filter) {
                    switch (filterType) {
                        case "orderId":
                            queryParameters.where = Object.assign(Object.assign({}, queryParameters.where), { orderId: Number(filter) });
                            break;
                        case "customerName":
                            queryParameters.where = Object.assign(Object.assign({}, queryParameters.where), { customerName: {
                                    contains: filter.toString(),
                                    mode: "insensitive",
                                } });
                            break;
                        default:
                            break;
                    }
                }
                // Query the database for items in the order
                const orders = yield db_1.prisma.order.findMany(queryParameters);
                // Count the total rows
                const totalRows = yield db_1.prisma.order.count();
                // Calculate the cursor for the next page
                const nextPage = totalRows > pageNum * limitNum ? pageNum + 1 : null;
                // Send the catalog items as the response
                res.status(200).json({ totalRows, orders, nextPage });
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // Method to get a single order by ID
    getOneOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Check if id is a number
                if (isNaN(Number(id)))
                    res
                        .status(400)
                        .json({ error: { message: "Не верный идентификатор заказа" } });
                // Get the order
                const foundOrder = yield getOrderById(Number(id));
                // Check if the order exists
                if (!foundOrder)
                    return res
                        .status(404)
                        .json({ error: { message: "Заказа с таким номером не существует" } });
                // Send the order as the response
                res.status(200).json(foundOrder);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // This function is not implemented yet
    updateOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.sendStatus(501);
        });
    }
    // This function is not implemented yet
    deleteOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.sendStatus(501);
        });
    }
}
exports.default = new OrderController();
