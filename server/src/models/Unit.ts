import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const unitSchema: mongoose.Schema = new mongoose.Schema({
    unitFullName:{
        type: String,
        required: true
    },
    unitId:{
        type: String,
        required: true
    },
    uid:{
        type: String,
        // required: true
    },
    createdOn:{
        type: Date,
        default: Date.now(),
        required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required : true
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
        required : true
    },
    status:{
        type: String,
        default: 'Active',
        required : true
    },
    unitConversion:[{
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
            // required : true
        },
        created_On:{
            type: Date,
            default: Date.now(),
            required : true
        },
        created_By:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required : true
        },
        lastModified_On:{
            type: Date,
            // required : true
        },
        lastModified_By:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required : true
        },
    }]
})

unitSchema.pre('save', function (next) {
    if (!this.uid) {
        // this.lastModifiedOn = Date.now();
        this.uid = uuidv4();
        const random6DigitNumber = Math.floor(Math.random() * 900000) + 100000;
        this.unitConversion[0].id = uuidv4() + random6DigitNumber;
        return next();
    };
    // this.lastModifiedOn = Date.now();
    next();
  });

  unitSchema.post('save', async function(doc, next){
    if(!doc.createdBy){
        doc.createdBy = doc._id;
    }
    if(!doc.lastModifiedBy){
      doc.lastModifiedBy = doc._id;
    }
    doc.lastModifiedOn = Date.now();
    doc.unitConversion.map((elem: { created_By: unknown; lastModified_By: unknown; lastModified_On: any; created_On: any; })=>{
        elem.created_By = doc._id;
        elem.lastModified_By = doc._id;
        elem.lastModified_On = elem.created_On;
    
    })
    doc.save().then(() => {
      next();
    }).catch(err => {
      next(err);
    });
    next();  
  });


const unit = mongoose.model("Unit", unitSchema);
export default unit;
