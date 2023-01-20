const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true
    },
    mobile:{
        type: String,
        required : true
    },
    gender:{
        type: String,
        required : true
    },
    dateOfBirth:{
        type: Date,
        required : true
    },
    city:{
        type: String,
        required : true
    },
    state:{
        type: String,
        required : true
    },
    aadhaarCardNumber:{
        type: Number,
        required : false
    },
    password:{
        type: String,
        required : false
    },
    passwordChangedOn:{
        type: Date,
        required : false
    },
    otp:{
        type: Number,
        required : false
    },
    role:{
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required : false
    },
    createdOn:{
        type: Date,
        default: Date.now(),
        required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : false
    },
    lastModifiedOn:{
        type: Date,
        required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : false
    },
    isDeleted:{
        type: Boolean,
        default: false,
        required : true
    },
    uid:{
        type: Boolean,
        default: false,
        required : true
    },
    jeevanKhataId:{
        type: String,
        required : true
    },
})

const user = mongoose.model("User", userSchema);
module.exports = user;
