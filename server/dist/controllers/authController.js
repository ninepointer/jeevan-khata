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
exports.getUserDetailAfterRefresh = exports.protect = exports.logout = exports.signup = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const customError_1 = require("../errors/customError");
const authUtil_1 = require("../utils/authUtil");
;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email)
        return next((0, customError_1.createCustomError)('Username or email needed', 401));
    if (!password)
        return next((0, customError_1.createCustomError)('Password is needed', 401));
    const user = yield User_1.default.findOne({
        email: email
    });
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next((0, customError_1.createCustomError)('Incorrect email or username or password', 401));
    }
    const token = (0, authUtil_1.signToken)(String(user._id));
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
        // httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        token,
        data: user,
    });
});
exports.login = login;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, passwordConfirm, mobile } = req.body;
    if (password !== passwordConfirm)
        return next((0, customError_1.createCustomError)("Passwords don't match", 401));
    const newUser = yield User_1.default.create({
        email,
        password,
        passwordConfirm,
        mobile,
    });
    const token = (0, authUtil_1.signToken)(String(newUser._id));
    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});
exports.signup = signup;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("jwt", { path: "/" });
    res
        .status(200)
        .json({ success: true, message: "User logged out successfully" });
});
exports.logout = logout;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    //   if (
    //     req.headers.authorization &&
    //     req.headers.authorization.startsWith('Bearer')
    //   ) {
    //     token = req.headers.authorization.split(' ')[1];
    //   }
    //console.log((req ))
    if (req.cookies) {
        token = req.cookies.jwt;
    }
    console.log(token);
    if (!token)
        return next((0, customError_1.createCustomError)('You are not logged in. Please log in to continue.', 401));
    const decoded = yield (0, authUtil_1.promisifiedVerify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    const freshUser = yield User_1.default.findById(decoded._id);
    if (!freshUser) {
        return next((0, customError_1.createCustomError)('User no longer exixts.', 401));
    }
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next((0, customError_1.createCustomError)('Password was changed. Log in again.', 401));
    }
    req.user = freshUser;
    next();
});
exports.protect = protect;
const getUserDetailAfterRefresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req is", req);
    // let user = req.user;
    res.status(200).json({
        status: 'success',
        data: req.user,
    });
    // res.json(req);
});
exports.getUserDetailAfterRefresh = getUserDetailAfterRefresh;
