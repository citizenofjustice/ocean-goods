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
exports.verifyRole = void 0;
const db_1 = require("../db");
// Exporting an async function verifyRole
const verifyRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // If there is no role in the request, return a 401 status
    if (!(req === null || req === void 0 ? void 0 : req.role))
        return res.sendStatus(401);
    // Query the database for the role with the id from the request
    const foundRole = yield db_1.prisma.roles.findUnique({
        where: {
            roleId: req.role,
        },
    });
    if (!foundRole)
        return res.sendStatus(401); // If there is no role found, return a 401 status
    next(); // Call the next middleware
});
exports.verifyRole = verifyRole;
