const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        maxLength: 60,
        minLength: 3,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter valid email address");
            }
        },
        required: true,
    },
    password: {
        type: String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            }
        },
        required: true,
    },
    role: {
        type: String,
        enum: {
            values: ["teacher", "student"],
            message: `{VALUE} is not a valid role type`
        }
    }
},  { timestamps: true, });

module.exports = mongoose.model("User", userSchema);