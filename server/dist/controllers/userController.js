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
exports.createFamilyMember = exports.deleteMe = exports.editMe = exports.getUser = exports.deleteUser = exports.editUser = exports.getUsers = exports.createUser = exports.uploadToS3 = exports.resizePhoto = exports.uploadMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const User_1 = __importDefault(require("../models/User"));
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
const userHelper_1 = require("../helpers/userHelper");
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el) &&
            (obj[el] !== null &&
                obj[el] !== undefined &&
                obj[el] !== '')) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type"), false);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter }).single("profilePhoto");
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
exports.uploadMulter = upload;
const resizePhoto = (req, res, next) => {
    if (!req.file) {
        // no file uploaded, skip to next middleware
        console.log('no file');
        next();
        return;
    }
    (0, sharp_1.default)(req.file.buffer).resize({ width: 300, height: 300 }).toBuffer()
        .then((resizedImageBuffer) => {
        req.file.buffer = resizedImageBuffer;
        next();
    })
        .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Error resizing photo" });
    });
};
exports.resizePhoto = resizePhoto;
const uploadToS3 = (req, res, next) => {
    if (!req.file) {
        // no file uploaded, skip to next middleware
        next();
        return;
    }
    // create S3 upload parameters
    const key = `users/${req.user.firstName + req.user.lastName + req.user.jeevanKhataId}/photos/profilePhotos/${(Date.now()) + req.file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
    };
    // upload image to S3 bucket
    s3.upload(params).promise()
        .then((s3Data) => {
        console.log('file uploaded');
        req.profilePhotoUrl = s3Data.Location;
        next();
    })
        .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Error uploading photo to S3" });
    });
};
exports.uploadToS3 = uploadToS3;
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
exports.getUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    const user = yield User_1.default.findOne({ _id: id, isDeleted: false }).select('-__v -password')
        .populate({ path: "role", select: "roleName" });
    if (!user)
        return next((0, customError_1.createCustomError)('No such user found.', 404));
    res.status(200).json({ status: "Success", data: user });
}));
exports.editMe = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    const { firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, address } = req.body;
    const user = yield User_1.default.findOne({ _id: id, isDeleted: false }).select('-__v -password -role');
    if (!user)
        return next((0, customError_1.createCustomError)('No such user found.', 404));
    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email', 'mobile', 'profilePhoto', 'city', 'state', 'dateOfBirth', 'lastModifiedBy', 'address', 'gender');
    filteredBody.lastModifiedBy = id;
    if (req.file)
        filteredBody.profilePhoto = req.profilePhotoUrl;
    if (!user.isOnBoarded)
        filteredBody.isOnBoarded = true;
    const updatedUser = yield User_1.default.findByIdAndUpdate(id, filteredBody, {
        new: true,
        runValidators: true
    }).select('-__v -password -role');
    res.status(200).json({ status: "Success", data: updatedUser });
}));
exports.deleteMe = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };
    try {
        const userDetail = yield User_1.default.updateOne(filter, update);
        console.log("this is userdetail", userDetail);
        res.status(201).json({ message: "data deleted succesfully" });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to delete data" });
    }
}));
exports.createFamilyMember = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile, relation } = req.body;
    // console.log("User :",(req as any).user)
    let loggedInUser = req.user;
    //Check for required fields 
    if (!(mobile))
        return next((0, customError_1.createCustomError)('Mobile Number is required.', 401));
    let familyMember = {};
    //Check if user exists
    const existingUser = yield User_1.default.findOne({ isDeleted: false, mobile });
    if (existingUser) {
        let existingUserId = existingUser._id;
        familyMember = { relation, profile: existingUserId };
        let { reciprocalRelation, reciprocalGender } = (0, userHelper_1.getReciprocalRelation)(relation, loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.gender);
        let reciprocalFamilymember = { reciprocalRelation, profile: loggedInUser._id };
        loggedInUser.familyTree = [...loggedInUser.familyTree, familyMember];
        existingUser.familyTree = [...existingUser.familyTree, reciprocalFamilymember];
        yield loggedInUser.save({ validateBeforeSave: false });
        yield existingUser.save({ validateBeforeSave: false });
        return res.status(200).json({ status: 'success', message: 'Added family Member successfully', data: loggedInUser });
    }
    const newUser = yield User_1.default.create({ mobile });
    if (!newUser)
        return next((0, customError_1.createCustomError)('Couldn\'t create user', 400));
    familyMember = { relation, profile: newUser._id };
    let { reciprocalRelation, reciprocalGender } = (0, userHelper_1.getReciprocalRelation)(relation, loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.gender);
    let reciprocalFamilymember = { reciprocalRelation, profile: loggedInUser._id };
    loggedInUser.familyTree = [...loggedInUser.familyTree, familyMember];
    newUser.familyTree = [...newUser.familyTree, reciprocalFamilymember];
    newUser.gender = reciprocalGender;
    yield newUser.save();
    yield loggedInUser.save();
    res.status(200).json({ status: "success", message: 'Added family Member successfully', data: loggedInUser });
}));
