import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

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
        // required : true
    },
    mobile:{
        type: String,
        // required : true
    },
    authId: String,
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
    profilePhoto: String,
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
    referralCode: String,
    referredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    jeevanKhataId:{
        type: String,
        // required : true
    },
    address:{
        type: String,
        // required : true
    },
    isOnBoarded: {
        type: Boolean,
        default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    documents: [{type:Schema.Types.ObjectId, ref: 'uploadedData'}],
    familyTree: [{
        relation: {
          type: String,
        },
        profile: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        }
      }],
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

  userSchema.pre('save', function (next) {
    console.log("in the presave", this._id)
    if (!this.createdBy) {
        this.createdBy = this._id;

        return next();
    };
    next();
  });

userSchema.pre('findOneAndUpdate', function(next){
    this.set({lastModifiedOn: Date.now()});
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

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };

const user = mongoose.model("User", userSchema);
export default user;


// TODO : role not updating in role, modifiedby createdby not updating,
// length for unit and biomarker, infinity loop in post middleware