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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRole = void 0;
const Role_1 = __importDefault(require("../models/Role"));
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
exports.createRole = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleName } = req.body;
    const newRole = yield Role_1.default.create({
        roleName: roleName,
        // createdBy: (req as any).user?._id,
        createdBy: '63cb5c3cfa001ccb514d010b',
        createdOn: Date.now(),
        // lastModifiedBy: (req as any).user._id,
        lastModifiedBy: '63cb5c3cfa001ccb514d010b',
        lastModifiedOn: Date.now(),
    });
    res.status(201).json({ status: 'Success', message: 'Role created', data: newRole });
}));
