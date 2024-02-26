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
const db_1 = require("../db");
class RolesController {
    // This function creates a new role
    createRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, privelegeIds } = req.body;
                // 'privelegeIds' should be a JSON string of an array of privilege IDs
                let priveleges;
                // Try to parse privelegeIds. If it's not a valid JSON string, an error will be thrown
                try {
                    priveleges = JSON.parse(privelegeIds);
                }
                catch (error) {
                    // If 'privelegeIds' is not a valid JSON string, return a 400 error with a message
                    return res.status(400).json({
                        error: { message: "privelegeIds must be a valid JSON string" },
                    });
                }
                // If no privileges are provided, return a 400 error with a message
                if (priveleges.length === 0)
                    return res.status(400).json({
                        error: { message: "Привелегии не были указаны при создании роли" },
                    });
                // Create a new role with Prisma and return the created role
                const newRole = yield db_1.prisma.roles.create({
                    data: {
                        title: title,
                        privelegeIds: priveleges,
                    },
                });
                res.status(201).json(newRole); // Return the created role with a 201 status code
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // This function retrieves all roles along with their associated privileges
    getRoles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database to get all roles and their associated privileges
                const roles = yield db_1.prisma.roles.findMany({
                    select: {
                        roleId: true,
                        title: true,
                        privelegeIds: true,
                    },
                    orderBy: {
                        title: "asc",
                    },
                });
                res.status(200).json(roles); // Return the roles
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // This function retrieves all roles for select input values
    getRolesSelectValues(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selectValues = yield db_1.prisma.roles.findMany({
                    select: {
                        roleId: true,
                        title: true,
                    },
                    orderBy: {
                        title: "asc",
                    },
                });
                res.status(200).json(selectValues);
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // This function is not implemented yet
    getOneRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.sendStatus(501);
        });
    }
    // This function updates a role
    updateRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roleId, title, privelegeIds } = req.body;
                let priveleges;
                let roleIdValue;
                // Try to parse privelegeIds & roleId. If it's not a valid JSON string, an error will be thrown
                try {
                    priveleges = JSON.parse(privelegeIds);
                    roleIdValue = JSON.parse(roleId);
                }
                catch (error) {
                    return res.status(400).json({
                        error: { message: "Request payload has invalid data" },
                    });
                }
                // Query the database to find the role with the given ID
                const foundRole = yield db_1.prisma.roles.findUnique({
                    where: {
                        roleId: roleIdValue,
                    },
                });
                if (!foundRole) {
                    // If the role is not found, return a 404 error with a message
                    return res.status(404).json({
                        error: {
                            message: "Изменение не возможно. Запись не найдена в базе данных",
                        },
                    });
                }
                // Update the role in the database
                yield db_1.prisma.roles.update({
                    where: {
                        roleId: roleIdValue,
                    },
                    data: {
                        title: title,
                        privelegeIds: priveleges,
                    },
                });
                // Return a 204 status code (request has succeeded but returns no message body)
                res.sendStatus(204);
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // This function deletes a role
    deleteRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roleId = parseInt(req.params.id);
                // Query the database to find the role with the given ID
                const foundRole = yield db_1.prisma.roles.findUnique({
                    where: {
                        roleId: roleId,
                    },
                });
                if (!foundRole)
                    // If the role is not found, return a 404 error with a message
                    return res.status(404).json({
                        error: {
                            message: "Удаление не возможно. Запись не найдена в базе данных",
                        },
                    });
                yield db_1.prisma.roles.delete({
                    where: {
                        roleId: roleId,
                    },
                });
                // Return a 204 status code (request has succeeded but returns no message body)
                res.sendStatus(204);
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
}
exports.default = new RolesController();
