import mongoose, { Schema } from "mongoose";

const bioMarkerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    unit:{
        type: String,
        required : true
    },
    status:{
        type: String,
        required : true
    },
    uid:{
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
    isDeleted:{
        type: Boolean,
        default: false,
        required : true
    },
    bioMarkerTypes:{
        gender : { 
            type: String,
            required : false
        },
        ageGroupStartRange : { 
            type: Number,
            required : false
        },
        ageGroupEndRange : { 
            type: Number,
            required : false
        },
        ageGroupUnit : { 
            type: String,
            required : false
        },
        range : { 
            type: String,
            required : true
        },
        bodyCondition : { 
            type: String,
            required : false
        },
    }
})

const bioMarker = mongoose.model("BioMarker", bioMarkerSchema);
module.exports = bioMarker;
