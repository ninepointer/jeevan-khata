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

  labSchema.post('save', async function(doc, next){
    if(!doc.createdBy){
        doc.createdBy = doc._id;
    }
    if(!doc.lastModifiedBy){
      doc.lastModifiedBy = doc._id;
    }
    // doc.lastModifiedOn = doc.createdOn
    doc.save().then(() => {
      next();
    }).catch(err => {
      next(err);
    });
    next();  
  });

const labTest = mongoose.model("labTest", labSchema);
export default labTest;


