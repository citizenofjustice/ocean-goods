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
class PrivelegesController {
    // This function is not implemented yet
    createPrivelege(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.sendStatus(501);
        });
    }
    // Method to get all priveleges
    getPriveleges(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const priveleges = yield db_1.prisma.priveleges.findMany({
                    orderBy: {
                        title: "asc",
                    },
                });
                res.status(200).json(priveleges);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // This function is not implemented yet
    getOnePrivelege(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.sendStatus(501);
        });
    }
    // This function is not implemented yet
    updatePrivelege(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.sendStatus(501);
        });
    }
    // This function is not implemented yet
    deletePrivelege(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.sendStatus(501);
        });
    }
}
exports.default = new PrivelegesController();
