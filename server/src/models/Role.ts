import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

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
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required : true
    },
    isDeleted:{
        type: Boolean,
        default: false,
        // required : true
    },
    status:{
        type: String,
        default: 'Active',
        required : true
    },
    uid:{
        type: String,
        // required : true
    }
});


roleSchema.pre('save', function (next) {
    if (!this.uid) {
        this.uid = uuidv4();
        return next();
    };
    next();
  });

roleSchema.pre('save', async function(next){
    if(!this.createdBy){
        this.createdBy = this._id;
    }
    if(!this.lastModifiedBy){
        this.lastModifiedBy = this._id;
    }
    (this as any).lastModifiedOn = Date.now();
    console.log((this as any).lastModifiedOn)
    next();
});




const role = mongoose.model("Role", roleSchema);
export default role;
