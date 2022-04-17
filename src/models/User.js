const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  lastname: {
    type: String,
    // minlength: 4,
    trim: true,
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  avatar: {
    type: String,
    maxlength: 512,
    required: false
  },
  bio : {
    type : String,
    requried: false,
  },
  role: {
    type: String,
    enum: ["SUPERADMIN","ADMIN","USER"],
    default: "USER",
  },
  events : [
    {
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discount",
        index : true
      },
      times : Number,
      usedTimes : { type : Number, default : 0}
    }
  ],
  status: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
})
UserSchema.index({firstname: 'text', lastname: 'text', bio : 'text'});
module.exports = mongoose.model('User', UserSchema)