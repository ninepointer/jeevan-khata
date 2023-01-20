const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    roleName:{
        type: String,
        required: true
    },
    reportAccess:{
        type: Boolean,
        default: false,
        required: true
    },
    userAccess:{
        type: Boolean,
        default: false,
        required: true
    },
    attributesAccess:{
        type: Boolean,
        default: false,
        required: true
    },
    analyticsAccess:{
        type: Boolean,
        default: false,
        required: true
    },
    createdOn:{
        type: Date,
        default: Date.now(),
        required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    lastModifiedOn:{
        type: Date,
        required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    isDeleted:{
        type: Boolean,
        default: false,
        required : true
    },
    status:{
        type: String,
        default: 'Active',
        required : true
    },
})

const role = mongoose.model("Role", roleSchema);
module.exports = role;
