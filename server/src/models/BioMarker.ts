import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';


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
        default: 'Active',
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
    alias:{
        type: [String],
        
        // required : true
    },
    bioMarkerTypes:[{
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
            required : false
        },
        bodyCondition : { 
            type: String,
            required : false
        },
        is_Deleted:{
            type: Boolean,
            default: false,
            // required : true
        }
        
    }]
})


bioMarkerSchema.pre('save', function (next) {
    if (!this.uid) {
        // this.lastModifiedOn = Date.now();
        this.uid = uuidv4();
        return next();
    };
    // this.lastModifiedOn = Date.now();
    next();
  });

  bioMarkerSchema.post('save', async function(doc, next){
    if(!doc.createdBy){
        doc.createdBy = doc._id;
    }
    if(!doc.lastModifiedBy){
      doc.lastModifiedBy = doc._id;
    }
    // doc.lastModifiedOn = Date.now();
    doc.save().then(() => {
      next();
    }).catch(err => {
      next(err);
    });
    next();  
  });

const bioMarker = mongoose.model("BioMarker", bioMarkerSchema);
export default bioMarker;

// function uuidv4(): string | undefined {
//     throw new Error("Function not implemented.");
// }
