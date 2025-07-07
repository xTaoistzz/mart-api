const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [ true, 'Username is required'],
      unique: true,
      trim: true,  
    },
    email: {
      type: String,
      required: [ true, 'Email is Required'],
      unique: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },
    password: { 
        type: String, 
        required: [ true, 'Password is required'],
    },
    isApprove: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
