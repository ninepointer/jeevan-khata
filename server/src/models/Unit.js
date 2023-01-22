const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
    unitFullName:{
        type: String,
        required: true
    },
    unitId:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    uid:{
        type: String,
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
    unitConversion:{
        unitConversionFullName : { 
            type: String,
            required : true
        },
        unitConversionId : { 
            type: String,
            required : true
        },
        value : { 
            type: Number,
            required : true
        },
        id : { 
            type: String,
            required : true
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
    }
})

const unit = mongoose.model("Unit", unitSchema);
module.exports = unit;
