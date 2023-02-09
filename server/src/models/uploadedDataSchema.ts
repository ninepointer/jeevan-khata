import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

interface BioMarkerData {
    [key: string]: {
      result: string;
      range: string;
      unit: string;
    }
}


const uploadedDataSchema = new mongoose.Schema({
    name:{
        type: String,
        // required: true
    },
    age:{
        type: String,
        // required : true
    },
    gender:{
        type: String,
        // required : true
    },
    uid:{
        type: String,
        // required : true
    },
    createdOn:{
        type: Date,
        default: Date.now(),
        // required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required : true
    },
    lastModifiedOn:{
        type: Date,
        default: Date.now(),
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
    testName:{
        type: String,
    },
    lab:{
        type: String,
        // required : true
    },
    status:{
        type: String,
        default: 'Active',
        required : true
    },
    link:{
        type: String,
    },
    bioMarker: [{
        type: Object,
        // required: true
    }] as unknown as Array<BioMarkerData>

})



uploadedDataSchema.pre('save', function (next) {
    if (!this.uid) {
        // this.lastModifiedOn = Date.now();
        this.uid = uuidv4();
        return next();
    };
    // this.lastModifiedOn = Date.now();
    next();
  });

  uploadedDataSchema.pre('save', async function( next){
    if(!this.createdBy){
        this.createdBy = this._id;
    }
    if(!this.lastModifiedBy){
      this.lastModifiedBy = this._id;
    }

    (this as any).lastModifiedOn = Date.now();

    next();  
  });

const upload = mongoose.model("uploadedData", uploadedDataSchema);
export default upload;

