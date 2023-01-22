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
exports.getRoles = exports.createRole = void 0;
const Role_1 = __importDefault(require("../models/Role"));
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
exports.createRole = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { roleName, reportAccess, attributeAccess, userAccess, analyticsAccess } = req.body;
    const newRole = yield Role_1.default.create({
        roleName: roleName,
        reportAccess: reportAccess,
        attributesAccess: attributeAccess,
        userAccess: userAccess,
        analyticsAccess: analyticsAccess,
        createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        // createdBy: '63cb5c3cfa001ccb514d010b',
        createdOn: Date.now(),
        lastModifiedBy: req.user._id,
        // lastModifiedBy: '63cb5c3cfa001ccb514d010b',
        lastModifiedOn: Date.now(),
    });
    res.status(201).json({ status: 'Success', message: 'Role created', data: newRole });
}));
exports.getRoles = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield Role_1.default.find();
    if (!roles)
        return next((0, customError_1.createCustomError)('Can\'t get roles', 404));
    res.status(200).json({ status: 'Success', data: roles, results: roles.length });
}));
