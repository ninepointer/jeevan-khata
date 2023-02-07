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
            // required : true
        },
        unitConversionId : { 
            type: String,
            // required : true
        },
        value : { 
            type: Number,
            // required : true
        },
        id : { 
            type: String,
            // required : true
        },
        created_On:{
            type: Date,
            default: Date.now(),
            // required : true
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
        is_Deleted:{
            type: Boolean,
            default: false,
            // required : true
        },
        bioMarkers:{
            type: String,
            // required : true
        }
    }]
})

unitSchema.pre('save', function (next) {
    if (!this.uid) {
        // this.lastModifiedOn = Date.now();
        this.uid = uuidv4();
        const random6DigitNumber = Math.floor(Math.random() * 900000) + 100000;
        if(this.unitConversion[0]){
            this.unitConversion[0].id = uuidv4() + random6DigitNumber;
        }
        return next();
    };
    // this.lastModifiedOn = Date.now();
    next();
  });

//   roleSchema.pre('save', async function(next){
//     if(!this.createdBy){
//         this.createdBy = this._id;
//     }
//     if(!this.lastModifiedBy){
//         this.lastModifiedBy = this._id;
//     }
//     (this as any).lastModifiedOn = Date.now();
//     next();
// });

  unitSchema.pre('save', async function(next){
    if(!this.createdBy){
        this.createdBy = this._id;
    }
    if(!this.lastModifiedBy){
      this.lastModifiedBy = this._id;
    }
    this.lastModifiedOn = Date.now();
    this.unitConversion.map((elem: { created_By: unknown; lastModified_By: unknown; lastModified_On: any; created_On: any; })=>{
        elem.created_By = this._id;
        elem.lastModified_By = this._id;
        elem.lastModified_On = elem.created_On;
    
    })

    next();  
  });


const unit = mongoose.model("Unit", unitSchema);
export default unit;
