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
const privelegesCamelCase = `id as "privelegeId", title`;
class PrivelegesController {
    createPrivelege(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getPriveleges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const priveleges = yield (0, db_1.dbQuery)({
                text: `SELECT ${privelegesCamelCase} FROM priveleges ORDER BY title`,
            });
            res.json(priveleges.rows);
        });
    }
    getOnePrivelege(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updatePrivelege(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    deletePrivelege(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = new PrivelegesController();
