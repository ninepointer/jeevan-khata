const User = require("../models/User");

exports.createUser = async() => {
 

    const {firstName, lastName, email, mobile, gender, dateOfBirth, city, state, aadhaarCardNumber, password, passwordChangedOn, otp, role, createdOn, createdBy, lastModifiedOn, lastModifiedBy, isDeleted, uid, jeevanKhataId} = req.body;
    console.log(req.body)
    if(!firstName || !lastName || !email || !mobile || !gender || !dateOfBirth || city || state || aadhaarCardNumber || password || passwordChangedOn || otp || role || createdOn || createdBy || lastModifiedOn || lastModifiedBy || isDeleted || !uid || !jeevanKhataId){
        console.log("Data Incomplete");
        return res.status(422).json({error : "Please fill all the required fields"})
    }

    User.findOne({email : email})
    .then((userExist)=>{
        if(userExist){
            console.log("Data Already Present");
            return res.status(422).json({error : "User Already Exists"})
        }
        const userData = new User({firstName, lastName, email, mobile, gender, dateOfBirth, city, state, aadhaarCardNumber, password, passwordChangedOn, otp, role, createdOn, createdBy, lastModifiedOn, lastModifiedBy, isDeleted, uid, jeevanKhataId});
        console.log(userData)
        userData.save().then(()=>{
            res.status(201).json({massage : "User Created Successfully"});
        }).catch((err)=> res.status(500).json({error:"Database error while creating user"}));
    }).catch(err => {console.log(err, "Database error while checking for existing user")});
}