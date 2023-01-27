import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';


const labSchema = new mongoose.Schema({
    testName:{
        type: String,
        required: true
    },
    testScientificName:{
        type: String,
        required : true
    },
    bioMarkers:{
        type: [String],
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
        // default: Date.now(),
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
        // required : true
    },

})


labSchema.pre('save', function (next) {
    if (!this.uid) {
        // this.lastModifiedOn = Date.now();
        this.uid = uuidv4();
        return next();
    };

    let data = Date.now();
    // this.lastModifiedOn = 2;
    next();
  });

labSchema.pre('save', async function(next){
    if(!this.createdBy){
        this.createdBy = this._id;
    }
    if(!this.lastModifiedBy){
        this.lastModifiedBy = this._id;
    }
    (this as any).lastModifiedOn = Date.now();
    next();
});

const labTest = mongoose.model("labTest", labSchema);
export default labTest;


