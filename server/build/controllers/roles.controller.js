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
                // Inserts the new role into the database and returns the created role
                const newRole = yield (0, db_1.dbQuery)({
                    text: `INSERT INTO roles (title, privelege_ids) VALUES ($1, $2) RETURNING *`,
                    values: [title, priveleges],
                });
                res.status(201).json(newRole.rows[0]); // Return the created role with a 201 status code
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
                const roles = yield (0, db_1.dbQuery)({
                    text: `
        SELECT r.id as "roleId", r.title, json_agg(json_build_object(
          'privelegeId', pr.id,
          'title', pr.title
        )) as priveleges
        FROM roles r
        RIGHT JOIN priveleges pr
        ON pr.id = ANY(r.privelege_ids)
        WHERE r.id IS NOT NULL
        GROUP BY r.id
      `,
                });
                res.status(200).json(roles.rows); // Return the roles
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
                const selectValues = yield (0, db_1.dbQuery)({
                    text: `SELECT id, title as "optionValue" FROM roles ORDER BY title ASC`,
                });
                res.status(200).json(selectValues.rows);
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
                // 'privelegeIds' & 'roleId' should be a JSON string of an array of privilege IDs
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
                const foundRole = yield (0, db_1.dbQuery)({
                    text: "SELECT id FROM roles WHERE id = $1",
                    values: [roleIdValue],
                });
                if (!foundRole.rows[0])
                    // If the role is not found, return a 404 error with a message
                    return res.status(404).json({
                        error: {
                            message: "Изменение не возможно. Запись не найдена в базе данных",
                        },
                    });
                // Update the role in the database and return the updated role
                yield (0, db_1.dbQuery)({
                    text: `UPDATE roles SET title = $1, privelege_ids = $2 WHERE id = $3 RETURNING *`,
                    values: [title, priveleges, roleIdValue],
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
                const { id } = req.params;
                // Query the database to find the role with the given ID
                const foundRole = yield (0, db_1.dbQuery)({
                    text: `SELECT id FROM roles WHERE id = $1`,
                    values: [id],
                });
                if (!foundRole.rows[0])
                    // If the role is not found, return a 404 error with a message
                    return res.status(404).json({
                        error: {
                            message: "Удаление не возможно. Запись не найдена в базе данных",
                        },
                    });
                yield (0, db_1.dbQuery)({
                    text: `DELETE FROM roles WHERE id = $1`,
                    values: [id],
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
