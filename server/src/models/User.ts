import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const userSchema: mongoose.Schema = new mongoose.Schema({
    firstName:{
        type: String,
        // required: true
    },
    lastName:{
        type: String,
        // required : true
    },
    email:{
        type: String,
        required : true
    },
    mobile:{
        type: String,
        required : true
    },
    gender:{
        type: String,
        // required : true
    },
    dateOfBirth:{
        type: Date,
        // required : true
    },
    height: Number,
    weight: Number,
    city:{
        type: String,
        // required : true
    },
    state:{
        type: String,
        // required : true
    },
    aadhaarCardNumber:{
        type: Number,
        // required : false
    },
    password:{
        type: String,
        required : false
    },
    
    passwordChangedAt:{
        type: Date,
        required : false
    },
    otp:{
        type: Number,
        required : false
    },
    role:{
        type: Schema.Types.ObjectId,
        ref: 'Role',
        default: Object('63cc2464c60a8373837d3235'),
        required : false
    },
    createdOn:{
        type: Date,
        default: Date.now(),
        // required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : false
    },
    lastModifiedOn:{
        type: Date,
        // required : true
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : false
    },
    isDeleted:{
        type: Boolean,
        default: false,
        // required : true
    },
    uid:{
        type: String,
        // default: false,
        // required : true
    },
    jeevanKhataId:{
        type: String,
        // required : true
    },
});

//check password
userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string
  ):Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

 //check if password has changed after issuing the token 
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp: number) {
    if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(
        String(this.passwordChangedAt.getTime()/1000),
        10
      );
      return jwtTimeStamp < changedTimeStamp;
    }
    return false;
  };
  
// 
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        this.lastModifiedOn = Date.now();
        this.uid = uuidv4();
        return next();
    };
    this.lastModifiedOn = Date.now();
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

//Hashing user password  
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
  
    this.passwordConfirm = undefined;
    next();
  });

//Adding the jk id before saving
userSchema.pre('save', async function(next){
    if(!this.jeevanKhataId|| this.isNew){
        const count = await user.countDocuments();
        const userId = "JK" + (count + 1).toString().padStart(8, "0");
        this.jeevanKhataId = userId;
        next();
    }
    next();
})


//Updating the createdBy field   
userSchema.post('save', async function(doc, next){
  if(!doc.createdBy){
      doc.createdBy = doc._id;
  }
  if(!doc.lastModifiedBy){
    doc.lastModifiedBy = doc._id;
  }
  doc.lastModifiedOn = Date.now();
  doc.save().then(() => {
    next();
  }).catch(err => {
    next(err);
  });
  next();  
});



const user = mongoose.model("User", userSchema);
export default user;
