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
// const rolesCamelCase: string = `id as "roleId", title, privelege_ids as "privelegeIds"`;
class RolesController {
    createRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, privelegeIds } = req.body;
                const priveleges = JSON.parse(privelegeIds);
                if (priveleges.length === 0)
                    throw new Error("Privileges was not added");
                const newRole = yield (0, db_1.dbQuery)({
                    text: `INSERT INTO roles (title, privelege_ids) VALUES ($1, $2) RETURNING *`,
                    values: [title, priveleges],
                });
                res.status(201).json(newRole.rows[0]);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(409).json({ error: error.message });
                }
            }
        });
    }
    getRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            res.json(roles.rows);
        });
    }
    getRolesSelectValues(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectValues = yield (0, db_1.dbQuery)({
                text: `SELECT id, title as "optionValue" FROM roles ORDER BY title ASC`,
            });
            res.json(selectValues.rows);
        });
    }
    getOneRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { roleId, title, privelegeIds } = req.body;
            const updatedRole = yield (0, db_1.dbQuery)({
                text: `UPDATE roles SET title = $1, privelege_ids = $2 WHERE id = $3 RETURNING *`,
                values: [title, JSON.parse(privelegeIds), JSON.parse(roleId)],
            });
            res.json(updatedRole.rows[0]);
        });
    }
    deleteRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const role = yield (0, db_1.dbQuery)({
                text: `DELETE FROM roles WHERE id = $1`,
                values: [id],
            });
            res.json(role.rows[0]);
        });
    }
}
exports.default = new RolesController();
