"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        // required: true
    },
    lastName: {
        type: String,
        // required : true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        // required : true
    },
    dateOfBirth: {
        type: Date,
        // required : true
    },
    height: Number,
    weight: Number,
    city: {
        type: String,
        // required : true
    },
    state: {
        type: String,
        // required : true
    },
    aadhaarCardNumber: {
        type: Number,
        // required : false
    },
    password: {
        type: String,
        required: false
    },
    passwordChangedAt: {
        type: Date,
        required: false
    },
    otp: {
        type: Number,
        required: false
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        default: Object('63cc2464c60a8373837d3235'),
        required: false
    },
    createdOn: {
        type: Date,
        default: Date.now(),
        // required : true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    lastModifiedOn: {
        type: Date,
        // required : true
    },
    lastModifiedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        // required : true
    },
    uid: {
        type: String,
        // default: false,
        // required : true
    },
    jeevanKhataId: {
        type: String,
        // required : true
    },
    address: {
        type: String,
        // required : true
    },
});
//check password
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
    });
};
//check if password has changed after issuing the token 
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(String(this.passwordChangedAt.getTime() / 1000), 10);
        return jwtTimeStamp < changedTimeStamp;
    }
    return false;
};
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        this.lastModifiedOn = Date.now();
        this.uid = (0, uuid_1.v4)();
        return next();
    }
    ;
    this.lastModifiedOn = Date.now();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
//Hashing user password  
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.passwordConfirm = undefined;
        next();
    });
});
//Adding the jk id before saving
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.jeevanKhataId || this.isNew) {
            const count = yield user.countDocuments();
            const userId = "JK" + (count + 1).toString().padStart(8, "0");
            this.jeevanKhataId = userId;
            next();
        }
        next();
    });
});
//Updating the createdBy field   
// userSchema.pre('save', async function( next){
//     if(!this.createdBy){
//         this.createdBy = this._id;
//     }
//     if(!this.lastModifiedBy){
//       this.lastModifiedBy = this._id;
//     }
//     (this as any).lastModifiedOn = Date.now();
//     next();  
//   });
// userSchema.post('save', async function(doc, next){
//     if(!doc.createdBy){
//         doc.createdBy = doc._id;
//     }
//     if(!doc.lastModifiedBy){
//         doc.lastModifiedBy = doc._id;
//     }
//     doc.lastModifiedOn = Date.now();
//     // doc.save()
//     // .then(() => )
//     // .catch(err => next(err));
//     next();
// });
const user = mongoose_1.default.model("User", userSchema);
exports.default = user;
// TODO : role not updating in role, modifiedby createdby not updating,
// length for unit and biomarker, infinity loop in post middleware
