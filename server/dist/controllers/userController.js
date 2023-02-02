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
exports.deleteUser = exports.editUser = exports.getUsers = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
exports.createUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, address } = req.body;
    console.log("User :", req.user);
    //Check for required fields 
    if (!(email || password || mobile || firstName || lastName || dateOfBirth || gender))
        return next((0, customError_1.createCustomError)('Enter all mandatory fields.', 401));
    //Check if user exists
    if (yield User_1.default.findOne({ isDeleted: false, email }))
        return next((0, customError_1.createCustomError)('User with this email already exists. Please login with existing email.', 401));
    const user = yield User_1.default.create({ firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, address });
    if (!user)
        return next((0, customError_1.createCustomError)('Couldn\'t create user', 400));
    res.status(201).json({ status: "Success", data: user });
}));
exports.getUsers = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find({ isDeleted: false })
        .populate({ path: "role", select: "roleName" });
    if (!users)
        return next((0, customError_1.createCustomError)('No users found.', 404));
    res.status(200).json({ status: "Success", data: users, results: users.length });
}));
exports.editUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, role, address } = req.body;
    const { id } = req.params;
    console.log("User :", req.user);
    //Finding user
    const userData = yield User_1.default.findOne({ _id: id });
    console.log("user", userData);
    if (password) {
        userData.firstName = firstName;
        userData.lastName = lastName,
            userData.gender = gender,
            userData.dateOfBirth = dateOfBirth,
            userData.email = email,
            userData.password = password,
            userData.mobile = mobile,
            userData.city = city,
            userData.state = state,
            userData.role = role,
            userData.address = address;
    }
    else {
        userData.firstName = firstName;
        userData.lastName = lastName,
            userData.gender = gender,
            userData.dateOfBirth = dateOfBirth,
            userData.email = email,
            userData.mobile = mobile,
            userData.city = city,
            userData.state = state,
            userData.address = address,
            userData.role = role;
    }
    yield userData.save();
    res.status(201).json({ status: "Success", data: userData });
}));
exports.deleteUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };
    try {
        const userDetail = yield User_1.default.updateOne(filter, update);
        console.log("this is userdetail", userDetail);
        res.status(201).json({ massage: "data delete succesfully" });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to delete data" });
    }
}));
