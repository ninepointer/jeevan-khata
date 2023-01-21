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
exports.getUsers = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
exports.createUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender, email, password, passwordConfirm, mobile, city, state } = req.body;
    if (!(email || password || mobile || firstName || lastName || gender))
        return next((0, customError_1.createCustomError)('Eneter all mandatory fields.', 401));
    if (yield User_1.default.find({ email }))
        return next((0, customError_1.createCustomError)('User with this email already exists. Please login with existing email.', 401));
    const user = yield User_1.default.create({ firstName, lastName, gender, email, password, passwordConfirm, mobile, city, state });
    if (!user)
        return next((0, customError_1.createCustomError)('Couldn\'t create user', 400));
    res.status(201).json({ status: "Success", data: user });
}));
exports.getUsers = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find();
    if (!users)
        return next((0, customError_1.createCustomError)('No users found.', 404));
    res.status(200).json({ status: "Success", data: users, results: users.length });
}));
